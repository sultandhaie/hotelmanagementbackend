<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use App\Models\MeetingRoom;
use App\Models\Reservation;
use App\Models\Villa;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TvReceptionStreamController extends Controller
{
    public function __invoke(Request $request): StreamedResponse
    {
        $response = new StreamedResponse(function (): void {
            $lastHash = '';

            while (true) {
                $data = $this->getReceptionData();
                $hash = md5(json_encode($data));

                if ($hash !== $lastHash) {
                    echo 'data: '.json_encode($data)."\n\n";
                    if (ob_get_level() > 0) {
                        ob_flush();
                    }
                    flush();
                    $lastHash = $hash;
                }

                if (connection_aborted()) {
                    break;
                }

                sleep(3);
            }
        });

        $response->headers->set('Content-Type', 'text/event-stream');
        $response->headers->set('Cache-Control', 'no-cache');
        $response->headers->set('Connection', 'keep-alive');
        $response->headers->set('X-Accel-Buffering', 'no');

        return $response;
    }

    private function getReceptionData(): array
    {
        $today = now()->toDateString();

        $totalVillas = Villa::where('status', 'active')->count();
        $occupiedVillas = Reservation::where('reservable_type', Villa::class)
            ->where('arrival_date', '<=', $today)
            ->where('departure_date', '>=', $today)
            ->whereNotIn('status', ['annulee', 'check_out'])
            ->distinct('reservable_id')
            ->count('reservable_id');

        $totalFacilities = Facility::where('status', 'active')->count();
        $activeFacilityUsers = Reservation::where('reservable_type', Facility::class)
            ->whereDate('date', $today)
            ->whereNotIn('status', ['annulee'])
            ->sum('attendees');

        $totalMeetingRooms = MeetingRoom::where('status', 'active')->count();
        $occupiedMeetingRooms = Reservation::where('reservable_type', MeetingRoom::class)
            ->where('arrival_date', '<=', $today)
            ->where('departure_date', '>=', $today)
            ->whereNotIn('status', ['annulee', 'check_out'])
            ->distinct('reservable_id')
            ->count('reservable_id');

        $arrivals = Reservation::with('client', 'reservable')
            ->whereDate('arrival_date', $today)
            ->whereIn('status', ['en_attente', 'confirmee', 'check_in'])
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

        $departures = Reservation::with('client', 'reservable')
            ->whereDate('departure_date', $today)
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

        $activeGuests = Reservation::with('client', 'reservable')
            ->whereDate('arrival_date', '<=', $today)
            ->whereDate('departure_date', '>=', $today)
            ->where('status', 'check_in')
            ->orderBy('arrival_date', 'desc')
            ->get()
            ->map(fn ($r) => [
                'time' => $r->start_time ? date('H:i', strtotime($r->start_time)) : '—',
                'name' => $r->client?->name ?? $r->client?->company ?? 'Client',
                'room' => $r->reservable?->name ?? '—',
                'is_corporate' => $r->client?->type === 'Entreprise',
                'status' => $r->status,
                'reservable_type' => class_basename($r->reservable_type),
                'nights' => $r->nights,
                'arrival_date' => $r->arrival_date,
                'departure_date' => $r->departure_date,
            ]);

        $facilities = Facility::where('status', 'active')->get();
        $facilityReservations = Reservation::where('reservable_type', Facility::class)
            ->whereDate('date', $today)
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
            ->whereDate('arrival_date', $today)
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

        $yesterday = now()->subDay()->toDateString();
        $reservationsToday = Reservation::whereDate('date', $today)->count();
        $reservationsYesterday = Reservation::whereDate('date', $yesterday)->count();

        return [
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
            'active_guests' => $activeGuests,
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
        ];
    }
}
