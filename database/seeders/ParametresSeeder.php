<?php

namespace Database\Seeders;

use App\Models\Facility;
use App\Models\HotelService;
use App\Models\MeetingRoom;
use App\Models\RestaurantTable;
use App\Models\Setting;
use App\Models\Villa;
use Illuminate\Database\Seeder;

class ParametresSeeder extends Seeder
{
    public function run(): void
    {
        RestaurantTable::insert([
            ['numero' => 'T01', 'zone' => 'Terrasse', 'capacity' => 2, 'type' => 'Table', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['numero' => 'T02', 'zone' => 'Terrasse', 'capacity' => 4, 'type' => 'Table', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['numero' => 'T03', 'zone' => 'Salle principale', 'capacity' => 6, 'type' => 'Table', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['numero' => 'T04', 'zone' => 'Salle principale', 'capacity' => 4, 'type' => 'Table', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['numero' => 'T05', 'zone' => 'Salle VIP', 'capacity' => 8, 'type' => 'Table VIP', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['numero' => 'T06', 'zone' => 'Salle VIP', 'capacity' => 10, 'type' => 'Table VIP', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['numero' => 'T07', 'zone' => 'Terrasse', 'capacity' => 2, 'type' => 'Table', 'status' => 'inactive', 'created_at' => now(), 'updated_at' => now()],
            ['numero' => 'T08', 'zone' => 'Terrasse', 'capacity' => 4, 'type' => 'Table', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
        ]);

        Villa::insert([
            ['name' => 'Villa Golden', 'rooms' => 3, 'capacity' => 6, 'price_per_night' => 45000, 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Villa Panorama', 'rooms' => 4, 'capacity' => 8, 'price_per_night' => 65000, 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Villa Prestige', 'rooms' => 5, 'capacity' => 10, 'price_per_night' => 85000, 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Villa Royale', 'rooms' => 6, 'capacity' => 12, 'price_per_night' => 120000, 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
        ]);

        Facility::insert([
            ['name' => 'Piscine Extérieure', 'type' => 'Extérieure', 'capacity' => 30, 'price_access' => 1000, 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Piscine Intérieure', 'type' => 'Intérieure', 'capacity' => 20, 'price_access' => 1500, 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Piscine Enfants', 'type' => 'Extérieure', 'capacity' => 15, 'price_access' => 500, 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Piscine VIP', 'type' => 'Extérieure', 'capacity' => 10, 'price_access' => 2000, 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
        ]);

        MeetingRoom::insert([
            ['name' => 'Salle Atlas', 'capacity' => 20, 'floor' => 'RDC', 'price_per_hour' => 2500, 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Salle Dunes', 'capacity' => 40, 'floor' => '1er étage', 'price_per_hour' => 4000, 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Salle Horizon', 'capacity' => 80, 'floor' => '2ème étage', 'price_per_hour' => 6000, 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Salle Prestige', 'capacity' => 120, 'floor' => '3ème étage', 'price_per_hour' => 10000, 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
        ]);

        HotelService::insert([
            ['name' => 'Petit déjeuner', 'category' => 'Restauration', 'price' => 1500, 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Room service', 'category' => 'Restauration', 'price' => 2000, 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Navette aéroport', 'category' => 'Transport', 'price' => 3000, 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Blanchisserie', 'category' => 'Hébergement', 'price' => 800, 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Parking', 'category' => 'Hébergement', 'price' => 500, 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
        ]);

        Setting::insert([
            ['key' => 'check_in_time', 'value' => '14:00', 'group' => 'hebergement', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'check_out_time', 'value' => '12:00', 'group' => 'hebergement', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'early_check_in', 'value' => '1', 'group' => 'hebergement', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'late_check_out', 'value' => '0', 'group' => 'hebergement', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'cancel_limit', 'value' => '24 heures avant l\'arrivée', 'group' => 'hebergement', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
