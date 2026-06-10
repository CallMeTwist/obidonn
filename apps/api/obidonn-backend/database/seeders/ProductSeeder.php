<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $cat = fn (string $name) => Category::where('name', $name)->value('id');

        $products = [

            // ── Cement & Concrete ─────────────────────────────────────────────
            [
                'category' => 'Cement & Concrete',
                'name' => 'Dangote Cement',
                'slug' => 'dangote-cement',
                'description' => 'Premium quality Portland cement suitable for all construction types. Strong, durable, and fast-setting.',
                'has_variants' => true,
                'is_featured' => true,
                'variants' => [
                    ['size' => '25kg', 'price' => 4500, 'stock' => 500],
                    ['size' => '50kg', 'price' => 8500, 'stock' => 800],
                ],
            ],
            [
                'category' => 'Cement & Concrete',
                'name' => 'BUA Cement',
                'slug' => 'bua-cement',
                'description' => 'High-strength BUA cement, suitable for heavy-duty construction and structural work.',
                'has_variants' => true,
                'is_featured' => false,
                'variants' => [
                    ['size' => '25kg', 'price' => 4300, 'stock' => 400],
                    ['size' => '50kg', 'price' => 8200, 'stock' => 600],
                ],
            ],
            [
                'category' => 'Cement & Concrete',
                'name' => 'Sharp Sand',
                'slug' => 'sharp-sand',
                'description' => 'Coarse washed sharp sand for concrete mixing and block moulding.',
                'has_variants' => true,
                'variants' => [
                    ['size' => '1 Ton',  'price' => 15000, 'stock' => 200],
                    ['size' => '5 Tons', 'price' => 70000, 'stock' => 50],
                ],
            ],

            // ── Bricks & Blocks ───────────────────────────────────────────────
            [
                'category' => 'Bricks & Blocks',
                'name' => '9-Inch Sandcrete Block',
                'slug' => '9-inch-sandcrete-block',
                'description' => 'Standard 9-inch hollow sandcrete blocks for walls and fences.',
                'has_variants' => false,
                'price' => 350,
                'stock' => 5000,
                'is_featured' => true,
            ],
            [
                'category' => 'Bricks & Blocks',
                'name' => '6-Inch Sandcrete Block',
                'slug' => '6-inch-sandcrete-block',
                'description' => 'Standard 6-inch hollow sandcrete blocks, ideal for partition walls.',
                'has_variants' => false,
                'price' => 280,
                'stock' => 4000,
            ],
            [
                'category' => 'Bricks & Blocks',
                'name' => 'Interlocking Paving Stone',
                'slug' => 'interlocking-paving-stone',
                'description' => 'Decorative interlocking paving stones for driveways, pathways, and outdoor areas.',
                'has_variants' => true,
                'variants' => [
                    ['size' => '50mm (light duty)', 'price' => 4500, 'stock' => 300],
                    ['size' => '80mm (heavy duty)', 'price' => 6500, 'stock' => 200],
                ],
            ],

            // ── Roofing Materials ─────────────────────────────────────────────
            [
                'category' => 'Roofing Materials',
                'name' => 'Long Span Aluminium Roofing Sheet',
                'slug' => 'long-span-aluminium-roofing-sheet',
                'description' => 'Durable corrugated aluminium roofing sheets, rust-resistant with a 25-year lifespan.',
                'has_variants' => true,
                'is_featured' => true,
                'variants' => [
                    ['size' => '0.45mm thickness', 'price' => 2800, 'stock' => 500],
                    ['size' => '0.55mm thickness', 'price' => 3500, 'stock' => 400],
                ],
            ],
            [
                'category' => 'Roofing Materials',
                'name' => 'Roofing Nails',
                'slug' => 'roofing-nails',
                'description' => 'Galvanised roofing nails for use with iron and aluminium roofing sheets.',
                'has_variants' => true,
                'variants' => [
                    ['size' => '1kg bag',   'price' => 800,   'stock' => 200],
                    ['size' => '5kg bag',   'price' => 3500,  'stock' => 100],
                    ['size' => '25kg bag',  'price' => 16000, 'stock' => 30],
                ],
            ],

            // ── Electrical Supplies ───────────────────────────────────────────
            [
                'category' => 'Electrical Supplies',
                'name' => 'Armoured Cable',
                'slug' => 'armoured-cable',
                'description' => 'Heavy-duty armoured electrical cable for underground and outdoor installations.',
                'has_variants' => true,
                'variants' => [
                    ['size' => '2.5mm² (per metre)', 'price' => 850,  'stock' => 1000],
                    ['size' => '4mm² (per metre)',   'price' => 1200, 'stock' => 800],
                    ['size' => '6mm² (per metre)',   'price' => 1800, 'stock' => 500],
                ],
            ],
            [
                'category' => 'Electrical Supplies',
                'name' => 'Distribution Board (DB Box)',
                'slug' => 'distribution-board-db-box',
                'description' => 'Metal enclosure distribution board for circuit breaker installation.',
                'has_variants' => true,
                'variants' => [
                    ['size' => '4-way',  'price' => 4500,  'stock' => 50],
                    ['size' => '8-way',  'price' => 7500,  'stock' => 40],
                    ['size' => '12-way', 'price' => 11000, 'stock' => 30],
                ],
            ],
            [
                'category' => 'Electrical Supplies',
                'name' => 'PVC Conduit Pipe',
                'slug' => 'pvc-conduit-pipe',
                'description' => 'Rigid PVC conduit for protecting electrical wiring.',
                'has_variants' => true,
                'variants' => [
                    ['size' => '20mm × 3m', 'price' => 650,  'stock' => 300],
                    ['size' => '25mm × 3m', 'price' => 850,  'stock' => 200],
                    ['size' => '32mm × 3m', 'price' => 1100, 'stock' => 150],
                ],
            ],

            // ── Plumbing Materials ────────────────────────────────────────────
            [
                'category' => 'Plumbing Materials',
                'name' => 'PVC Pressure Pipe',
                'slug' => 'pvc-pressure-pipe',
                'description' => 'Class C uPVC pressure pipe for water supply lines.',
                'has_variants' => true,
                'is_featured' => true,
                'variants' => [
                    ['size' => '½" × 6m',  'price' => 1800, 'stock' => 400],
                    ['size' => '¾" × 6m',  'price' => 2500, 'stock' => 300],
                    ['size' => '1" × 6m',  'price' => 3500, 'stock' => 200],
                    ['size' => '1½" × 6m', 'price' => 5500, 'stock' => 100],
                ],
            ],
            [
                'category' => 'Plumbing Materials',
                'name' => 'Overhead Water Tank',
                'slug' => 'overhead-water-tank',
                'description' => 'High-quality polyethylene water storage tank with UV protection.',
                'has_variants' => true,
                'variants' => [
                    ['size' => '500L',  'price' => 28000, 'stock' => 20],
                    ['size' => '1000L', 'price' => 45000, 'stock' => 15],
                    ['size' => '1500L', 'price' => 68000, 'stock' => 10],
                ],
            ],

            // ── Tools & Equipment ─────────────────────────────────────────────
            [
                'category' => 'Tools & Equipment',
                'name' => 'Concrete Mixer (Electric)',
                'slug' => 'concrete-mixer-electric',
                'description' => '180L capacity electric concrete mixer with steel drum.',
                'has_variants' => false,
                'price' => 185000,
                'stock' => 8,
                'is_featured' => true,
            ],
            [
                'category' => 'Tools & Equipment',
                'name' => "Builder's Wheelbarrow",
                'slug' => 'builders-wheelbarrow',
                'description' => 'Heavy-duty steel wheelbarrow with pneumatic tyre, 90L capacity.',
                'has_variants' => false,
                'price' => 18500,
                'stock' => 30,
            ],
            [
                'category' => 'Tools & Equipment',
                'name' => 'Safety Helmet',
                'slug' => 'safety-helmet',
                'description' => 'HDPE construction safety helmet, adjustable fit.',
                'has_variants' => true,
                'variants' => [
                    ['size' => 'White',  'price' => 2500, 'stock' => 100],
                    ['size' => 'Yellow', 'price' => 2500, 'stock' => 80],
                    ['size' => 'Red',    'price' => 2500, 'stock' => 60],
                    ['size' => 'Blue',   'price' => 2500, 'stock' => 60],
                ],
            ],

            // ── Paints & Finishes ─────────────────────────────────────────────
            [
                'category' => 'Paints & Finishes',
                'name' => 'Crown Silk Matt Emulsion Paint',
                'slug' => 'crown-silk-matt-emulsion-paint',
                'description' => 'Premium water-based emulsion paint for interior and exterior walls.',
                'has_variants' => true,
                'is_featured' => true,
                'variants' => [
                    ['size' => '4L',  'price' => 7500,  'stock' => 100],
                    ['size' => '10L', 'price' => 16500, 'stock' => 80],
                    ['size' => '20L', 'price' => 30000, 'stock' => 50],
                ],
            ],
            [
                'category' => 'Paints & Finishes',
                'name' => 'Wall Putty / Skim Coat',
                'slug' => 'wall-putty-skim-coat',
                'description' => 'White cement-based wall putty for smooth finishes before painting.',
                'has_variants' => true,
                'variants' => [
                    ['size' => '5kg',  'price' => 3500,  'stock' => 200],
                    ['size' => '20kg', 'price' => 12000, 'stock' => 100],
                    ['size' => '40kg', 'price' => 22000, 'stock' => 60],
                ],
            ],

            // ── Doors & Windows ───────────────────────────────────────────────
            [
                'category' => 'Doors & Windows',
                'name' => 'Flush Interior Door',
                'slug' => 'flush-interior-door',
                'description' => 'Solid-core HDF flush door for interior rooms. Pre-primed and ready to paint.',
                'has_variants' => true,
                'variants' => [
                    ['size' => '762 × 2032mm (30")',  'price' => 22000, 'stock' => 20],
                    ['size' => '838 × 2032mm (33")',  'price' => 24000, 'stock' => 20],
                    ['size' => '915 × 2032mm (36")',  'price' => 27000, 'stock' => 15],
                ],
            ],
            [
                'category' => 'Doors & Windows',
                'name' => 'Aluminium Sliding Window',
                'slug' => 'aluminium-sliding-window',
                'description' => 'Powder-coated aluminium sliding window with mosquito net and tinted glass.',
                'has_variants' => true,
                'is_featured' => true,
                'variants' => [
                    ['size' => '600 × 900mm',   'price' => 18000, 'stock' => 20],
                    ['size' => '900 × 1200mm',  'price' => 25000, 'stock' => 15],
                    ['size' => '1200 × 1200mm', 'price' => 32000, 'stock' => 10],
                ],
            ],
        ];

        foreach ($products as $data) {
            $categoryId = $cat($data['category']);
            if (! $categoryId) {
                continue;
            }

            $product = Product::firstOrCreate(
                ['slug' => $data['slug']],
                [
                    'category_id' => $categoryId,
                    'name' => $data['name'],
                    'slug' => $data['slug'],
                    'description' => $data['description'],
                    'has_variants' => $data['has_variants'],
                    'price' => $data['price'] ?? null,
                    'stock' => $data['stock'] ?? 0,
                    'is_featured' => $data['is_featured'] ?? false,
                    'is_active' => true,
                ]
            );

            if ($data['has_variants'] && isset($data['variants'])) {
                foreach ($data['variants'] as $variant) {
                    ProductVariant::firstOrCreate(
                        ['product_id' => $product->id, 'size' => $variant['size']],
                        ['price' => $variant['price'], 'stock' => $variant['stock']]
                    );
                }
            }
        }
    }
}
