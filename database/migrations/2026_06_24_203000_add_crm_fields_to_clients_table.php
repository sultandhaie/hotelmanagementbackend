<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->string('type')->default('Particulier')->after('name');
            $table->string('contact_name')->nullable()->after('type');
            $table->string('nationality')->default('Algérienne')->after('contact_name');
            $table->string('nationality_flag')->default('🇩🇿')->after('nationality');
            $table->string('segment')->default('Régulier')->after('nationality_flag');
            $table->decimal('total_spent', 14, 2)->default(0)->after('segment');
            $table->date('last_visit')->nullable()->after('total_spent');
            $table->string('status')->default('active')->after('last_visit');
            $table->text('address')->nullable()->after('status');
            $table->string('city')->nullable()->after('address');
            $table->date('birth_date')->nullable()->after('city');
            $table->string('nif')->nullable()->after('birth_date');
            $table->string('nis')->nullable()->after('nif');
            $table->text('notes')->nullable()->after('nis');
        });
    }

    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->dropColumn([
                'type', 'contact_name', 'nationality', 'nationality_flag', 'segment',
                'total_spent', 'last_visit', 'status', 'address', 'city',
                'birth_date', 'nif', 'nis', 'notes',
            ]);
        });
    }
};
