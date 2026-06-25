<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'contact_name',
        'email',
        'phone',
        'nationality',
        'nationality_flag',
        'segment',
        'total_spent',
        'last_visit',
        'status',
        'company',
        'id_type',
        'id_number',
        'address',
        'city',
        'birth_date',
        'nif',
        'nis',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'total_spent' => 'decimal:2',
            'last_visit' => 'date',
            'birth_date' => 'date',
        ];
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}
