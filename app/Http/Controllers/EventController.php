<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class EventController extends Controller
{
    /**
     * Display the calendar with events
     */
    public function index(Request $request)
    {
        $view = $request->get('view', 'month'); // default to month view
        $date = $request->get('date', now()->format('Y-m-d'));
        
        // Calculate date range based on view
        $startDate = $this->getStartDate($date, $view);
        $endDate = $this->getEndDate($date, $view);
        
        $events = Event::getEventsForDateRange($startDate, $endDate);
        
        return Inertia::render('Calendar/Index', [
            'events' => $events,
            'view' => $view,
            'currentDate' => $date,
            'isAuthenticated' => auth()->check(),
        ]);
    }

    /**
     * Store a new event
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'room' => 'nullable|string|max:50',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'recurrence_pattern' => 'nullable|string|max:255',
            'semester' => 'required|string|max:50'
        ]);

        $event = Event::create($validated);

        return redirect()->back()->with('success', 'Event created successfully!');
    }

    /**
     * Update an existing event
     */
    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'room' => 'nullable|string|max:50',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'recurrence_pattern' => 'nullable|string|max:255',
            'semester' => 'required|string|max:50'
        ]);

        $event->update($validated);

        return redirect()->back()->with('success', 'Event updated successfully!');
    }

    /**
     * Delete an event
     */
    public function destroy($id)
    {
        $event = Event::findOrFail($id);
        $event->delete();

        return redirect()->back()->with('success', 'Event deleted successfully!');
    }

    /**
     * Get start date based on view type
     */
    private function getStartDate($date, $view)
    {
        $carbon = Carbon::parse($date);
        
        switch ($view) {
            case 'day':
                return $carbon->startOfDay();
            case 'week':
                return $carbon->startOfWeek();
            case 'month':
                return $carbon->startOfMonth()->startOfWeek();
            case 'year':
                return $carbon->startOfYear();
            default:
                return $carbon->startOfMonth();
        }
    }

    /**
     * Get end date based on view type
     */
    private function getEndDate($date, $view)
    {
        $carbon = Carbon::parse($date);
        
        switch ($view) {
            case 'day':
                return $carbon->endOfDay();
            case 'week':
                return $carbon->endOfWeek();
            case 'month':
                return $carbon->endOfMonth()->endOfWeek();
            case 'year':
                return $carbon->endOfYear();
            default:
                return $carbon->endOfMonth();
        }
    }
}
