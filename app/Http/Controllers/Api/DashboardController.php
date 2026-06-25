<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PosSale;
use App\Models\Product;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\Villa;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $today = now()->toDateString();
        $yesterday = now()->subDay()->toDateString();

        $reservationsToday = Reservation::whereDate('date', $today)->count();
        $reservationsYesterday = Reservation::whereDate('date', $yesterday)->count();
        $reservationTrend = $reservationsYesterday > 0
            ? round(($reservationsToday - $reservationsYesterday) / $reservationsYesterday * 100)
            : 0;

        $excludedReservationStatuses = ['annulee', 'check_out'];

        $totalVillas = Villa::where('status', 'active')->count();
        $occupiedVillas = Reservation::where('reservable_type', 'villa')
            ->where('arrival_date', '<=', $today)
            ->where('departure_date', '>=', $today)
            ->whereNotIn('status', $excludedReservationStatuses)
            ->distinct('reservable_id')
            ->count('reservable_id');

        $totalRooms = Room::where('status', 'active')->count();
        $occupiedRooms = Reservation::where('reservable_type', 'room')
            ->where('arrival_date', '<=', $today)
            ->where('departure_date', '>=', $today)
            ->whereNotIn('status', $excludedReservationStatuses)
            ->distinct('reservable_id')
            ->count('reservable_id');

        $totalHebergement = $totalVillas + $totalRooms;
        $occupiedHebergement = $occupiedVillas + $occupiedRooms;
        $occupationPercent = $totalHebergement > 0 ? round($occupiedHebergement / $totalHebergement * 100) : 0;

        $revenueToday = PosSale::whereDate('created_at', $today)->sum('total');
        $revenueYesterday = PosSale::whereDate('created_at', $yesterday)->sum('total');
        $revenueTrend = $revenueYesterday > 0
            ? round(($revenueToday - $revenueYesterday) / $revenueYesterday * 100)
            : 0;

        $lowStockProducts = Product::where('status', 'stock_faible')->count();

        $unpaidInvoices = Reservation::where('payment_status', 'non_paye')->count();
        $unpaidAmount = Reservation::where('payment_status', 'non_paye')->sum('amount');

        return response()->json([
            'reservations_today' => $reservationsToday,
            'reservation_trend' => $reservationTrend,
            'hebergement_occupied' => $occupiedHebergement,
            'hebergement_total' => $totalHebergement,
            'occupation_percent' => $occupationPercent,
            'villas_occupied' => $occupiedVillas,
            'villas_total' => $totalVillas,
            'rooms_occupied' => $occupiedRooms,
            'rooms_total' => $totalRooms,
            'revenue_today' => $revenueToday,
            'revenue_trend' => $revenueTrend,
            'low_stock_products' => $lowStockProducts,
            'unpaid_invoices' => $unpaidInvoices,
            'unpaid_amount' => $unpaidAmount,
        ]);
    }
}
