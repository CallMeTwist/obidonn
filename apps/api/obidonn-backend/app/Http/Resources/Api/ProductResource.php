<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'name'          => $this->name,
            'slug'          => $this->slug,
            'description'   => $this->description,
            'image'         => $this->image_url,
            'category'      => new CategoryResource($this->whenLoaded('category')),
            'category_id'   => $this->category_id,
            'has_variants'  => $this->has_variants,
            'price'         => $this->has_variants ? null : $this->price,
            'display_price' => $this->display_price,
            'stock'         => $this->has_variants ? null : $this->stock,
            'total_stock'   => $this->total_stock,
            'in_stock'      => $this->total_stock > 0,
            'variants'      => $this->has_variants
                ? ProductVariantResource::collection($this->whenLoaded('variants'))
                : [],
            'is_featured'   => $this->is_featured,
            'is_active'     => $this->is_active,
        ];
    }
}
