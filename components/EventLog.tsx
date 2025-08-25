
import React from 'react';
import type { GameEvent } from '../types';

interface EventLogProps {
  events: GameEvent[];
}

const eventColorMap = {
    positive: 'text-green-400',
    negative: 'text-red-400',
    neutral: 'text-slate-400',
}

export const EventLog: React.FC<EventLogProps> = ({ events }) => {
  return (
    <div className="bg-slate-800 p-4 rounded-xl shadow-md h-96 flex flex-col">
      <h3 className="text-lg font-bold mb-3 text-white border-b border-slate-700 pb-2">Event Log</h3>
      <div className="overflow-y-auto flex-grow pr-2">
        {events.slice(0, 20).map((event) => (
          <div key={event.id} className="text-sm mb-2 border-b border-slate-800/50 pb-1">
            <span className="font-semibold text-slate-500 mr-2">Day {event.day}:</span>
            <span className={eventColorMap[event.type]}>{event.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
