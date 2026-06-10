<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::active()->with(['category', 'variants']);

        if ($search = $request->get('search')) {
            $query->where(fn ($q) => $q
                ->where('name', 'like', "%$search%")
                ->orWhere('description', 'like', "%$search%"));
        }

        if ($slug = $request->get('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $slug));
        }

        if ($min = $request->get('min_price')) {
            $query->where(fn ($q) => $q
                ->where('price', '>=', $min)
                ->orWhereHas('variants', fn ($v) => $v->where('price', '>=', $min)));
        }

        if ($max = $request->get('max_price')) {
            $query->where(fn ($q) => $q
                ->where('price', '<=', $max)
                ->orWhereHas('variants', fn ($v) => $v->where('price', '<=', $max)));
        }

        if ($request->boolean('featured')) {
            $query->featured();
        }

        match ($request->get('sort', 'newest')) {
            'price_asc' => $query->orderByRaw('COALESCE(price, 0) ASC'),
            'price_desc' => $query->orderByRaw('COALESCE(price, 0) DESC'),
            'name_asc' => $query->orderBy('name'),
            default => $query->latest(),
        };

        return ProductResource::collection(
            $query->paginate(min((int) $request->get('per_page', 12), 50))
        );
    }

    public function show(int $id)
    {
        $product = Product::active()->with(['category', 'variants'])->find($id);
        if (! $product) {
            return response()->json(['message' => 'Not found.'], 404);
        }

        $related = Product::active()
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $id)
            ->with(['category', 'variants'])
            ->limit(4)->get();

        return response()->json([
            'data' => new ProductResource($product),
            'related' => ProductResource::collection($related),
        ]);
    }
}
