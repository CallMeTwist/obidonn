<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\OrderResource;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Notifications\NewOrderNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'delivery_address' => ['required', 'string'],
            'notes' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.variant_id' => ['nullable', 'integer', 'exists:product_variants,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:999'],
        ]);

        $this->validateStock($validated['items']);

        $order = DB::transaction(function () use ($validated) {
            $subtotal = 0;
            $lines = [];

            foreach ($validated['items'] as $item) {
                $product = Product::with('variants')->findOrFail($item['product_id']);

                if ($product->has_variants) {
                    if (empty($item['variant_id'])) {
                        throw ValidationException::withMessages([
                            'items' => "'{$product->name}' requires a size selection.",
                        ]);
                    }
                    $variant = ProductVariant::findOrFail($item['variant_id']);
                    $unitPrice = $variant->price;
                    $variantSize = $variant->size;
                    $variant->decrement('stock', $item['quantity']);
                } else {
                    $unitPrice = $product->price;
                    $variantSize = null;
                    $product->decrement('stock', $item['quantity']);
                }

                $line = $unitPrice * $item['quantity'];
                $subtotal += $line;
                $lines[] = [
                    'product_id' => $product->id,
                    'variant_id' => $item['variant_id'] ?? null,
                    'product_name' => $product->name,
                    'variant_size' => $variantSize,
                    'quantity' => $item['quantity'],
                    'unit_price' => $unitPrice,
                    'subtotal' => $line,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            $order = Order::create([
                'full_name' => $validated['full_name'],
                'phone' => $validated['phone'],
                'delivery_address' => $validated['delivery_address'],
                'notes' => $validated['notes'] ?? null,
                'subtotal' => $subtotal,
                'total' => $subtotal,
                'status' => Order::STATUS_PENDING,
                'payment_status' => Order::PAYMENT_UNPAID,
                'expires_at' => now()->addDays(2),
            ]);

            foreach ($lines as &$l) {
                $l['order_id'] = $order->id;
            }
            OrderItem::insert($lines);

            return $order->load('items');
        });

        try {
            Notification::send(User::all(), new NewOrderNotification($order));
        } catch (\Throwable $e) {
            report($e);
        }

        return response()->json([
            'message' => 'Order placed successfully.',
            'data' => new OrderResource($order),
        ], 201);
    }

    public function show(string $orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)->with('items')->first();
        if (! $order) {
            return response()->json(['message' => 'Not found.'], 404);
        }

        return response()->json(['data' => new OrderResource($order)]);
    }

    private function validateStock(array $items): void
    {
        $errors = [];
        foreach ($items as $i => $item) {
            $product = Product::with('variants')->find($item['product_id']);
            if (! $product?->is_active) {
                $errors["items.$i.product_id"] = 'Product unavailable.';

                continue;
            }

            if ($product->has_variants) {
                $variant = ProductVariant::find($item['variant_id'] ?? null);
                if (! $variant || $variant->stock < $item['quantity']) {
                    $errors["items.$i.quantity"] = 'Only '.($variant?->stock ?? 0)." unit(s) of '{$product->name}' ({$variant?->size}) in stock.";
                }
            } else {
                if ($product->stock < $item['quantity']) {
                    $errors["items.$i.quantity"] = "Only {$product->stock} unit(s) of '{$product->name}' in stock.";
                }
            }
        }
        if (! empty($errors)) {
            throw ValidationException::withMessages($errors);
        }
    }
}
