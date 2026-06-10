<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    protected $fillable = ['product_id', 'size', 'price', 'stock'];
    protected $casts = ['price' => 'float', 'stock' => 'integer'];

    public function product() { return $this->belongsTo(Product::class); }
}
