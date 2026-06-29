<?php

namespace App\Console\Commands;

use App\Models\Order;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ExpireUnpaidOrders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:expire-unpaid';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Expire unpaid orders past their hold window and restore reserved stock';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        Order::query()
            ->where('payment_status', Order::PAYMENT_UNPAID)
            ->whereNotNull('expires_at')
            ->where('expires_at', '<=', now())
            ->with('items')
            ->each(function (Order $order): void {
                DB::transaction(function () use ($order): void {
                    $order->restoreStock();
                    $order->update(['payment_status' => Order::PAYMENT_EXPIRED]);
                });
            });

        return self::SUCCESS;
    }
}
