<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use App\Models\Product;
use App\Models\Warehouse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class InventoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $inventories = Inventory::with('warehouse', 'responsible')
            ->when($request->search, fn ($query, $search) => $query->where('reference', 'like', "%{$search}%"))
            ->when($request->warehouse_id, fn ($query, $warehouseId) => $query->where('warehouse_id', $warehouseId))
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->latest()
            ->paginate(25);

        return response()->json($inventories);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'warehouse_id' => 'required|exists:warehouses,id',
            'method' => 'required|string|in:complet,tournant,partiel',
            'notes' => 'nullable|string',
        ]);

        $warehouse = Warehouse::findOrFail($validated['warehouse_id']);
        $products = Product::all();

        $inventory = DB::transaction(function () use ($validated, $request, $products) {
            $inventory = Inventory::create([
                'reference' => 'INV-' . strtoupper(Str::random(8)),
                'warehouse_id' => $validated['warehouse_id'],
                'method' => $validated['method'],
                'start_date' => now(),
                'status' => 'en_cours',
                'articles_count' => $products->count(),
                'responsible_id' => $request->user()->id,
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($products as $product) {
                $inventory->items()->create([
                    'product_id' => $product->id,
                    'theoretical_stock' => $product->stock,
                    'real_stock' => 0,
                    'difference' => -$product->stock,
                ]);
            }

            return $inventory;
        });

        return response()->json($inventory->load('warehouse', 'responsible', 'items.product'), 201);
    }

    public function show(Inventory $inventory): JsonResponse
    {
        return response()->json($inventory->load('warehouse', 'responsible', 'items.product'));
    }

    public function update(Request $request, Inventory $inventory): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'sometimes|string|in:en_cours,termine,valide,annule',
            'gap_percent' => 'nullable|numeric',
            'gap_value' => 'nullable|numeric',
            'notes' => 'nullable|string',
            'items' => 'array',
            'items.*.id' => 'required|exists:inventory_items,id',
            'items.*.real_stock' => 'required|integer|min:0',
        ]);

        if (isset($validated['items'])) {
            foreach ($validated['items'] as $item) {
                $inventoryItem = $inventory->items()->findOrFail($item['id']);
                $difference = $item['real_stock'] - $inventoryItem->theoretical_stock;

                $inventoryItem->update([
                    'real_stock' => $item['real_stock'],
                    'difference' => $difference,
                ]);
            }
        }

        if (isset($validated['status']) && $validated['status'] === 'termine') {
            $validated['end_date'] = now();
        }

        $inventory->update(collect($validated)->except('items')->toArray());

        return response()->json($inventory->load('warehouse', 'responsible', 'items.product'));
    }

    public function destroy(Inventory $inventory): JsonResponse
    {
        $inventory->delete();

        return response()->json(['message' => 'Inventaire supprimé.']);
    }
}
