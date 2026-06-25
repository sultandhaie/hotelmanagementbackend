<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use App\Models\MeetingRoom;
use App\Models\Reservation;
use App\Models\Villa;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TvReceptionController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $today = now()->toDateString();

        // ── Resources occupancy ──
        $totalVillas = Villa::where('status', 'active')->count();
        $occupiedVillas = Reservation::where('reservable_type', Villa::class)
            ->where('arrival_date', '<=', $today)
            ->where('departure_date', '>=', $today)
            ->whereNotIn('status', ['annulee', 'check_out'])
            ->distinct('reservable_id')
            ->count('reservable_id');

        $totalFacilities = Facility::where('status', 'active')->count();
        $activeFacilityUsers = Reservation::where('reservable_type', Facility::class)
            ->where('date', $today)
            ->whereNotIn('status', ['annulee'])
            ->sum('attendees');

        $totalMeetingRooms = MeetingRoom::where('status', 'active')->count();
        $occupiedMeetingRooms = Reservation::where('reservable_type', MeetingRoom::class)
            ->where('arrival_date', '<=', $today)
            ->where('departure_date', '>=', $today)
            ->whereNotIn('status', ['annulee', 'check_out'])
            ->distinct('reservable_id')
            ->count('reservable_id');

        // ── Arrivals today ──
        $arrivals = Reservation::with('client', 'reservable')
            ->where('arrival_date', $today)
            ->whereNotIn('status', ['annulee', 'check_out'])
            ->orderBy('start_time')
            ->get()
            ->map(fn ($r) => [
                'time' => $r->start_time ? date('H:i', strtotime($r->start_time)) : '—',
                'name' => $r->client?->name ?? $r->client?->company ?? 'Client',
                'room' => $r->reservable?->name ?? '—',
                'is_corporate' => $r->client?->type === 'Entreprise',
                'status' => $r->status,
                'reservable_type' => class_basename($r->reservable_type),
            ]);

        // ── Departures today ──
        $departures = Reservation::with('client', 'reservable')
            ->where('departure_date', $today)
            ->whereNotIn('status', ['annulee'])
            ->orderBy('end_time')
            ->get()
            ->map(fn ($r) => [
                'time' => $r->end_time ? date('H:i', strtotime($r->end_time)) : '—',
                'name' => $r->client?->name ?? $r->client?->company ?? 'Client',
                'room' => $r->reservable?->name ?? '—',
                'is_corporate' => $r->client?->type === 'Entreprise',
                'status' => $r->status,
                'reservable_type' => class_basename($r->reservable_type),
            ]);

        // ── Facility reservations for planning timeline ──
        $facilities = Facility::where('status', 'active')->get();
        $facilityReservations = Reservation::where('reservable_type', Facility::class)
            ->where('date', $today)
            ->whereNotIn('status', ['annulee'])
            ->with('reservable')
            ->get()
            ->map(fn ($r) => [
                'facility' => $r->reservable?->name ?? '—',
                'title' => $r->notes ?? $r->client?->name ?? 'Réservation',
                'start' => $r->start_time,
                'end' => $r->end_time,
                'type' => $r->notes ? 'activity' : 'reservation',
            ]);

        $meetingRoomReservations = Reservation::where('reservable_type', MeetingRoom::class)
            ->where('arrival_date', $today)
            ->whereNotIn('status', ['annulee', 'check_out'])
            ->with('reservable')
            ->get()
            ->map(fn ($r) => [
                'facility' => $r->reservable?->name ?? '—',
                'title' => $r->notes ?? $r->client?->name ?? 'Réunion',
                'start' => $r->start_time ?? '09:00',
                'end' => $r->end_time ?? '17:00',
                'type' => 'meeting',
            ]);

        // ── Trend: compare today vs yesterday ──
        $yesterday = now()->subDay()->toDateString();
        $reservationsToday = Reservation::where('date', $today)->count();
        $reservationsYesterday = Reservation::where('date', $yesterday)->count();

        return response()->json([
            'resources' => [
                'villas' => [
                    'total' => $totalVillas,
                    'occupied' => $occupiedVillas,
                    'percent' => $totalVillas > 0 ? round($occupiedVillas / $totalVillas * 100) : 0,
                ],
                'facilities' => [
                    'total' => $totalFacilities,
                    'active_users' => (int) $activeFacilityUsers,
                    'capacity' => $facilities->sum('capacity'),
                    'percent' => $facilities->sum('capacity') > 0
                        ? round($activeFacilityUsers / $facilities->sum('capacity') * 100)
                        : 0,
                ],
                'meeting_rooms' => [
                    'total' => $totalMeetingRooms,
                    'occupied' => $occupiedMeetingRooms,
                    'percent' => $totalMeetingRooms > 0 ? round($occupiedMeetingRooms / $totalMeetingRooms * 100) : 0,
                ],
            ],
            'arrivals' => $arrivals,
            'departures' => $departures,
            'planning' => [
                'facilities' => $facilityReservations,
                'meeting_rooms' => $meetingRoomReservations,
            ],
            'trends' => [
                'reservations_today' => $reservationsToday,
                'reservations_yesterday' => $reservationsYesterday,
                'reservation_trend' => $reservationsYesterday > 0
                    ? round(($reservationsToday - $reservationsYesterday) / $reservationsYesterday * 100)
                    : 0,
            ],
        ]);
    }
}
