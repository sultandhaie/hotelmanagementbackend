<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Facility extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'type', 'capacity', 'price_access', 'status'];

    protected function casts(): array
    {
        return [
            'price_access' => 'decimal:2',
            'capacity' => 'integer',
        ];
    }

    public function reservations(): HasMany
    {
        return $this->morphMany(Reservation::class, 'reservable');
    }
}
