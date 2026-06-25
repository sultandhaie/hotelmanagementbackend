<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference',
        'client_id',
        'reservable_type',
        'reservable_id',
        'date',
        'start_time',
        'end_time',
        'arrival_date',
        'departure_date',
        'nights',
        'attendees',
        'amount',
        'status',
        'payment_status',
        'notes',
        'payments',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'arrival_date' => 'date',
            'departure_date' => 'date',
            'amount' => 'decimal:2',
            'payments' => 'array',
        ];
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function reservable(): MorphTo
    {
        return $this->morphTo();
    }
}
