
import React from 'react';
import type { StaffMember, GameAction } from '../types';
import { AVAILABLE_STAFF } from '../constants';

interface StaffTabProps {
  hiredStaff: StaffMember[];
  money: number;
  dispatch: React.Dispatch<GameAction>;
}

export const StaffTab: React.FC<StaffTabProps> = ({ hiredStaff, money, dispatch }) => {
    const availableToHire = AVAILABLE_STAFF.filter(candidate => !hiredStaff.some(hired => hired.id === candidate.id));

    const handleHire = (staff: StaffMember) => {
        dispatch({ type: 'HIRE_STAFF', payload: staff });
    }

    const handleFire = (staffId: number) => {
        dispatch({ type: 'FIRE_STAFF', payload: { staffId } });
    }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <h3 className="text-xl font-bold mb-4 text-white">Current Staff</h3>
            <div className="space-y-3">
                {hiredStaff.length > 0 ? hiredStaff.map(staff => (
                    <div key={staff.id} className="bg-slate-700/50 p-3 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-semibold">{staff.name} <span className="text-xs px-2 py-0.5 bg-purple-600 rounded-full">{staff.role}</span></p>
                            <p className="text-sm text-slate-400">Wage: ${staff.wage}/day | Efficiency: {staff.efficiency * 100}%</p>
                        </div>
                        <button 
                            onClick={() => handleFire(staff.id)}
                            className="bg-red-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-red-500 transition-colors"
                        >
                            Fire
                        </button>
                    </div>
                )) : <p className="text-slate-400">You haven't hired any staff.</p>}
            </div>
        </div>
        <div>
            <h3 className="text-xl font-bold mb-4 text-white">Available for Hire</h3>
            <div className="space-y-3">
            {availableToHire.map(staff => (
                    <div key={staff.id} className="bg-slate-700/50 p-3 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-semibold">{staff.name} <span className="text-xs px-2 py-0.5 bg-purple-600 rounded-full">{staff.role}</span></p>
                            <p className="text-sm text-slate-400">Wage: ${staff.wage}/day | Hiring Fee: ${staff.wage * 2}</p>
                        </div>
                        <button 
                            onClick={() => handleHire(staff)}
                            disabled={money < staff.wage * 2}
                            className="bg-green-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-green-500 transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed"
                        >
                            Hire
                        </button>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};
