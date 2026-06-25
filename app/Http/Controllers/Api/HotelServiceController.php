<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HotelService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HotelServiceController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(HotelService::orderBy('name')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'category' => 'required|string',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'status' => 'required|string|in:active,inactive',
        ]);

        $service = HotelService::create($validated);

        return response()->json($service, 201);
    }

    public function show(HotelService $hotelService): JsonResponse
    {
        return response()->json($hotelService);
    }

    public function update(Request $request, HotelService $hotelService): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string',
            'category' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'description' => 'nullable|string',
            'status' => 'sometimes|string|in:active,inactive',
        ]);

        $hotelService->update($validated);

        return response()->json($hotelService);
    }

    public function destroy(HotelService $hotelService): JsonResponse
    {
        $hotelService->delete();

        return response()->json(['message' => 'Service supprimé.']);
    }
}
