<?php

namespace Database\Seeders;

use App\Models\Client;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    public function run(): void
    {
        $clients = [
            [
                'name' => 'Ahmed Khaled', 'type' => 'Particulier', 'contact_name' => 'Ahmed Khaled',
                'phone' => '0555 12 34 56', 'email' => 'ahmed.khaled@email.dz',
                'nationality' => 'Algérienne', 'nationality_flag' => '🇩🇿', 'segment' => 'VIP',
                'total_spent' => 8450000, 'last_visit' => '2026-06-25', 'status' => 'active',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'name' => 'Sarah Benali', 'type' => 'Particulier', 'contact_name' => 'Sarah Benali',
                'phone' => '0551 45 67 89', 'email' => 'sarah.benali@email.dz',
                'nationality' => 'Algérienne', 'nationality_flag' => '🇩🇿', 'segment' => 'Régulier',
                'total_spent' => 3250000, 'last_visit' => '2026-06-24', 'status' => 'active',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'name' => 'Mohamed Essaid', 'type' => 'Entreprise', 'contact_name' => 'Mohamed Essaid',
                'phone' => '0552 78 90 12', 'email' => 'contact@essaid-dz.com',
                'nationality' => 'Algérienne', 'nationality_flag' => '🇩🇿', 'segment' => 'Entreprise',
                'total_spent' => 12850000, 'last_visit' => '2026-06-23', 'status' => 'active',
                'company' => 'Essaid Distribution', 'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'name' => 'Leïla Mansouri', 'type' => 'Particulier', 'contact_name' => 'Leïla Mansouri',
                'phone' => '0556 34 56 78', 'email' => 'leila.mansouri@email.dz',
                'nationality' => 'Française', 'nationality_flag' => '🇫🇷', 'segment' => 'Régulier',
                'total_spent' => 2150000, 'last_visit' => '2026-06-20', 'status' => 'active',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'name' => 'Yacine Ouali', 'type' => 'Particulier', 'contact_name' => 'Yacine Ouali',
                'phone' => '0553 22 11 44', 'email' => 'yacine.ouali@email.dz',
                'nationality' => 'Algérienne', 'nationality_flag' => '🇩🇿', 'segment' => 'VIP',
                'total_spent' => 9780000, 'last_visit' => '2026-06-20', 'status' => 'active',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'name' => 'Hôtel Le Palace', 'type' => 'Entreprise', 'contact_name' => 'Rachid Hamadi',
                'phone' => '0554 33 22 11', 'email' => 'resa@lepalace.com',
                'nationality' => 'Algérienne', 'nationality_flag' => '🇩🇿', 'segment' => 'Entreprise',
                'total_spent' => 15600000, 'last_visit' => '2026-06-19', 'status' => 'active',
                'company' => 'Le Palace Hôtel', 'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'name' => 'Nadia Rahmani', 'type' => 'Particulier', 'contact_name' => 'Nadia Rahmani',
                'phone' => '0557 65 43 21', 'email' => 'nadia.rahmani@email.dz',
                'nationality' => 'Algérienne', 'nationality_flag' => '🇩🇿', 'segment' => 'Régulier',
                'total_spent' => 1250000, 'last_visit' => '2026-06-18', 'status' => 'active',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'name' => 'Imad Merzouk', 'type' => 'Particulier', 'contact_name' => 'Imad Merzouk',
                'phone' => '0558 77 88 99', 'email' => 'imad.merzouk@email.dz',
                'nationality' => 'Tunisienne', 'nationality_flag' => '🇹🇳', 'segment' => 'Régulier',
                'total_spent' => 2900000, 'last_visit' => '2026-06-17', 'status' => 'inactive',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'name' => 'Karim Belkacem', 'type' => 'Particulier', 'contact_name' => 'Karim Belkacem',
                'phone' => '0559 11 22 33', 'email' => 'karim.belkacem@email.dz',
                'nationality' => 'Algérienne', 'nationality_flag' => '🇩🇿', 'segment' => 'Régulier',
                'total_spent' => 1800000, 'last_visit' => '2026-06-25', 'status' => 'active',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'name' => 'Amel Boukhalfa', 'type' => 'Particulier', 'contact_name' => 'Amel Boukhalfa',
                'phone' => '0560 44 55 66', 'email' => 'amel.boukhalfa@email.dz',
                'nationality' => 'Algérienne', 'nationality_flag' => '🇩🇿', 'segment' => 'Régulier',
                'total_spent' => 950000, 'last_visit' => '2026-06-24', 'status' => 'active',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'name' => 'Sofiane Rahmani', 'type' => 'Particulier', 'contact_name' => 'Sofiane Rahmani',
                'phone' => '0561 77 88 99', 'email' => 'sofiane.rahmani@email.dz',
                'nationality' => 'Algérienne', 'nationality_flag' => '🇩🇿', 'segment' => 'VIP',
                'total_spent' => 6700000, 'last_visit' => '2026-06-23', 'status' => 'active',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'name' => 'Walid Benyahya', 'type' => 'Particulier', 'contact_name' => 'Walid Benyahya',
                'phone' => '0562 00 11 22', 'email' => 'walid.benyahya@email.dz',
                'nationality' => 'Algérienne', 'nationality_flag' => '🇩🇿', 'segment' => 'Régulier',
                'total_spent' => 1400000, 'last_visit' => '2026-06-22', 'status' => 'active',
                'created_at' => now(), 'updated_at' => now(),
            ],
        ];

        foreach ($clients as $client) {
            Client::create($client);
        }
    }
}
