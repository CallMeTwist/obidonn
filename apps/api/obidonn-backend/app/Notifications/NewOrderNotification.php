<?php

namespace App\Notifications;

use App\Models\Order;
use Filament\Notifications\Notification as FilamentNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewOrderNotification extends Notification
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
            ->subject("New order {$this->order->order_number} — payment pending")
            ->greeting('New order received')
            ->line("Order {$this->order->order_number} from {$this->order->full_name} ({$this->order->phone}).")
            ->line('Total: ₦'.number_format($this->order->total, 2))
            ->line('Awaiting payment confirmation on WhatsApp. It expires in 2 days if unpaid.')
            ->action('View order', $url);
    }

    /** @return array<string, mixed> */
    public function toDatabase(object $notifiable): array
    {
        return FilamentNotification::make()
            ->title("New order {$this->order->order_number}")
            ->body("{$this->order->full_name} · ₦".number_format($this->order->total, 2).' · awaiting payment')
            ->success()
            ->getDatabaseMessage();
    }
}
