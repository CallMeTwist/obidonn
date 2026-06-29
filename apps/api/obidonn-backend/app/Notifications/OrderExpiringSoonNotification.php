<?php

namespace App\Notifications;

use App\Models\Order;
use Filament\Notifications\Notification as FilamentNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderExpiringSoonNotification extends Notification
{
    use Queueable;

    public function __construct(public Order $order) {}

    /** @return array<int, string> */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $url = rtrim(config('app.url'), '/')."/admin/resources/orders/{$this->order->id}";

        return (new MailMessage)
            ->subject("Order {$this->order->order_number} expires soon")
            ->greeting('Unpaid order expiring within 24 hours')
            ->line("Order {$this->order->order_number} from {$this->order->full_name} ({$this->order->phone}) is still unpaid.")
            ->line('Confirm payment to keep it, or it will expire and stock will be released.')
            ->action('Review order', $url);
    }

    /** @return array<string, mixed> */
    public function toDatabase(object $notifiable): array
    {
        return FilamentNotification::make()
            ->title("Order {$this->order->order_number} expires soon")
            ->body("{$this->order->full_name} · still unpaid")
            ->warning()
            ->getDatabaseMessage();
    }
}
