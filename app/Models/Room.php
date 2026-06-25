<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'floor',
        'capacity',
        'price_per_night',
        'status',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'price_per_night' => 'decimal:2',
            'floor' => 'integer',
            'capacity' => 'integer',
        ];
    }

    public function reservations(): MorphMany
    {
        return $this->morphMany(Reservation::class, 'reservable');
    }
}
