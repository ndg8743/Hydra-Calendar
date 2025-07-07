import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { router } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { XMarkIcon, MapPinIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';
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

interface EventModalProps {
    event: Event | null;
    onClose: () => void;
    currentDate: string;
}

export default function EventModal({ event, onClose, currentDate }: EventModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        room: '',
        start_time: '',
        end_time: '',
        recurrence_pattern: '',
        semester: 'Spring 2025'
    });
    const [isLoading, setIsLoading] = useState(false);

    const isEdit = !!event;

    useEffect(() => {
        if (event) {
            setFormData({
                title: event.title,
                description: event.description || '',
                room: event.room || '',
                start_time: format(parseISO(event.start_time), "yyyy-MM-dd'T'HH:mm"),
                end_time: format(parseISO(event.end_time), "yyyy-MM-dd'T'HH:mm"),
                recurrence_pattern: event.recurrence_pattern || '',
                semester: event.semester
            });
        } else {
            // Set default times for new events
            const defaultStart = new Date(currentDate);
            defaultStart.setHours(9, 0, 0, 0);
            const defaultEnd = new Date(currentDate);
            defaultEnd.setHours(10, 0, 0, 0);

            setFormData({
                title: '',
                description: '',
                room: '',
                start_time: format(defaultStart, "yyyy-MM-dd'T'HH:mm"),
                end_time: format(defaultEnd, "yyyy-MM-dd'T'HH:mm"),
                recurrence_pattern: '',
                semester: 'Spring 2025'
            });
        }
    }, [event, currentDate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const url = isEdit ? `/calendar/events/${event.id}` : '/calendar/events';
        const method = isEdit ? 'put' : 'post';

        router[method](url, formData, {
            onSuccess: () => {
                onClose();
            },
            onError: () => {
                setIsLoading(false);
            },
            onFinish: () => {
                setIsLoading(false);
            }
        });
    };

    const handleDelete = () => {
        if (!event || !confirm('Are you sure you want to delete this event?')) return;

        setIsLoading(true);
        router.delete(`/calendar/events/${event.id}`, {
            onSuccess: () => {
                onClose();
            },
            onFinish: () => {
                setIsLoading(false);
            }
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const recurrenceOptions = [
        { value: '', label: 'No Recurrence' },
        { value: 'Mon,Wed,Fri', label: 'Monday, Wednesday, Friday' },
        { value: 'Tue,Thu', label: 'Tuesday, Thursday' },
        { value: 'Mon,Tue,Wed,Thu,Fri', label: 'Weekdays' },
        { value: 'daily', label: 'Daily' },
    ];

    return (
        <Transition appear show={true}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-50" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex items-center justify-between mb-6">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-semibold leading-6 text-gray-900"
                                    >
                                        {isEdit ? 'Edit Event' : 'Create New Event'}
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="rounded-lg p-1 hover:bg-gray-100 transition-colors"
                                    >
                                        <XMarkIcon className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Event Title *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter event title"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Event description (optional)"
                                        />
                                    </div>

                                    {/* Room */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            <MapPinIcon className="inline w-4 h-4 mr-1" />
                                            Room/Location
                                        </label>
                                        <input
                                            type="text"
                                            name="room"
                                            value={formData.room}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="e.g., Room 101, Lab A"
                                        />
                                    </div>

                                    {/* Time */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                <ClockIcon className="inline w-4 h-4 mr-1" />
                                                Start Time *
                                            </label>
                                            <input
                                                type="datetime-local"
                                                name="start_time"
                                                value={formData.start_time}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                End Time *
                                            </label>
                                            <input
                                                type="datetime-local"
                                                name="end_time"
                                                value={formData.end_time}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    {/* Recurrence */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Recurrence Pattern
                                        </label>
                                        <select
                                            name="recurrence_pattern"
                                            value={formData.recurrence_pattern}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            {recurrenceOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Semester */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            <CalendarIcon className="inline w-4 h-4 mr-1" />
                                            Semester *
                                        </label>
                                        <select
                                            name="semester"
                                            value={formData.semester}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="Spring 2025">Spring 2025</option>
                                            <option value="Fall 2025">Fall 2025</option>
                                        </select>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-between pt-4">
                                        {isEdit && (
                                            <button
                                                type="button"
                                                onClick={handleDelete}
                                                disabled={isLoading}
                                                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                Delete Event
                                            </button>
                                        )}
                                        <div className={clsx('flex space-x-3', !isEdit && 'ml-auto')}>
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                disabled={isLoading}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                {isLoading ? 'Saving...' : (isEdit ? 'Update Event' : 'Create Event')}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
