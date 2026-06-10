<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ConsultationBookingResource\Pages;
use App\Models\ConsultationBooking;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ConsultationBookingResource extends Resource
{
    protected static ?string $model = ConsultationBooking::class;

    protected static ?string $navigationIcon = 'heroicon-o-pencil-square';

    protected static ?string $navigationGroup = 'Sales';

    protected static ?string $navigationLabel = 'Consultations';

    protected static ?int $navigationSort = 2;

    public static function canCreate(): bool
    {
        return false;
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Enquiry')
                ->columns(2)
                ->schema([
                    Forms\Components\TextInput::make('name')->disabled(),
                    Forms\Components\TextInput::make('email')->disabled(),
                    Forms\Components\TextInput::make('phone')->disabled(),
                    Forms\Components\TextInput::make('service_type')->disabled(),
                    Forms\Components\TextInput::make('project_type')->disabled(),
                    Forms\Components\Textarea::make('message')->disabled()->columnSpan(2),
                    Forms\Components\Select::make('status')
                        ->options(ConsultationBooking::STATUSES)
                        ->required(),
                ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('email')->searchable()->copyable(),
                Tables\Columns\TextColumn::make('service_type')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => ConsultationBooking::SERVICE_TYPES[$state] ?? $state)
                    ->color(fn (string $state): string => $state === 'architectural' ? 'warning' : 'info'),
                Tables\Columns\TextColumn::make('project_type')->placeholder('—'),
                Tables\Columns\SelectColumn::make('status')->options(ConsultationBooking::STATUSES),
                Tables\Columns\TextColumn::make('created_at')->label('Received')->dateTime()->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('service_type')->options(ConsultationBooking::SERVICE_TYPES),
                Tables\Filters\SelectFilter::make('status')->options(ConsultationBooking::STATUSES),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListConsultationBookings::route('/'),
            'view' => Pages\ViewConsultationBooking::route('/{record}'),
            'edit' => Pages\EditConsultationBooking::route('/{record}/edit'),
        ];
    }
}
