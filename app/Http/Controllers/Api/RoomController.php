<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $rooms = Room::query()
            ->when($request->search, fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->when($request->type, fn ($query, $type) => $query->where('type', $type))
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->orderBy('floor')
            ->orderBy('name')
            ->get();

        return response()->json($rooms);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:standard,double,suite,deluxe',
            'floor' => 'required|integer|min:0',
            'capacity' => 'required|integer|min:1',
            'price_per_night' => 'required|numeric|min:0',
            'status' => 'required|string|in:active,inactive,maintenance',
            'description' => 'nullable|string',
        ]);

        $room = Room::create($validated);

        return response()->json($room, 201);
    }

    public function show(Room $room): JsonResponse
    {
        return response()->json($room);
    }

    public function update(Request $request, Room $room): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'type' => 'sometimes|string|in:standard,double,suite,deluxe',
            'floor' => 'sometimes|integer|min:0',
            'capacity' => 'sometimes|integer|min:1',
            'price_per_night' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|string|in:active,inactive,maintenance',
            'description' => 'nullable|string',
        ]);

        $room->update($validated);

        return response()->json($room);
    }

    public function destroy(Room $room): JsonResponse
    {
        $room->delete();

        return response()->json(['message' => 'Chambre supprimée.']);
    }
}
