<?php

use App\Models\Order;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('expires overdue unpaid orders and restores their stock', function () {
    $product = Product::factory()->create(['stock' => 5, 'has_variants' => false]);
    $order = Order::create([
        'full_name' => 'Ada', 'phone' => '0800', 'delivery_address' => 'Abuja',
        'subtotal' => 100, 'total' => 100, 'status' => Order::STATUS_PENDING,
        'payment_status' => Order::PAYMENT_UNPAID, 'expires_at' => now()->subHour(),
    ]);
    $order->items()->create([
        'product_id' => $product->id, 'variant_id' => null, 'product_name' => $product->name,
        'variant_size' => null, 'quantity' => 2, 'unit_price' => 50, 'subtotal' => 100,
    ]);

    $this->artisan('orders:expire-unpaid')->assertSuccessful();

    expect($order->fresh()->payment_status)->toBe(Order::PAYMENT_EXPIRED)
        ->and($product->fresh()->stock)->toBe(7);
});

it('leaves paid and not-yet-due orders alone', function () {
    $paid = Order::create(['full_name' => 'A', 'phone' => '1', 'delivery_address' => 'x', 'subtotal' => 1, 'total' => 1, 'status' => Order::STATUS_CONFIRMED, 'payment_status' => Order::PAYMENT_PAID, 'expires_at' => now()->subDay()]);
    $future = Order::create(['full_name' => 'B', 'phone' => '2', 'delivery_address' => 'y', 'subtotal' => 1, 'total' => 1, 'status' => Order::STATUS_PENDING, 'payment_status' => Order::PAYMENT_UNPAID, 'expires_at' => now()->addDay()]);

    $this->artisan('orders:expire-unpaid')->assertSuccessful();

    expect($paid->fresh()->payment_status)->toBe(Order::PAYMENT_PAID)
        ->and($future->fresh()->payment_status)->toBe(Order::PAYMENT_UNPAID);
});
