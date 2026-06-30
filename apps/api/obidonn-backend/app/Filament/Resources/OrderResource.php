<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderResource\Pages;
use App\Models\Order;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Infolists;
use Filament\Infolists\Infolist;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-bag';

    protected static ?string $navigationGroup = 'Sales';

    protected static ?int $navigationSort = 1;

    // Orders are managed, not created from admin
    public static function canCreate(): bool
    {
        return false;
    }

    // ─── Form (edit status only) ──────────────────────────────────────────────

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Customer Details')
                ->columns(2)
                ->schema([
                    Forms\Components\TextInput::make('full_name')->disabled(),
                    Forms\Components\TextInput::make('phone')->disabled(),
                    Forms\Components\Textarea::make('delivery_address')->disabled()->columnSpan(2),
                    Forms\Components\Textarea::make('notes')->disabled()->columnSpan(2),
                ]),

            Forms\Components\Section::make('Order Status')
                ->schema([
                    Forms\Components\Select::make('status')
                        ->options(Order::$statuses)
                        ->required(),
                ]),
        ]);
    }

    // ─── Infolist (view page) ─────────────────────────────────────────────────

    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist->schema([
            Infolists\Components\Section::make('Order Summary')
                ->columns(3)
                ->schema([
                    Infolists\Components\TextEntry::make('order_number')->badge()->color('primary'),
                    Infolists\Components\TextEntry::make('status_label')->label('Status')->badge()
                        ->color(fn (string $state): string => match ($state) {
                            'Pending' => 'warning',
                            'Confirmed' => 'info',
                            'Processing' => 'info',
                            'Out for Delivery' => 'info',
                            'Delivered' => 'success',
                            'Cancelled' => 'danger',
                            default => 'gray',
                        }),
                    Infolists\Components\TextEntry::make('payment_status_label')->label('Payment')->badge()
                        ->color(fn (string $state): string => match ($state) {
                            'Paid' => 'success', 'Unpaid' => 'warning', 'Expired' => 'gray', default => 'gray',
                        }),
                    Infolists\Components\TextEntry::make('expires_at')->label('Holds until')->dateTime()->placeholder('—'),
                    Infolists\Components\TextEntry::make('paid_at')->label('Paid at')->dateTime()->placeholder('—'),
                    Infolists\Components\TextEntry::make('created_at')->label('Placed At')->dateTime(),
                ]),

            Infolists\Components\Section::make('Customer')
                ->columns(2)
                ->schema([
                    Infolists\Components\TextEntry::make('full_name'),
                    Infolists\Components\TextEntry::make('phone'),
                    Infolists\Components\TextEntry::make('delivery_address')->columnSpan(2),
                    Infolists\Components\TextEntry::make('notes')->columnSpan(2)->placeholder('—'),
                ]),

            Infolists\Components\Section::make('Items')
                ->schema([
                    Infolists\Components\RepeatableEntry::make('items')
                        ->schema([
                            Infolists\Components\TextEntry::make('product_name')->label('Product'),
                            Infolists\Components\TextEntry::make('variant_size')->label('Size')->placeholder('—'),
                            Infolists\Components\TextEntry::make('quantity'),
                            Infolists\Components\TextEntry::make('unit_price')->money('NGN'),
                            Infolists\Components\TextEntry::make('subtotal')->money('NGN'),
                        ])
                        ->columns(5),
                ]),

            Infolists\Components\Section::make('Totals')
                ->columns(2)
                ->schema([
                    Infolists\Components\TextEntry::make('subtotal')->money('NGN'),
                    Infolists\Components\TextEntry::make('total')->money('NGN')->weight('bold'),
                ]),
        ]);
    }

    // ─── Table ────────────────────────────────────────────────────────────────

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('order_number')
                    ->searchable()
                    ->sortable()
                    ->badge()
                    ->color('primary'),

                Tables\Columns\TextColumn::make('full_name')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('phone')
                    ->searchable(),

                Tables\Columns\TextColumn::make('total_items')
                    ->label('Items')
                    ->sortable(query: fn ($q, $d) => $q->withCount('items')->orderBy('items_count', $d)
                    ),

                Tables\Columns\TextColumn::make('total')
                    ->money('NGN')
                    ->sortable(),

                Tables\Columns\SelectColumn::make('status')
                    ->options(Order::$statuses)
                    ->sortable(),

                Tables\Columns\TextColumn::make('payment_status')
                    ->label('Payment')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => Order::$paymentStatuses[$state] ?? $state)
                    ->color(fn (string $state): string => match ($state) {
                        'paid' => 'success',
                        'unpaid' => 'warning',
                        'expired' => 'gray',
                        default => 'gray',
                    }),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Ordered')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options(Order::$statuses),
                Tables\Filters\SelectFilter::make('payment_status')
                    ->label('Payment')
                    ->options(Order::$paymentStatuses)
                    ->placeholder('All (except expired)')
                    ->query(function ($query, array $data) {
                        if (blank($data['value'])) {
                            return $query->where('payment_status', '!=', Order::PAYMENT_EXPIRED);
                        }

                        return $query->where('payment_status', $data['value']);
                    }),
            ])
            ->actions([
                Tables\Actions\Action::make('mark_paid')
                    ->label('Mark as Paid')
                    ->icon('heroicon-o-banknotes')
                    ->color('success')
                    ->requiresConfirmation()
                    ->visible(fn (Order $record): bool => $record->payment_status !== Order::PAYMENT_PAID)
                    ->action(function (Order $record): void {
                        try {
                            $record->markAsPaid();
                        } catch (\RuntimeException $e) {
                            Notification::make()
                                ->title('Could not mark as paid')
                                ->body($e->getMessage())
                                ->danger()
                                ->send();
                        }
                    }),
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\BulkAction::make('mark_paid')
                        ->label('Mark as Paid')
                        ->icon('heroicon-o-banknotes')
                        ->color('success')
                        ->action(function ($records): void {
                            $failed = [];
                            foreach ($records as $record) {
                                try {
                                    $record->markAsPaid();
                                } catch (\RuntimeException $e) {
                                    $failed[] = $record->order_number;
                                }
                            }
                            if (! empty($failed)) {
                                Notification::make()
                                    ->title('Some orders could not be marked as paid')
                                    ->body('Insufficient stock to reinstate: '.implode(', ', $failed))
                                    ->danger()
                                    ->send();
                            }
                        }),
                    Tables\Actions\BulkAction::make('mark_confirmed')
                        ->label('Mark as Confirmed')
                        ->icon('heroicon-o-check')
                        ->action(fn ($records) => $records->each->update(['status' => 'confirmed'])),
                    Tables\Actions\BulkAction::make('mark_delivered')
                        ->label('Mark as Delivered')
                        ->icon('heroicon-o-truck')
                        ->action(fn ($records) => $records->each->update(['status' => 'delivered'])),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    // ─── Pages ────────────────────────────────────────────────────────────────

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOrders::route('/'),
            'view' => Pages\ViewOrder::route('/{record}'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
        ];
    }
}
