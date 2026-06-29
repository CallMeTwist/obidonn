<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Order extends Model
{
    protected $fillable = [
        'order_number', 'full_name', 'phone', 'delivery_address',
        'notes', 'subtotal', 'total', 'status',
        'payment_status', 'paid_at', 'expires_at', 'reminded_at',
    ];

    const STATUS_PENDING = 'pending';

    const STATUS_CONFIRMED = 'confirmed';

    const STATUS_PROCESSING = 'processing';

    const STATUS_OUT_FOR_DELIVERY = 'out_for_delivery';

    const STATUS_DELIVERED = 'delivered';

    const STATUS_CANCELLED = 'cancelled';

    const PAYMENT_UNPAID = 'unpaid';

    const PAYMENT_PAID = 'paid';

    const PAYMENT_EXPIRED = 'expired';

    public static array $statuses = [
        'pending' => 'Pending',
        'confirmed' => 'Confirmed',
        'processing' => 'Processing',
        'out_for_delivery' => 'Out for Delivery',
        'delivered' => 'Delivered',
        'cancelled' => 'Cancelled',
    ];

    public static array $paymentStatuses = [
        'unpaid' => 'Unpaid',
        'paid' => 'Paid',
        'expired' => 'Expired',
    ];

    protected function casts(): array
    {
        return [
            'subtotal' => 'float',
            'total' => 'float',
            'paid_at' => 'datetime',
            'expires_at' => 'datetime',
            'reminded_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function ($order) {
            if (empty($order->order_number)) {
                do {
                    $n = 'ORD-'.strtoupper(Str::random(8));
                } while (self::where('order_number', $n)->exists());
                $order->order_number = $n;
            }
        });
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function getStatusLabelAttribute(): string
    {
        return self::$statuses[$this->status] ?? $this->status;
    }

    public function getTotalItemsAttribute(): int
    {
        return $this->items->sum('quantity');
    }

    public function getPaymentStatusLabelAttribute(): string
    {
        return self::$paymentStatuses[$this->payment_status] ?? $this->payment_status;
    }

    public function markAsPaid(): void
    {
        $this->payment_status = self::PAYMENT_PAID;
        $this->paid_at = now();
        $this->expires_at = null;
        if ($this->status === self::STATUS_PENDING) {
            $this->status = self::STATUS_CONFIRMED;
        }
        $this->save();
    }

    public function restoreStock(): void
    {
        foreach ($this->items as $item) {
            if ($item->variant_id) {
                ProductVariant::query()->where('id', $item->variant_id)->increment('stock', $item->quantity);
            } else {
                Product::query()->where('id', $item->product_id)->increment('stock', $item->quantity);
            }
        }
    }
}
