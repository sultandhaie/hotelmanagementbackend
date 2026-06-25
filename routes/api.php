<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\FacilityController;
use App\Http\Controllers\Api\HotelServiceController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\MeetingRoomController;
use App\Http\Controllers\Api\PosControlController;
use App\Http\Controllers\Api\PosSaleController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\RestaurantTableController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\StockMovementController;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\Api\TvReceptionController;
use App\Http\Controllers\Api\TvReceptionStreamController;
use App\Http\Controllers\Api\VillaController;
use App\Http\Controllers\Api\WarehouseController;
use App\Http\Middleware\EnsureUserHasRole;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

// TV Reception Dashboard — public, no auth required
Route::get('/tv/reception', TvReceptionController::class);
Route::get('/tv/reception/stream', TvReceptionStreamController::class);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/dashboard', DashboardController::class);

    // Settings
    Route::get('/settings', [SettingController::class, 'index']);
    Route::put('/settings', [SettingController::class, 'update']);
    Route::apiResource('restaurant-tables', RestaurantTableController::class);
    Route::apiResource('hotel-services', HotelServiceController::class);

    // Existing resources
    Route::apiResource('meeting-rooms', MeetingRoomController::class);
    Route::apiResource('villas', VillaController::class);
    Route::apiResource('facilities', FacilityController::class);
    Route::get('/clients/stats', [ClientController::class, 'stats']);
    Route::apiResource('clients', ClientController::class);
    Route::apiResource('reservations', ReservationController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('suppliers', SupplierController::class);
    Route::apiResource('products', ProductController::class);
    Route::apiResource('warehouses', WarehouseController::class);
    Route::apiResource('stock-movements', StockMovementController::class);
    Route::apiResource('pos-sales', PosSaleController::class)->only(['index', 'store', 'show']);
    Route::apiResource('inventories', InventoryController::class);
    Route::apiResource('pos-controls', PosControlController::class);

    Route::middleware(EnsureUserHasRole::class.':admin')->group(function () {
        Route::apiResource('warehouses', WarehouseController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('stock-movements', StockMovementController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('inventories', InventoryController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('pos-controls', PosControlController::class)->only(['store', 'update', 'destroy']);
    });
});
