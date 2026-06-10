<?php

namespace App\Filament\Resources\ConsultationBookingResource\Pages;

use App\Filament\Resources\ConsultationBookingResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewConsultationBooking extends ViewRecord
{
    protected static string $resource = ConsultationBookingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
        ];
    }
}
