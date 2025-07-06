<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'room',
        'start_time',
        'end_time',
        'recurrence_pattern',
        'semester'
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    /**
     * Get events for a specific date range
     */
    public static function getEventsForDateRange($startDate, $endDate)
    {
        return self::where('start_time', '>=', $startDate)
                  ->where('start_time', '<=', $endDate)
                  ->orderBy('start_time')
                  ->get();
    }

    /**
     * Check if event is recurring
     */
    public function isRecurring()
    {
        return !empty($this->recurrence_pattern);
    }

    /**
     * Get formatted duration
     */
    public function getDurationAttribute()
    {
        $start = Carbon::parse($this->start_time);
        $end = Carbon::parse($this->end_time);
        
        return $start->diffForHumans($end, true);
    }
}
