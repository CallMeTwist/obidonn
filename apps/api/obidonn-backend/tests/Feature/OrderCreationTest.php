<?php

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Notifications\NewOrderNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;

uses(RefreshDatabase::class);

it('creates an unpaid order with a 2-day expiry and notifies admins', function () {
    Notification::fake();
    User::factory()->create();
    $product = Product::factory()->create(['stock' => 10, 'has_variants' => false, 'is_active' => true]);

    $response = $this->postJson('/api/orders', [
        'full_name' => 'Ada Obi', 'phone' => '08010000000', 'delivery_address' => 'Jabi, Abuja',
        'items' => [['product_id' => $product->id, 'variant_id' => null, 'quantity' => 2]],
    ]);

    $response->assertCreated();
    $order = Order::latest('id')->first();
    expect($order->payment_status)->toBe(Order::PAYMENT_UNPAID)
        ->and($order->expires_at)->not->toBeNull()
        ->and($order->expires_at->isAfter(now()->addDay()))->toBeTrue();

    Notification::assertSentTo(User::first(), NewOrderNotification::class);
});
