<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MeetingRoom;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MeetingRoomController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $meetingRooms = MeetingRoom::query()
            ->when($request->search, fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->orderBy('name')
            ->get();

        return response()->json($meetingRooms);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'floor' => 'required|string|max:255',
            'image' => 'nullable|string|max:255',
            'price_per_hour' => 'required|numeric|min:0',
            'status' => 'required|string|in:active,inactive',
        ]);

        $meetingRoom = MeetingRoom::create($validated);

        return response()->json($meetingRoom, 201);
    }

    public function show(MeetingRoom $meetingRoom): JsonResponse
    {
        return response()->json($meetingRoom);
    }

    public function update(Request $request, MeetingRoom $meetingRoom): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'capacity' => 'sometimes|integer|min:1',
            'floor' => 'sometimes|string|max:255',
            'image' => 'nullable|string|max:255',
            'price_per_hour' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|string|in:active,inactive',
        ]);

        $meetingRoom->update($validated);

        return response()->json($meetingRoom);
    }

    public function destroy(MeetingRoom $meetingRoom): JsonResponse
    {
        $meetingRoom->delete();

        return response()->json(['message' => 'Salle de réunion supprimée.']);
    }
}
