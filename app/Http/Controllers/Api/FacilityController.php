<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FacilityController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $facilities = Facility::query()
            ->when($request->search, fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->when($request->type, fn ($query, $type) => $query->where('type', $type))
            ->orderBy('name')
            ->get();

        return response()->json($facilities);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'price_access' => 'required|numeric|min:0',
            'status' => 'required|string|in:active,inactive',
        ]);

        $facility = Facility::create($validated);

        return response()->json($facility, 201);
    }

    public function show(Facility $facility): JsonResponse
    {
        return response()->json($facility);
    }

    public function update(Request $request, Facility $facility): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'type' => 'sometimes|string|max:255',
            'capacity' => 'sometimes|integer|min:1',
            'price_access' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|string|in:active,inactive',
        ]);

        $facility->update($validated);

        return response()->json($facility);
    }

    public function destroy(Facility $facility): JsonResponse
    {
        $facility->delete();

        return response()->json(['message' => 'Équipement supprimé.']);
    }
}
