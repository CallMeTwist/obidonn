<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'product_id'   => $this->product_id,
            'variant_id'   => $this->variant_id,
            'product_name' => $this->product_name,
            'variant_size' => $this->variant_size,
            'quantity'     => $this->quantity,
            'unit_price'   => $this->unit_price,
            'subtotal'     => $this->subtotal,
        ];
    }
}
