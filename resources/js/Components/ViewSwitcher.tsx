import React from 'react';
import clsx from 'clsx';

interface ViewSwitcherProps {
    currentView: 'day' | 'week' | 'month' | 'year';
    onViewChange: (view: 'day' | 'week' | 'month' | 'year') => void;
}

export default function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
    const views = [
        { key: 'day', label: 'Day' },
        { key: 'week', label: 'Week' },
        { key: 'month', label: 'Month' },
        { key: 'year', label: 'Year' },
    ] as const;

    return (
        <div className="inline-flex rounded-lg bg-gray-100 p-1">
            {views.map(view => (
                <button
                    key={view.key}
                    onClick={() => onViewChange(view.key)}
                    className={clsx(
                        'px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200',
                        currentView === view.key
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    )}
                >
                    {view.label}
                </button>
            ))}
        </div>
    );
}
