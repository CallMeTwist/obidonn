<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreConsultationBookingRequest;
use App\Http\Resources\Api\ConsultationBookingResource;
use App\Models\ConsultationBooking;
use Illuminate\Http\JsonResponse;

class ConsultationBookingController extends Controller
{
    public function store(StoreConsultationBookingRequest $request): JsonResponse
    {
        $booking = ConsultationBooking::create($request->validated());

        return response()->json([
            'message' => 'Thank you — we will be in touch shortly.',
            'data' => new ConsultationBookingResource($booking),
        ], 201);
    }
}
