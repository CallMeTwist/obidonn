<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Models\User;
use App\Notifications\OrderExpiringSoonNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;

class RemindUnpaidOrders extends Command
{
    protected $signature = 'orders:remind-unpaid';

    protected $description = 'Remind admins of unpaid orders within 24h of expiry (once each)';

    public function handle(): int
    {
        Order::query()
            ->where('payment_status', Order::PAYMENT_UNPAID)
            ->whereNull('reminded_at')
            ->whereNotNull('expires_at')
            ->where('expires_at', '>', now())
            ->where('expires_at', '<=', now()->addDay())
            ->each(function (Order $order): void {
                try {
                    Notification::send(User::all(), new OrderExpiringSoonNotification($order));
                } catch (\Throwable $e) {
                    report($e);
                }
                $order->update(['reminded_at' => now()]);
            });

        return self::SUCCESS;
    }
}
