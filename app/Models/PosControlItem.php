<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PosControlItem extends Model
{
    use HasFactory;

    protected $fillable = ['pos_control_id', 'product_id', 'theoretical_stock', 'real_stock', 'difference'];

    public function control(): BelongsTo
    {
        return $this->belongsTo(PosControl::class, 'pos_control_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
