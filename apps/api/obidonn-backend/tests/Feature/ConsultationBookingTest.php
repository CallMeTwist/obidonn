<?php

use App\Models\ConsultationBooking;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('stores a valid consultation booking', function () {
    $payload = [
        'name' => 'Ada Obi',
        'email' => 'ada@example.com',
        'phone' => '08030000000',
        'service_type' => 'architectural',
        'project_type' => 'New build',
        'message' => 'I want to build a 4-bedroom duplex.',
    ];

    $response = $this->postJson('/api/consultations', $payload);

    $response->assertCreated()
        ->assertJsonPath('data.name', 'Ada Obi')
        ->assertJsonPath('data.service_type', 'architectural')
        ->assertJsonPath('data.status', 'new');

    expect(ConsultationBooking::where('email', 'ada@example.com')->exists())->toBeTrue();
});

it('rejects an invalid service type', function () {
    $response = $this->postJson('/api/consultations', [
        'name' => 'Ada Obi',
        'email' => 'ada@example.com',
        'service_type' => 'plumbing',
        'message' => 'Hi',
    ]);

    $response->assertStatus(422)->assertJsonValidationErrors(['service_type']);
});

it('requires name, email and message', function () {
    $response = $this->postJson('/api/consultations', []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['name', 'email', 'message', 'service_type']);
});
