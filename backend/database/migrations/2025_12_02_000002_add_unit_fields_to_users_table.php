<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, create units table if not exists (to avoid foreign key constraint error)
        if (! Schema::hasTable('units')) {
            return;
        }

        Schema::table('users', function (Blueprint $table) {
            // Update role enum to include 'wadek'
            $table->dropColumn('role');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['admin', 'dekan', 'wadek', 'unit', 'sdm'])->default('sdm')->after('email_verified_at');
            $table->foreignId('unit_id')->nullable()->after('role')->constrained('units')->nullOnDelete();
            $table->timestamp('assigned_at')->nullable()->after('unit_id');
            $table->index('unit_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['unit_id']);
            $table->dropColumn(['unit_id', 'assigned_at']);
            
            // Revert role enum
            $table->dropColumn('role');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['admin', 'dekan', 'unit', 'sdm'])->default('sdm')->after('email_verified_at');
        });
    }
};

