<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'category_id' => Category::factory(),
            'name' => $name,
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(1, 999999),
            'description' => fake()->sentence(),
            'image' => null,
            'price' => fake()->randomFloat(2, 1000, 100000),
            'stock' => fake()->numberBetween(1, 100),
            'has_variants' => false,
            'is_featured' => false,
            'is_active' => true,
        ];
    }
}
