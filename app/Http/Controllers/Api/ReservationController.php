<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ReservationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $reservations = Reservation::with('client', 'reservable')
            ->when($request->search, function ($query, $search) {
                $query->where('reference', 'like', "%{$search}%")
                    ->orWhereHas('client', fn ($q) => $q->where('name', 'like', "%{$search}%"));
            })
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->when($request->payment_status, fn ($query, $status) => $query->where('payment_status', $status))
            ->when($request->reservable_type, fn ($query, $type) => $query->where('reservable_type', $type))
            ->latest()
            ->paginate(25);

        return response()->json($reservations);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'reservable_type' => 'required|string|in:meeting_room,villa,facility',
            'reservable_id' => 'required|integer',
            'date' => 'required|date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'arrival_date' => 'nullable|date',
            'departure_date' => 'nullable|date|after_or_equal:arrival_date',
            'nights' => 'nullable|integer|min:1',
            'attendees' => 'nullable|integer|min:1',
            'amount' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
            'payments' => 'nullable|array',
        ]);

        $validated['reference'] = 'RES-'.strtoupper(Str::random(8));
        $validated['payments'] = $validated['payments'] ?? [];

        $reservation = Reservation::create($validated);

        return response()->json($reservation->load('client', 'reservable'), 201);
    }

    public function show(Reservation $reservation): JsonResponse
    {
        return response()->json($reservation->load('client', 'reservable'));
    }

    public function update(Request $request, Reservation $reservation): JsonResponse
    {
        $validated = $request->validate([
            'client_id' => 'sometimes|exists:clients,id',
            'reservable_type' => 'sometimes|string|in:meeting_room,villa,facility',
            'reservable_id' => 'sometimes|integer',
            'date' => 'sometimes|date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'arrival_date' => 'nullable|date',
            'departure_date' => 'nullable|date|after_or_equal:arrival_date',
            'nights' => 'nullable|integer|min:1',
            'attendees' => 'nullable|integer|min:1',
            'amount' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|string|in:en_attente,confirmee,annulee,check_in,check_out',
            'payment_status' => 'sometimes|string|in:non_paye,acompte,paye',
            'notes' => 'nullable|string',
            'payments' => 'nullable|array',
        ]);

        $reservation->update($validated);

        return response()->json($reservation->load('client', 'reservable'));
    }

    public function destroy(Reservation $reservation): JsonResponse
    {
        $reservation->delete();

        return response()->json(['message' => 'Réservation supprimée.']);
    }
}
