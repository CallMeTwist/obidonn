<?php

use App\Models\Order;
use App\Models\User;
use App\Notifications\OrderExpiringSoonNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;

uses(RefreshDatabase::class);

it('reminds once for unpaid orders within 24h of expiry', function () {
    Notification::fake();
    User::factory()->create();
    $order = Order::create([
        'full_name' => 'Ada', 'phone' => '0800', 'delivery_address' => 'Abuja',
        'subtotal' => 100, 'total' => 100, 'status' => Order::STATUS_PENDING,
        'payment_status' => Order::PAYMENT_UNPAID, 'expires_at' => now()->addHours(12),
    ]);

    $this->artisan('orders:remind-unpaid')->assertSuccessful();
    Notification::assertSentTo(User::first(), OrderExpiringSoonNotification::class);
    expect($order->fresh()->reminded_at)->not->toBeNull();

    // second run must not re-send
    Notification::fake();
    $this->artisan('orders:remind-unpaid')->assertSuccessful();
    Notification::assertNothingSent();
});
