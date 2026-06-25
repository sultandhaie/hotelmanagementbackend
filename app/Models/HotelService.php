<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HotelService extends Model
{
    use HasFactory;

    protected $table = 'hotel_services';

    protected $fillable = ['name', 'category', 'price', 'description', 'status'];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
        ];
    }
}
