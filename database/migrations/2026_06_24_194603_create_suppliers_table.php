<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category');
            $table->string('contact');
            $table->string('phone');
            $table->string('email')->nullable();
            $table->string('city');
            $table->string('address')->nullable();
            $table->string('nif')->nullable();
            $table->string('nis')->nullable();
            $table->string('payment_terms')->nullable();
            $table->boolean('is_vip')->default(false);
            $table->string('status')->default('actif');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('suppliers');
    }
};
