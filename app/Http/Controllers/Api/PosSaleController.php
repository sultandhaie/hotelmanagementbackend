<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PosSale;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PosSaleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $sales = PosSale::with('user', 'items.product')
            ->when($request->search, fn ($query, $search) => $query->where('reference', 'like', "%{$search}%"))
            ->when($request->point_of_sale, fn ($query, $pos) => $query->where('point_of_sale', $pos))
            ->when($request->payment_method, fn ($query, $method) => $query->where('payment_method', $method))
            ->latest()
            ->paginate(25);

        return response()->json($sales);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'point_of_sale' => 'required|string|in:reception,restaurant,piscine',
            'client_name' => 'nullable|string|max:255',
            'table_number' => 'nullable|string|max:255',
            'payment_method' => 'required|string|in:especes,carte,mobile,virement',
            'amount_received' => 'required|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $sale = DB::transaction(function () use ($validated, $request) {
            $subtotal = 0;
            $saleItems = [];

            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                $total = $product->sale_price * $item['quantity'];
                $subtotal += $total;

                $saleItems[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->sale_price,
                    'total' => $total,
                ];

                $product->decrement('stock', $item['quantity']);
            }

            $serviceCharge = round($subtotal * 0.10, 2);
            $total = $subtotal + $serviceCharge;
            $changeAmount = max(0, $validated['amount_received'] - $total);

            $sale = PosSale::create([
                'reference' => 'VNT-'.strtoupper(Str::random(8)),
                'point_of_sale' => $validated['point_of_sale'],
                'user_id' => $request->user()->id,
                'client_name' => $validated['client_name'] ?? null,
                'table_number' => $validated['table_number'] ?? null,
                'subtotal' => $subtotal,
                'service_charge' => $serviceCharge,
                'total' => $total,
                'payment_method' => $validated['payment_method'],
                'amount_received' => $validated['amount_received'],
                'change_amount' => $changeAmount,
            ]);

            $sale->items()->createMany($saleItems);

            return $sale;
        });

        return response()->json($sale->load('user', 'items.product'), 201);
    }

    public function show(PosSale $posSale): JsonResponse
    {
        return response()->json($posSale->load('user', 'items.product'));
    }
}
