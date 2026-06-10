<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Models\Category;
use App\Models\Product;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Forms\Set;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-o-cube';

    protected static ?string $navigationGroup = 'Catalog';

    protected static ?int $navigationSort = 2;

    // ─── Form ─────────────────────────────────────────────────────────────────

    public static function form(Form $form): Form
    {
        return $form->schema([

            Forms\Components\Section::make('Product Information')
                ->columns(2)
                ->schema([
                    Forms\Components\TextInput::make('name')
                        ->required()
                        ->maxLength(255)
                        ->columnSpan(2)
                        ->live(onBlur: true)
                        ->afterStateUpdated(fn (Set $set, ?string $state) => $set('slug', Str::slug($state ?? ''))
                        ),

                    Forms\Components\TextInput::make('slug')
                        ->required()
                        ->unique(Product::class, 'slug', ignoreRecord: true)
                        ->maxLength(255)
                        ->columnSpan(2),

                    Forms\Components\Select::make('category_id')
                        ->label('Category')
                        ->options(Category::where('is_active', true)->pluck('name', 'id'))
                        ->searchable()
                        ->required(),

                    Forms\Components\FileUpload::make('image')
                        ->image()
                        ->directory('products')
                        ->columnSpan(2),

                    Forms\Components\RichEditor::make('description')
                        ->columnSpan(2),
                ]),

            Forms\Components\Section::make('Pricing & Stock')
                ->columns(2)
                ->schema([
                    Forms\Components\Toggle::make('has_variants')
                        ->label('This product has size variants (different prices per size)')
                        ->reactive()
                        ->columnSpan(2)
                        ->afterStateUpdated(function (Set $set, bool $state) {
                            if ($state) {
                                $set('price', null);
                                $set('stock', null);
                            }
                        }),

                    // ── Shown when NO variants ─────────────────────────────────
                    Forms\Components\TextInput::make('price')
                        ->numeric()
                        ->prefix('₦')
                        ->minValue(0)
                        ->visible(fn (Get $get) => ! $get('has_variants'))
                        ->required(fn (Get $get) => ! $get('has_variants')),

                    Forms\Components\TextInput::make('stock')
                        ->numeric()
                        ->minValue(0)
                        ->visible(fn (Get $get) => ! $get('has_variants'))
                        ->required(fn (Get $get) => ! $get('has_variants')),

                    // ── Shown when HAS variants ────────────────────────────────
                    Forms\Components\Repeater::make('variants')
                        ->relationship()
                        ->schema([
                            Forms\Components\TextInput::make('size')
                                ->required()
                                ->placeholder('e.g. 25kg, 50L, 4x8ft')
                                ->columnSpan(1),

                            Forms\Components\TextInput::make('price')
                                ->required()
                                ->numeric()
                                ->prefix('₦')
                                ->minValue(0)
                                ->columnSpan(1),

                            Forms\Components\TextInput::make('stock')
                                ->required()
                                ->numeric()
                                ->minValue(0)
                                ->columnSpan(1),
                        ])
                        ->columns(3)
                        ->visible(fn (Get $get) => (bool) $get('has_variants'))
                        ->columnSpan(2)
                        ->addActionLabel('Add Size Variant')
                        ->reorderable(false),
                ]),

            Forms\Components\Section::make('Visibility')
                ->columns(2)
                ->schema([
                    Forms\Components\Toggle::make('is_active')
                        ->label('Active (visible to customers)')
                        ->default(true),

                    Forms\Components\Toggle::make('is_featured')
                        ->label('Featured (shown on homepage)'),
                ]),
        ]);
    }

    // ─── Table ────────────────────────────────────────────────────────────────

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image')
                    ->square()
                    ->size(48),

                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->wrap(),

                Tables\Columns\TextColumn::make('category.name')
                    ->label('Category')
                    ->badge()
                    ->sortable(),

                Tables\Columns\TextColumn::make('display_price')
                    ->label('Price')
                    ->money('NGN')
                    ->sortable(query: fn ($query, $dir) => $query->orderBy('price', $dir)
                    )
                    ->description(fn (Product $p) => $p->has_variants ? 'from (cheapest variant)' : null
                    ),

                Tables\Columns\TextColumn::make('total_stock')
                    ->label('Stock')
                    ->sortable(query: fn ($query, $dir) => $query->orderBy('stock', $dir)
                    )
                    ->color(fn (Product $p) => $p->total_stock === 0 ? 'danger' :
                        ($p->total_stock < 10 ? 'warning' : 'success')
                    ),

                Tables\Columns\IconColumn::make('has_variants')
                    ->label('Variants')
                    ->boolean(),

                Tables\Columns\IconColumn::make('is_featured')
                    ->label('Featured')
                    ->boolean(),

                Tables\Columns\IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean(),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('category')
                    ->relationship('category', 'name'),
                Tables\Filters\TernaryFilter::make('is_active')->label('Active'),
                Tables\Filters\TernaryFilter::make('is_featured')->label('Featured'),
                Tables\Filters\TernaryFilter::make('has_variants')->label('Has Variants'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
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
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}
