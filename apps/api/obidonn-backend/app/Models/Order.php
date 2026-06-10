<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Order extends Model
{
    protected $fillable = [
        'order_number', 'full_name', 'phone', 'delivery_address',
        'notes', 'subtotal', 'total', 'status',
    ];
    protected $casts = ['subtotal' => 'float', 'total' => 'float'];

    const STATUS_PENDING          = 'pending';
    const STATUS_CONFIRMED        = 'confirmed';
    const STATUS_PROCESSING       = 'processing';
    const STATUS_OUT_FOR_DELIVERY = 'out_for_delivery';
    const STATUS_DELIVERED        = 'delivered';
    const STATUS_CANCELLED        = 'cancelled';

    public static array $statuses = [
        'pending'          => 'Pending',
        'confirmed'        => 'Confirmed',
        'processing'       => 'Processing',
        'out_for_delivery' => 'Out for Delivery',
        'delivered'        => 'Delivered',
        'cancelled'        => 'Cancelled',
    ];

    protected static function booted(): void
    {
        static::creating(function ($order) {
            if (empty($order->order_number)) {
                do { $n = 'ORD-' . strtoupper(Str::random(8)); }
                while (self::where('order_number', $n)->exists());
                $order->order_number = $n;
            }
        });
    }

    public function items() { return $this->hasMany(OrderItem::class); }
    public function getStatusLabelAttribute(): string { return self::$statuses[$this->status] ?? $this->status; }
    public function getTotalItemsAttribute(): int { return $this->items->sum('quantity'); }
}
