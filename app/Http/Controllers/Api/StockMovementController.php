<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StockMovement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class StockMovementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $movements = StockMovement::with('product', 'warehouse', 'warehouseDestination')
            ->when($request->search, fn ($query, $search) => $query->where('reference', 'like', "%{$search}%"))
            ->when($request->type, fn ($query, $type) => $query->where('type', $type))
            ->when($request->warehouse_id, fn ($query, $warehouseId) => $query->where('warehouse_id', $warehouseId))
            ->when($request->product_id, fn ($query, $productId) => $query->where('product_id', $productId))
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->latest()
            ->paginate(25);

        return response()->json($movements);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|string|in:entree,sortie,transfert,ajustement,retour',
            'product_id' => 'required|exists:products,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'warehouse_destination_id' => 'nullable|exists:warehouses,id',
            'quantity' => 'required|integer',
            'value' => 'required|numeric|min:0',
            'document' => 'nullable|string|max:255',
            'reason' => 'nullable|string|max:255',
            'movement_date' => 'required|date',
        ]);

        $validated['reference'] = 'MV-'.strtoupper(Str::random(8));

        $movement = StockMovement::create($validated);

        return response()->json($movement->load('product', 'warehouse', 'warehouseDestination'), 201);
    }

    public function show(StockMovement $stockMovement): JsonResponse
    {
        return response()->json($stockMovement->load('product', 'warehouse', 'warehouseDestination'));
    }

    public function update(Request $request, StockMovement $stockMovement): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'sometimes|string|in:entree,sortie,transfert,ajustement,retour',
            'product_id' => 'sometimes|exists:products,id',
            'warehouse_id' => 'sometimes|exists:warehouses,id',
            'warehouse_destination_id' => 'nullable|exists:warehouses,id',
            'quantity' => 'sometimes|integer',
            'value' => 'sometimes|numeric|min:0',
            'document' => 'nullable|string|max:255',
            'reason' => 'nullable|string|max:255',
            'movement_date' => 'sometimes|date',
            'status' => 'sometimes|string|in:valide,en_attente,annule',
        ]);

        $stockMovement->update($validated);

        return response()->json($stockMovement->load('product', 'warehouse', 'warehouseDestination'));
    }

    public function destroy(StockMovement $stockMovement): JsonResponse
    {
        $stockMovement->delete();

        return response()->json(['message' => 'Mouvement de stock supprimé.']);
    }
}
