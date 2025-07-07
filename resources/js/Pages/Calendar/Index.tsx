import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import Layout from '@/Layouts/Layout';
import CalendarGrid from '@/Components/CalendarGrid';
import EventModal from '@/Components/EventModal';
import ViewSwitcher from '@/Components/ViewSwitcher';
import { PlusIcon } from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';

import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import Layout from '@/Layouts/Layout';
import CalendarGrid from '@/Components/CalendarGrid';
import EventModal from '@/Components/EventModal';
import ViewSwitcher from '@/Components/ViewSwitcher';
import { PlusIcon } from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';

interface Event {
    id: number;
    title: string;
    description?: string;
    room?: string;
    start_time: string;
    end_time: string;
    recurrence_pattern?: string;
    semester: string;
}

interface CalendarProps {
    events: Event[];
    view: 'day' | 'week' | 'month' | 'year';
    currentDate: string;
    isAuthenticated: boolean;
}

export default function Index({ events, view, currentDate, isAuthenticated }: CalendarProps) {
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [currentView, setCurrentView] = useState(view);
    const [currentDateState, setCurrentDateState] = useState(currentDate);

    const { flash } = usePage<any>().props;

    useEffect(() => {
        if (flash?.success) {
            // You could add a toast notification here
            console.log('Success:', flash.success);
        }
    }, [flash]);

    const handleViewChange = (newView: 'day' | 'week' | 'month' | 'year') => {
        setCurrentView(newView);
        router.get(window.location.pathname, { 
            view: newView, 
            date: currentDateState 
        }, { 
            preserveState: true,
            replace: true 
        });
    };

    const handleDateChange = (newDate: string) => {
        setCurrentDateState(newDate);
        router.get(window.location.pathname, { 
            view: currentView, 
            date: newDate 
        }, { 
            preserveState: true,
            replace: true 
        });
    };

    const handleEventClick = (event: Event) => {
        if (isAuthenticated) {
            setSelectedEvent(event);
            setShowEventModal(true);
        }
    };

    const handleCreateEvent = () => {
        if (isAuthenticated) {
            setSelectedEvent(null);
            setShowEventModal(true);
        }
    };

    const closeModal = () => {
        setShowEventModal(false);
        setSelectedEvent(null);
    };

    return (
        <Layout>
            <Head title="Calendar" />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                {/* Header Section */}
                <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center space-x-4">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Hydra Calendar
                                </h1>
                                <div className="hidden sm:block text-sm text-gray-500">
                                    {format(parseISO(currentDateState), 'MMMM yyyy')}
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                <ViewSwitcher 
                                    currentView={currentView} 
                                    onViewChange={handleViewChange} 
                                />
                                {isAuthenticated && (
                                    <button
                                        onClick={handleCreateEvent}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm"
                                    >
                                        <PlusIcon className="w-4 h-4 mr-2" />
                                        Add Event
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Bento Grid Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Calendar Main Section */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                <CalendarGrid
                                    events={events}
                                    view={currentView}
                                    currentDate={currentDateState}
                                    onEventClick={handleEventClick}
                                    onDateChange={handleDateChange}
                                />
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Quick Info Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Quick Info
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Today's Events</span>
                                        <span className="font-medium text-gray-900">
                                            {events.filter(event => 
                                                format(parseISO(event.start_time), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                                            ).length}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Total Events</span>
                                        <span className="font-medium text-gray-900">{events.length}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Legend Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Legend
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                        <span className="text-sm text-gray-700">Regular Events</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="text-sm text-gray-700">Lab Hours</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                        <span className="text-sm text-gray-700">Recurring</span>
                                    </div>
                                </div>
                            </div>

                            {/* Semester Info Card */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl border border-blue-200 p-6">
                                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                                    Current Semester
                                </h3>
                                <div className="space-y-2">
                                    <div className="text-sm text-blue-800">
                                        <strong>Spring 2025</strong>
                                    </div>
                                    <div className="text-xs text-blue-600">
                                        January 21 - May 15, 2025
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Event Modal */}
                {showEventModal && (
                    <EventModal
                        event={selectedEvent}
                        onClose={closeModal}
                        currentDate={currentDateState}
                    />
                )}
            </div>
        </Layout>
    );
}
