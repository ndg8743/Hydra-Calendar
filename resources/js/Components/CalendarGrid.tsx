import React from 'react';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

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

interface CalendarGridProps {
    events: Event[];
    view: 'day' | 'week' | 'month' | 'year';
    currentDate: string;
    onEventClick: (event: Event) => void;
    onDateChange: (date: string) => void;
}

export default function CalendarGrid({ 
    events, 
    view, 
    currentDate, 
    onEventClick, 
    onDateChange 
}: CalendarGridProps) {
    const date = parseISO(currentDate);

    const navigateDate = (direction: 'prev' | 'next') => {
        const currentDateObj = parseISO(currentDate);
        let newDate: Date;

        switch (view) {
            case 'day':
                newDate = new Date(currentDateObj);
                newDate.setDate(currentDateObj.getDate() + (direction === 'next' ? 1 : -1));
                break;
            case 'week':
                newDate = new Date(currentDateObj);
                newDate.setDate(currentDateObj.getDate() + (direction === 'next' ? 7 : -7));
                break;
            case 'month':
                newDate = new Date(currentDateObj);
                newDate.setMonth(currentDateObj.getMonth() + (direction === 'next' ? 1 : -1));
                break;
            case 'year':
                newDate = new Date(currentDateObj);
                newDate.setFullYear(currentDateObj.getFullYear() + (direction === 'next' ? 1 : -1));
                break;
            default:
                return;
        }

        onDateChange(format(newDate, 'yyyy-MM-dd'));
    };

    const getEventsForDate = (date: Date) => {
        return events.filter(event => 
            isSameDay(parseISO(event.start_time), date)
        );
    };

    const renderMonthView = () => {
        const monthStart = startOfMonth(date);
        const monthEnd = endOfMonth(date);

        // Get days to show (including previous/next month days for complete weeks)
        const startDate = new Date(monthStart);
        startDate.setDate(startDate.getDate() - monthStart.getDay());
        const endDate = new Date(monthEnd);
        endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()));
        const allDays = eachDayOfInterval({ start: startDate, end: endDate });

        return (
            <div className="h-full">
                {/* Month Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {format(date, 'MMMM yyyy')}
                    </h2>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => navigateDate('prev')}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                            onClick={() => onDateChange(format(new Date(), 'yyyy-MM-dd'))}
                            className="px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            Today
                        </button>
                        <button
                            onClick={() => navigateDate('next')}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Days of Week Header */}
                <div className="grid grid-cols-7 border-b border-gray-200">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="p-4 text-center">
                            <span className="text-sm font-medium text-gray-500">{day}</span>
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 flex-1">
                    {allDays.map(day => {
                        const dayEvents = getEventsForDate(day);
                        const isCurrentMonth = isSameMonth(day, date);
                        const isCurrentDay = isToday(day);

                        return (
                            <div
                                key={day.toISOString()}
                                className={clsx(
                                    'min-h-[120px] border-r border-b border-gray-200 p-2',
                                    !isCurrentMonth && 'bg-gray-50 text-gray-400',
                                    isCurrentDay && 'bg-blue-50'
                                )}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className={clsx(
                                        'text-sm font-medium',
                                        isCurrentDay && 'text-blue-600'
                                    )}>
                                        {format(day, 'd')}
                                    </span>
                                    {isCurrentDay && (
                                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                    )}
                                </div>
                                
                                <div className="space-y-1">
                                    {dayEvents.slice(0, 3).map(event => (
                                        <button
                                            key={event.id}
                                            onClick={() => onEventClick(event)}
                                            className="w-full text-left p-1 text-xs rounded bg-blue-100 hover:bg-blue-200 text-blue-800 transition-colors"
                                        >
                                            <div className="font-medium truncate">{event.title}</div>
                                            {event.room && (
                                                <div className="text-blue-600 truncate">{event.room}</div>
                                            )}
                                        </button>
                                    ))}
                                    {dayEvents.length > 3 && (
                                        <div className="text-xs text-gray-500 pl-1">
                                            +{dayEvents.length - 3} more
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderWeekView = () => {
        return (
            <div className="p-6">
                <div className="text-center text-gray-500">
                    Week view - Coming soon
                </div>
            </div>
        );
    };

    const renderDayView = () => {
        return (
            <div className="p-6">
                <div className="text-center text-gray-500">
                    Day view - Coming soon
                </div>
            </div>
        );
    };

    const renderYearView = () => {
        return (
            <div className="p-6">
                <div className="text-center text-gray-500">
                    Year view - Coming soon
                </div>
            </div>
        );
    };

    const renderView = () => {
        switch (view) {
            case 'month':
                return renderMonthView();
            case 'week':
                return renderWeekView();
            case 'day':
                return renderDayView();
            case 'year':
                return renderYearView();
            default:
                return renderMonthView();
        }
    };

    return (
        <div className="h-[600px] flex flex-col">
            {renderView()}
        </div>
    );
}
