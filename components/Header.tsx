
import React from 'react';

interface HeaderProps {
  money: number;
  day: number;
  reputation: number;
}

const StatDisplay: React.FC<{ label: string; value: string | number; icon: string }> = ({ label, value, icon }) => (
    <div className="flex items-center bg-slate-700/50 rounded-lg px-4 py-2">
      <span className="text-2xl mr-3">{icon}</span>
      <div>
        <div className="text-xs text-slate-400 uppercase font-bold">{label}</div>
        <div className="text-lg font-semibold text-white">{value}</div>
      </div>
    </div>
);


export const Header: React.FC<HeaderProps> = ({ money, day, reputation }) => {
  return (
    <header className="bg-slate-800 p-4 shadow-lg rounded-b-xl mb-6">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white tracking-wider">
          Supermarket <span className="text-emerald-400">Tycoon</span>
        </h1>
        <div className="flex items-center space-x-4">
            <StatDisplay label="Day" value={day} icon="🗓️" />
            <StatDisplay label="Money" value={`$${money.toLocaleString()}`} icon="💰" />
            <StatDisplay label="Reputation" value={`${Math.round(reputation)}%`} icon="⭐" />
        </div>
      </div>
    </header>
  );
};
