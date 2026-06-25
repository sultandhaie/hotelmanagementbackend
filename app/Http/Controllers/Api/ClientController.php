<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $clients = Client::query()
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('contact_name', 'like', "%{$search}%")
                        ->orWhere('company', 'like', "%{$search}%");
                });
            })
            ->when($request->segment && $request->segment !== 'Tous', fn ($query) => $query->where('segment', $request->segment))
            ->when($request->status && $request->status !== 'Tous', fn ($query) => $query->where('status', strtolower($request->status)))
            ->when($request->nationality && $request->nationality !== 'Toutes', fn ($query) => $query->where('nationality', $request->nationality))
            ->orderBy('name')
            ->get();

        return response()->json($clients);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'nullable|string|in:Particulier,Entreprise',
            'contact_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'required|string|max:255',
            'nationality' => 'nullable|string|max:255',
            'nationality_flag' => 'nullable|string|max:10',
            'segment' => 'nullable|string|in:VIP,Régulier,Entreprise,Particulier',
            'company' => 'nullable|string|max:255',
            'id_type' => 'nullable|string|max:255',
            'id_number' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date',
            'nif' => 'nullable|string|max:255',
            'nis' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $validated['status'] = 'active';
        $validated['total_spent'] = 0;
        $validated['type'] = $validated['type'] ?? 'Particulier';

        $client = Client::create($validated);

        return response()->json($client, 201);
    }

    public function show(Client $client): JsonResponse
    {
        return response()->json($client->load('reservations'));
    }

    public function update(Request $request, Client $client): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'type' => 'sometimes|string|in:Particulier,Entreprise',
            'contact_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'nationality' => 'nullable|string|max:255',
            'nationality_flag' => 'nullable|string|max:10',
            'segment' => 'sometimes|string|in:VIP,Régulier,Entreprise,Particulier',
            'company' => 'nullable|string|max:255',
            'id_type' => 'nullable|string|max:255',
            'id_number' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date',
            'nif' => 'nullable|string|max:255',
            'nis' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'status' => 'sometimes|string|in:active,inactive',
        ]);

        $client->update($validated);

        return response()->json($client);
    }

    public function destroy(Client $client): JsonResponse
    {
        $client->delete();

        return response()->json(['message' => 'Client supprimé.']);
    }

    public function stats(): JsonResponse
    {
        $total = Client::count();
        $actifs = Client::where('status', 'active')->count();
        $vip = Client::where('segment', 'VIP')->count();
        $totalSpent = Client::sum('total_spent');
        $nouveaux = Client::where('last_visit', '>=', now()->subDays(30))->count();

        // Calculate trends
        $startOfThisMonth = now()->startOfMonth();
        $startOfLastMonth = now()->copy()->subMonth()->startOfMonth();
        $endOfLastMonth = now()->copy()->subMonth()->endOfMonth();

        // 1. Total clients trend
        $clientsBeforeThisMonth = Client::where('created_at', '<', $startOfThisMonth)->count();
        $clientsThisMonth = Client::where('created_at', '>=', $startOfThisMonth)->count();
        if ($clientsBeforeThisMonth > 0) {
            $totalTrendVal = ($clientsThisMonth / $clientsBeforeThisMonth) * 100;
            $total_trend = sprintf('%s%.1f%% ce mois-ci', $totalTrendVal >= 0 ? '+' : '', $totalTrendVal);
        } else {
            $total_trend = $clientsThisMonth > 0 ? sprintf('+%.1f%% ce mois-ci', 100.0) : '+0.0% ce mois-ci';
        }

        // 2. Nouveaux clients trend (comparing new clients created this month vs last month)
        $newClientsThisMonth = Client::whereBetween('created_at', [$startOfThisMonth, now()])->count();
        $newClientsLastMonth = Client::whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count();
        if ($newClientsLastMonth > 0) {
            $newTrendVal = (($newClientsThisMonth - $newClientsLastMonth) / $newClientsLastMonth) * 100;
            $nouveaux_trend = sprintf('%s%.1f%%', $newTrendVal >= 0 ? '+' : '', $newTrendVal);
        } else {
            $nouveaux_trend = $newClientsThisMonth > 0 ? sprintf('+%.1f%%', 100.0) : '+0.0%';
        }

        // 3. Total spent trend (comparing spending of reservations if they exist, otherwise clients)
        $hasReservations = Reservation::exists();
        if ($hasReservations) {
            $spentBeforeThisMonth = Reservation::where('created_at', '<', $startOfThisMonth)->sum('amount');
            $spentThisMonth = Reservation::where('created_at', '>=', $startOfThisMonth)->sum('amount');
        } else {
            $spentBeforeThisMonth = Client::where('created_at', '<', $startOfThisMonth)->sum('total_spent');
            $spentThisMonth = Client::where('created_at', '>=', $startOfThisMonth)->sum('total_spent');
        }

        if ($spentBeforeThisMonth > 0) {
            $spentTrendVal = ($spentThisMonth / $spentBeforeThisMonth) * 100;
            $total_spent_trend = sprintf('%s%.1f%%', $spentTrendVal >= 0 ? '+' : '', $spentTrendVal);
        } else {
            $total_spent_trend = $spentThisMonth > 0 ? sprintf('+%.1f%%', 100.0) : '+0.0%';
        }

        return response()->json([
            'total' => $total,
            'actifs' => $actifs,
            'vip' => $vip,
            'total_spent' => (float) $totalSpent,
            'nouveaux' => $nouveaux,
            'total_trend' => $total_trend,
            'nouveaux_trend' => $nouveaux_trend,
            'total_spent_trend' => $total_spent_trend,
        ]);
    }
}
