<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PosControl;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PosControlController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $controls = PosControl::with('controlledBy')
            ->when($request->search, fn ($query, $search) => $query->where('reference', 'like', "%{$search}%"))
            ->when($request->point_of_sale, fn ($query, $pos) => $query->where('point_of_sale', $pos))
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->latest()
            ->paginate(25);

        return response()->json($controls);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'point_of_sale' => 'required|string|in:reception,restaurant,piscine',
        ]);

        $products = Product::all();

        $control = DB::transaction(function () use ($validated, $request, $products) {
            $control = PosControl::create([
                'reference' => 'CTRL-' . strtoupper(Str::random(8)),
                'point_of_sale' => $validated['point_of_sale'],
                'controlled_by' => $request->user()->id,
                'control_date' => now()->toDateString(),
                'articles_count' => $products->count(),
                'status' => 'en_cours',
            ]);

            foreach ($products as $product) {
                $control->items()->create([
                    'product_id' => $product->id,
                    'theoretical_stock' => $product->stock,
                    'real_stock' => 0,
                    'difference' => -$product->stock,
                ]);
            }

            return $control;
        });

        return response()->json($control->load('controlledBy', 'items.product'), 201);
    }

    public function show(PosControl $posControl): JsonResponse
    {
        return response()->json($posControl->load('controlledBy', 'items.product'));
    }

    public function update(Request $request, PosControl $posControl): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'sometimes|string|in:en_cours,termine',
            'items' => 'array',
            'items.*.id' => 'required|exists:pos_control_items,id',
            'items.*.real_stock' => 'required|integer|min:0',
        ]);

        if (isset($validated['items'])) {
            foreach ($validated['items'] as $item) {
                $controlItem = $posControl->items()->findOrFail($item['id']);
                $difference = $item['real_stock'] - $controlItem->theoretical_stock;

                $controlItem->update([
                    'real_stock' => $item['real_stock'],
                    'difference' => $difference,
                ]);
            }

            $totalDifference = $posControl->items()->sum('difference');
            $totalValue = $posControl->items()->sum(\DB::raw('ABS(difference)'));
            $totalTheoretical = $posControl->items()->sum('theoretical_stock');

            $posControl->update([
                'difference' => $totalValue,
                'difference_percent' => $totalTheoretical > 0 ? round(($totalValue / $totalTheoretical) * 100, 2) : 0,
            ]);
        }

        $posControl->update(collect($validated)->except('items')->toArray());

        return response()->json($posControl->load('controlledBy', 'items.product'));
    }

    public function destroy(PosControl $posControl): JsonResponse
    {
        $posControl->delete();

        return response()->json(['message' => 'Contrôle POS supprimé.']);
    }
}
