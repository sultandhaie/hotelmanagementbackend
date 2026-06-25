<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RestaurantTable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RestaurantTableController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(RestaurantTable::orderBy('numero')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'numero' => 'required|string|unique:restaurant_tables,numero',
            'zone' => 'required|string',
            'capacity' => 'required|integer|min:1',
            'type' => 'required|string',
            'status' => 'required|string|in:active,inactive',
        ]);

        $table = RestaurantTable::create($validated);

        return response()->json($table, 201);
    }

    public function show(RestaurantTable $restaurantTable): JsonResponse
    {
        return response()->json($restaurantTable);
    }

    public function update(Request $request, RestaurantTable $restaurantTable): JsonResponse
    {
        $validated = $request->validate([
            'numero' => 'sometimes|string|unique:restaurant_tables,numero,'.$restaurantTable->id,
            'zone' => 'sometimes|string',
            'capacity' => 'sometimes|integer|min:1',
            'type' => 'sometimes|string',
            'status' => 'sometimes|string|in:active,inactive',
        ]);

        $restaurantTable->update($validated);

        return response()->json($restaurantTable);
    }

    public function destroy(RestaurantTable $restaurantTable): JsonResponse
    {
        $restaurantTable->delete();

        return response()->json(['message' => 'Table supprimée.']);
    }
}
