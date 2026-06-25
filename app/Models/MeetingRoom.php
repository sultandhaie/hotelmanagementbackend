<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MeetingRoom extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'capacity', 'floor', 'image', 'price_per_hour', 'status'];

    protected function casts(): array
    {
        return [
            'price_per_hour' => 'decimal:2',
            'capacity' => 'integer',
        ];
    }

    public function reservations(): HasMany
    {
        return $this->morphMany(Reservation::class, 'reservable');
    }
}
