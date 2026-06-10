<?php

namespace App\Filament\Resources\ConsultationBookingResource\Pages;

use App\Filament\Resources\ConsultationBookingResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListConsultationBookings extends ListRecords
{
    protected static string $resource = ConsultationBookingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
