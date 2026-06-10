<?php

namespace App\Filament\Resources\ConsultationBookingResource\Pages;

use App\Filament\Resources\ConsultationBookingResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditConsultationBooking extends EditRecord
{
    protected static string $resource = ConsultationBookingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\ViewAction::make(),
            Actions\DeleteAction::make(),
        ];
    }
}
