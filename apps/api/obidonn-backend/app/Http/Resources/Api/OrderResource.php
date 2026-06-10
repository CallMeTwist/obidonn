<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'order_number'     => $this->order_number,
            'full_name'        => $this->full_name,
            'phone'            => $this->phone,
            'delivery_address' => $this->delivery_address,
            'notes'            => $this->notes,
            'subtotal'         => $this->subtotal,
            'total'            => $this->total,
            'status'           => $this->status,
            'status_label'     => $this->status_label,
            'total_items'      => $this->total_items,
            'items'            => OrderItemResource::collection($this->whenLoaded('items')),
            'created_at'       => $this->created_at?->toISOString(),
        ];
    }
}
