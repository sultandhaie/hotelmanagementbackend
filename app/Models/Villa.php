<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Villa extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'rooms', 'capacity', 'price_per_night', 'status'];

    protected function casts(): array
    {
        return [
            'price_per_night' => 'decimal:2',
            'rooms' => 'integer',
            'capacity' => 'integer',
        ];
    }

    public function reservations(): HasMany
    {
        return $this->morphMany(Reservation::class, 'reservable');
    }
}
