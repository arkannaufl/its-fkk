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
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->enum('type', ['wadek_i', 'wadek_ii', 'unit', 'sdm'])->default('unit');
            $table->foreignId('parent_unit_id')->nullable()->constrained('units')->nullOnDelete();
            $table->enum('role', ['admin', 'dekan', 'wadek', 'unit', 'sdm'])->default('unit');
            $table->text('description')->nullable();
            $table->integer('position_x')->nullable();
            $table->integer('position_y')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('type');
            $table->index('role');
            $table->index('is_active');
            $table->index('parent_unit_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};

