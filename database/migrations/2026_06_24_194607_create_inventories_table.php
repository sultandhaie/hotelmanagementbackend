<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventories', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->foreignId('warehouse_id')->constrained();
            $table->string('method');
            $table->datetime('start_date');
            $table->datetime('end_date')->nullable();
            $table->string('status')->default('en_cours');
            $table->integer('articles_count')->default(0);
            $table->decimal('gap_percent', 5, 2)->nullable();
            $table->decimal('gap_value', 12, 2)->nullable();
            $table->foreignId('responsible_id')->constrained('users');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventories');
    }
};
