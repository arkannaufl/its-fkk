<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Unit extends Model
{
    use HasFactory;

    public const TYPE_WADEK_I = 'wadek_i';
    public const TYPE_WADEK_II = 'wadek_ii';
    public const TYPE_UNIT = 'unit';
    public const TYPE_SDM = 'sdm';

    public const TYPES = [
        self::TYPE_WADEK_I,
        self::TYPE_WADEK_II,
        self::TYPE_UNIT,
        self::TYPE_SDM,
    ];

    protected $fillable = [
        'code',
        'name',
        'type',
        'parent_unit_id',
        'role',
        'description',
        'position_x',
        'position_y',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'position_x' => 'integer',
            'position_y' => 'integer',
        ];
    }

    /**
     * Relasi ke parent unit
     */
    public function parentUnit(): BelongsTo
    {
        return $this->belongsTo(Unit::class, 'parent_unit_id');
    }

    /**
     * Relasi ke child units
     */
    public function childUnits(): HasMany
    {
        return $this->hasMany(Unit::class, 'parent_unit_id');
    }

    /**
     * Relasi ke users yang di-assign ke unit ini
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Scope untuk mendapatkan unit yang aktif
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope untuk mendapatkan unit berdasarkan type
     */
    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope untuk mendapatkan unit berdasarkan role
     */
    public function scopeByRole($query, string $role)
    {
        return $query->where('role', $role);
    }

    /**
     * Scope untuk mendapatkan root units (tidak punya parent)
     */
    public function scopeRoot($query)
    {
        return $query->whereNull('parent_unit_id');
    }

    /**
     * Cek apakah unit ini adalah wadek
     */
    public function isWadek(): bool
    {
        return in_array($this->type, [self::TYPE_WADEK_I, self::TYPE_WADEK_II]);
    }

    /**
     * Get all descendant units (recursive)
     */
    public function getAllDescendants(): \Illuminate\Support\Collection
    {
        $descendants = collect();
        $children = $this->childUnits()->with('childUnits')->get();

        foreach ($children as $child) {
            $descendants->push($child);
            $descendants = $descendants->merge($child->getAllDescendants());
        }

        return $descendants;
    }

    /**
     * Get all ancestor units (recursive)
     */
    public function getAllAncestors(): \Illuminate\Support\Collection
    {
        $ancestors = collect();
        $parent = $this->parentUnit;

        while ($parent) {
            $ancestors->push($parent);
            $parent = $parent->parentUnit;
        }

        return $ancestors;
    }
}

