<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index(): JsonResponse
    {
        $settings = Setting::all()->keyBy('key');

        return response()->json($settings);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable|string',
            'settings.*.group' => 'sometimes|string',
        ]);

        foreach ($validated['settings'] as $item) {
            Setting::setValue($item['key'], $item['value'], $item['group'] ?? 'general');
        }

        return response()->json(['message' => 'Paramètres enregistrés.']);
    }
}
