<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductVariantFactory extends Factory
{
    protected $model = ProductVariant::class;

    public function definition(): array
    {
        return [
            'product_id' => Product::factory()->state(['has_variants' => true]),
            'size' => fake()->randomElement(['Small', 'Medium', 'Large', 'XL']),
            'price' => fake()->randomFloat(2, 1000, 100000),
            'stock' => fake()->numberBetween(1, 100),
        ];
    }
}
