<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Cement & Concrete',
                'slug' => 'cement-concrete',
                'description' => 'Bagged cement, concrete mixes, and related materials for foundations and structures.',
                'image' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Bricks & Blocks',
                'slug' => 'bricks-blocks',
                'description' => 'Sandcrete blocks, clay bricks, and interlocking paving stones.',
                'image' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Roofing Materials',
                'slug' => 'roofing-materials',
                'description' => 'Long-span aluminium, corrugated iron sheets, roofing nails, and ridge caps.',
                'image' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Electrical Supplies',
                'slug' => 'electrical-supplies',
                'description' => 'Cables, conduits, sockets, switches, distribution boards, and more.',
                'image' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Plumbing Materials',
                'slug' => 'plumbing-materials',
                'description' => 'PVC pipes, fittings, water tanks, ball valves, and sanitary ware.',
                'image' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Tools & Equipment',
                'slug' => 'tools-equipment',
                'description' => 'Hand tools, power tools, safety equipment, and construction machinery.',
                'image' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Paints & Finishes',
                'slug' => 'paints-finishes',
                'description' => 'Emulsion, gloss, primer, wood stain, and wall putty.',
                'image' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Doors & Windows',
                'slug' => 'doors-windows',
                'description' => 'Wooden doors, aluminium windows, louvers, and burglar proofs.',
                'image' => null,
                'is_active' => true,
            ],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(
                ['slug' => $cat['slug']],  // check by slug (unique)
                $cat                        // create with all fields
            );
        }
    }
}
