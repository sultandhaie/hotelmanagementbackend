<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Villa;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VillaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $villas = Villa::query()
            ->when($request->search, fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->orderBy('name')
            ->get();

        return response()->json($villas);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'rooms' => 'required|integer|min:1',
            'capacity' => 'required|integer|min:1',
            'price_per_night' => 'required|numeric|min:0',
            'status' => 'required|string|in:active,inactive',
        ]);

        $villa = Villa::create($validated);

        return response()->json($villa, 201);
    }

    public function show(Villa $villa): JsonResponse
    {
        return response()->json($villa);
    }

    public function update(Request $request, Villa $villa): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'rooms' => 'sometimes|integer|min:1',
            'capacity' => 'sometimes|integer|min:1',
            'price_per_night' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|string|in:active,inactive',
        ]);

        $villa->update($validated);

        return response()->json($villa);
    }

    public function destroy(Villa $villa): JsonResponse
    {
        $villa->delete();

        return response()->json(['message' => 'Villa supprimée.']);
    }
}
