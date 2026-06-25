<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $products = Product::with('category', 'supplier')
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('reference', 'like', "%{$search}%")
                        ->orWhere('barcode', 'like', "%{$search}%");
                });
            })
            ->when($request->category_id, fn ($query, $categoryId) => $query->where('category_id', $categoryId))
            ->when($request->supplier_id, fn ($query, $supplierId) => $query->where('supplier_id', $supplierId))
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->orderBy('name')
            ->get();

        return response()->json($products);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'reference' => 'required|string|unique:products,reference',
            'barcode' => 'nullable|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'purchase_price' => 'required|numeric|min:0',
            'sale_price' => 'required|numeric|min:0',
            'stock' => 'integer|min:0',
            'unit' => 'required|string|max:255',
            'min_stock' => 'integer|min:0',
            'max_stock' => 'integer|min:0',
            'description' => 'nullable|string',
        ]);

        $product = Product::create($validated);

        return response()->json($product->load('category', 'supplier'), 201);
    }

    public function show(Product $product): JsonResponse
    {
        return response()->json($product->load('category', 'supplier'));
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'reference' => 'required|string|unique:products,reference,'.$product->id,
            'barcode' => 'nullable|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'purchase_price' => 'required|numeric|min:0',
            'sale_price' => 'required|numeric|min:0',
            'stock' => 'integer|min:0',
            'unit' => 'required|string|max:255',
            'min_stock' => 'integer|min:0',
            'max_stock' => 'integer|min:0',
            'description' => 'nullable|string',
        ]);

        $product->update($validated);

        return response()->json($product->load('category', 'supplier'));
    }

    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return response()->json(['message' => 'Produit supprimé.']);
    }
}
