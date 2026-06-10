<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConsultationBooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'email', 'phone', 'service_type', 'project_type', 'message', 'status',
    ];

    protected $attributes = [
        'status' => 'new',
    ];

    public const SERVICE_TYPES = [
        'architectural' => 'Architectural',
        'interior' => 'Interior',
    ];

    public const STATUSES = [
        'new' => 'New',
        'contacted' => 'Contacted',
        'closed' => 'Closed',
    ];

    protected function casts(): array
    {
        return [];
    }
}
