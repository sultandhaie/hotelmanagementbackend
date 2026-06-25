<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pos_controls', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->string('point_of_sale');
            $table->foreignId('controlled_by')->constrained('users');
            $table->date('control_date');
            $table->integer('articles_count')->default(0);
            $table->decimal('difference', 12, 2)->default(0);
            $table->decimal('difference_percent', 5, 2)->default(0);
            $table->string('status')->default('en_cours');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pos_controls');
    }
};
