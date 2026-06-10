<?php

namespace Database\Factories;

use App\Models\ConsultationBooking;
use Illuminate\Database\Eloquent\Factories\Factory;

class ConsultationBookingFactory extends Factory
{
    protected $model = ConsultationBooking::class;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->optional()->phoneNumber(),
            'service_type' => fake()->randomElement(['architectural', 'interior']),
            'project_type' => fake()->optional()->randomElement(['New build', 'Renovation', 'Fit-out']),
            'message' => fake()->paragraph(),
            'status' => 'new',
        ];
    }
}
