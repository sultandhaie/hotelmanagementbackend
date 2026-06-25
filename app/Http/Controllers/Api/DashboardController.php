<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Inventory;
use App\Models\PosSale;
use App\Models\Product;
use App\Models\Reservation;
use App\Models\Supplier;
use App\Models\Villa;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

        $totalVillas = Villa::where('status', 'active')->count();
        $occupiedVillas = Reservation::where('reservable_type', Villa::class)
            ->where('arrival_date', '<=', $today)
            ->where('departure_date', '>=', $today)
            ->whereNotIn('status', ['annulee', 'check_out'])
            ->distinct('reservable_id')
            ->count('reservable_id');
        $occupationPercent = $totalVillas > 0 ? round($occupiedVillas / $totalVillas * 100) : 0;

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
            'villas_occupied' => $occupiedVillas,
            'villas_total' => $totalVillas,
            'occupation_percent' => $occupationPercent,
            'revenue_today' => $revenueToday,
            'revenue_trend' => $revenueTrend,
            'low_stock_products' => $lowStockProducts,
            'unpaid_invoices' => $unpaidInvoices,
            'unpaid_amount' => $unpaidAmount,
        ]);
    }
}
