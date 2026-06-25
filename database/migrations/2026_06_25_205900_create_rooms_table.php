<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type')->default('standard'); // standard, double, suite, deluxe
            $table->integer('floor')->default(1);
            $table->integer('capacity')->default(2);
            $table->decimal('price_per_night', 10, 2)->default(0);
            $table->string('status')->default('active'); // active, inactive, maintenance
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
