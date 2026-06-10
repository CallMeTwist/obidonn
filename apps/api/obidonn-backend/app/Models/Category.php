<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;


class Category extends Model
{
    protected $fillable = ['name', 'slug', 'description', 'image', 'is_active'];
    protected $casts = ['is_active' => 'boolean'];

    protected static function booted(): void
    {
        static::creating(fn ($c) => $c->slug ??= Str::slug($c->name));
        static::updating(function ($c) {
            if ($c->isDirty('name') && !$c->isDirty('slug'))
                $c->slug = Str::slug($c->name);
        });
    }

    public function products() { return $this->hasMany(Product::class); }

    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image) return null;
        return str_starts_with($this->image, 'http')
            ? $this->image : asset('storage/' . $this->image);
    }
}
