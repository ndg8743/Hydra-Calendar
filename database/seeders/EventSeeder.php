<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;
use Carbon\Carbon;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $events = [
            [
                'title' => 'CS 101 Lab Session',
                'description' => 'Introduction to Computer Science lab session covering basic programming concepts.',
                'room' => 'Lab A',
                'start_time' => Carbon::now()->addDays(1)->setTime(9, 0),
                'end_time' => Carbon::now()->addDays(1)->setTime(11, 0),
                'recurrence_pattern' => 'Mon,Wed,Fri',
                'semester' => 'Spring 2025'
            ],
            [
                'title' => 'Office Hours - Dr. Smith',
                'description' => 'Office hours for Computer Science students.',
                'room' => 'Room 204',
                'start_time' => Carbon::now()->addDays(2)->setTime(14, 0),
                'end_time' => Carbon::now()->addDays(2)->setTime(16, 0),
                'recurrence_pattern' => 'Tue,Thu',
                'semester' => 'Spring 2025'
            ],
            [
                'title' => 'Database Systems Lecture',
                'description' => 'Advanced database concepts and SQL optimization.',
                'room' => 'Lecture Hall B',
                'start_time' => Carbon::now()->addDays(3)->setTime(10, 0),
                'end_time' => Carbon::now()->addDays(3)->setTime(11, 30),
                'recurrence_pattern' => 'Mon,Wed,Fri',
                'semester' => 'Spring 2025'
            ],
            [
                'title' => 'Math Tutoring Session',
                'description' => 'Calculus and Statistics tutoring available.',
                'room' => 'Math Center',
                'start_time' => Carbon::now()->addDays(4)->setTime(13, 0),
                'end_time' => Carbon::now()->addDays(4)->setTime(15, 0),
                'recurrence_pattern' => 'Mon,Tue,Wed,Thu,Fri',
                'semester' => 'Spring 2025'
            ],
            [
                'title' => 'Student Study Group',
                'description' => 'Collaborative study session for midterm preparation.',
                'room' => 'Library Room 101',
                'start_time' => Carbon::now()->addDays(5)->setTime(16, 0),
                'end_time' => Carbon::now()->addDays(5)->setTime(18, 0),
                'recurrence_pattern' => '',
                'semester' => 'Spring 2025'
            ],
            [
                'title' => 'Programming Workshop',
                'description' => 'Hands-on workshop covering React and Laravel development.',
                'room' => 'Computer Lab 2',
                'start_time' => Carbon::now()->addDays(7)->setTime(11, 0),
                'end_time' => Carbon::now()->addDays(7)->setTime(13, 0),
                'recurrence_pattern' => '',
                'semester' => 'Spring 2025'
            ]
        ];

        foreach ($events as $event) {
            Event::create($event);
        }
    }
}
