<?php

use App\Models\Order;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('marks an order as paid and confirms a pending order', function () {
    $order = Order::create([
        'full_name' => 'Ada', 'phone' => '0800', 'delivery_address' => 'Abuja',
        'subtotal' => 100, 'total' => 100,
        'status' => Order::STATUS_PENDING, 'payment_status' => Order::PAYMENT_UNPAID,
        'expires_at' => now()->addDays(2),
    ]);

    $order->markAsPaid();

    expect($order->payment_status)->toBe(Order::PAYMENT_PAID)
        ->and($order->status)->toBe(Order::STATUS_CONFIRMED)
        ->and($order->paid_at)->not->toBeNull()
        ->and($order->expires_at)->toBeNull();
});

it('does not rewind a non-pending fulfillment status when paid', function () {
    $order = Order::create([
        'full_name' => 'Ada', 'phone' => '0800', 'delivery_address' => 'Abuja',
        'subtotal' => 100, 'total' => 100,
        'status' => Order::STATUS_OUT_FOR_DELIVERY, 'payment_status' => Order::PAYMENT_UNPAID,
    ]);

    $order->markAsPaid();

    expect($order->status)->toBe(Order::STATUS_OUT_FOR_DELIVERY);
});

it('restores product stock for its items', function () {
    $product = Product::factory()->create(['stock' => 5, 'has_variants' => false]);
    $order = Order::create([
        'full_name' => 'Ada', 'phone' => '0800', 'delivery_address' => 'Abuja',
        'subtotal' => 100, 'total' => 100, 'status' => Order::STATUS_PENDING,
    ]);
    $order->items()->create([
        'product_id' => $product->id, 'variant_id' => null, 'product_name' => $product->name,
        'variant_size' => null, 'quantity' => 3, 'unit_price' => 100, 'subtotal' => 300,
    ]);

    $order->load('items')->restoreStock();

    expect($product->fresh()->stock)->toBe(8);
});

it('re-deducts stock when an expired order is marked as paid', function () {
    $product = Product::factory()->create(['stock' => 5, 'has_variants' => false]);
    $order = Order::create([
        'full_name' => 'Ada', 'phone' => '0800', 'delivery_address' => 'Abuja',
        'subtotal' => 100, 'total' => 100, 'status' => Order::STATUS_PENDING,
        'payment_status' => Order::PAYMENT_EXPIRED,
    ]);
    $order->items()->create([
        'product_id' => $product->id, 'variant_id' => null, 'product_name' => $product->name,
        'variant_size' => null, 'quantity' => 3, 'unit_price' => 100, 'subtotal' => 300,
    ]);

    $order->markAsPaid();

    expect($product->fresh()->stock)->toBe(2)
        ->and($order->fresh()->payment_status)->toBe(Order::PAYMENT_PAID);
});

it('does not change stock for a still-unpaid order marked as paid', function () {
    $product = Product::factory()->create(['stock' => 5, 'has_variants' => false]);
    $order = Order::create([
        'full_name' => 'Ada', 'phone' => '0800', 'delivery_address' => 'Abuja',
        'subtotal' => 100, 'total' => 100, 'status' => Order::STATUS_PENDING,
        'payment_status' => Order::PAYMENT_UNPAID,
    ]);
    $order->items()->create([
        'product_id' => $product->id, 'variant_id' => null, 'product_name' => $product->name,
        'variant_size' => null, 'quantity' => 3, 'unit_price' => 100, 'subtotal' => 300,
    ]);

    $order->markAsPaid();

    expect($product->fresh()->stock)->toBe(5)
        ->and($order->fresh()->payment_status)->toBe(Order::PAYMENT_PAID);
});

it('refuses to mark an expired order paid when stock cannot cover it', function () {
    $product = Product::factory()->create(['stock' => 1, 'has_variants' => false]);
    $order = Order::create([
        'full_name' => 'Ada', 'phone' => '0800', 'delivery_address' => 'Abuja',
        'subtotal' => 100, 'total' => 100, 'status' => Order::STATUS_PENDING,
        'payment_status' => Order::PAYMENT_EXPIRED,
    ]);
    $order->items()->create([
        'product_id' => $product->id, 'variant_id' => null, 'product_name' => $product->name,
        'variant_size' => null, 'quantity' => 3, 'unit_price' => 100, 'subtotal' => 300,
    ]);

    expect(fn () => $order->markAsPaid())->toThrow(RuntimeException::class);

    expect($order->fresh()->payment_status)->toBe(Order::PAYMENT_EXPIRED)
        ->and($product->fresh()->stock)->toBe(1);
});
