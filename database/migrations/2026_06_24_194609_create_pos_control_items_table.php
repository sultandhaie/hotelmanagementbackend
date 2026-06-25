<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pos_control_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pos_control_id')->constrained();
            $table->foreignId('product_id')->constrained();
            $table->integer('theoretical_stock');
            $table->integer('real_stock');
            $table->integer('difference');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pos_control_items');
    }
};
