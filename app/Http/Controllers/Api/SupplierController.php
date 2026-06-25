<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $suppliers = Supplier::query()
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('contact', 'like', "%{$search}%")
                        ->orWhere('city', 'like', "%{$search}%");
                });
            })
            ->when($request->category, fn ($query, $category) => $query->where('category', $category))
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->orderBy('name')
            ->get();

        return response()->json($suppliers);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'contact' => 'required|string|max:255',
            'phone' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'city' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'nif' => 'nullable|string|max:255',
            'nis' => 'nullable|string|max:255',
            'payment_terms' => 'nullable|string|max:255',
            'is_vip' => 'boolean',
            'status' => 'sometimes|string|in:actif,inactif',
        ]);

        $supplier = Supplier::create($validated);

        return response()->json($supplier, 201);
    }

    public function show(Supplier $supplier): JsonResponse
    {
        return response()->json($supplier);
    }

    public function update(Request $request, Supplier $supplier): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'contact' => 'required|string|max:255',
            'phone' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'city' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'nif' => 'nullable|string|max:255',
            'nis' => 'nullable|string|max:255',
            'payment_terms' => 'nullable|string|max:255',
            'is_vip' => 'boolean',
            'status' => 'sometimes|string|in:actif,inactif',
        ]);

        $supplier->update($validated);

        return response()->json($supplier);
    }

    public function destroy(Supplier $supplier): JsonResponse
    {
        $supplier->delete();

        return response()->json(['message' => 'Fournisseur supprimé.']);
    }
}
