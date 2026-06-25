<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->foreignId('client_id')->constrained();
            $table->string('reservable_type');
            $table->unsignedBigInteger('reservable_id');
            $table->date('date');
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->date('arrival_date')->nullable();
            $table->date('departure_date')->nullable();
            $table->integer('nights')->nullable();
            $table->integer('attendees')->nullable();
            $table->decimal('amount', 12, 2)->default(0);
            $table->string('status')->default('en_attente');
            $table->string('payment_status')->default('non_paye');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['reservable_type', 'reservable_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
