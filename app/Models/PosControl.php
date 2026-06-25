<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PosControl extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference',
        'point_of_sale',
        'controlled_by',
        'control_date',
        'articles_count',
        'difference',
        'difference_percent',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'control_date' => 'date',
            'difference' => 'decimal:2',
            'difference_percent' => 'decimal:2',
        ];
    }

    public function controlledBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'controlled_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(PosControlItem::class);
    }
}
