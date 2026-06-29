<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id', 'name', 'slug', 'description', 'image',
        'price', 'stock', 'has_variants', 'is_featured', 'is_active',
    ];

    protected $casts = [
        'price' => 'float', 'stock' => 'integer',
        'has_variants' => 'boolean', 'is_featured' => 'boolean', 'is_active' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::creating(fn ($p) => $p->slug ??= Str::slug($p->name));
        static::updating(function ($p) {
            if ($p->isDirty('name') && ! $p->isDirty('slug')) {
                $p->slug = Str::slug($p->name);
            }
        });
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function getDisplayPriceAttribute(): float
    {
        return $this->has_variants
            ? (float) ($this->variants->min('price') ?? 0)
            : (float) ($this->price ?? 0);
    }

    public function getTotalStockAttribute(): int
    {
        return $this->has_variants
            ? (int) $this->variants->sum('stock')
            : (int) $this->stock;
    }

    public function getImageUrlAttribute(): ?string
    {
        if (! $this->image) {
            return null;
        }

        return str_starts_with($this->image, 'http')
            ? $this->image : asset('storage/'.$this->image);
    }

    public function scopeActive($q)
    {
        return $q->where('is_active', true);
    }

    public function scopeFeatured($q)
    {
        return $q->where('is_featured', true);
    }
}
