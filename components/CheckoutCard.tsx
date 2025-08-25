import React from 'react';
import type { GameAction, StaffMember } from '../types';

interface CheckoutCardProps {
    queueLength: number;
    nextCartValue?: number;
    cashiers: StaffMember[];
    dispatch: React.Dispatch<GameAction>;
}

export const CheckoutCard: React.FC<CheckoutCardProps> = ({ queueLength, nextCartValue, cashiers, dispatch }) => {
    
    const handleCheckout = () => {
        dispatch({ type: 'MANUAL_CHECKOUT' });
    };

    const queueColor = queueLength > 10 ? 'text-red-400' : queueLength > 5 ? 'text-yellow-400' : 'text-white';

    return (
        <div className="bg-slate-800 p-4 rounded-xl shadow-md flex flex-col justify-between border-l-4 border-purple-500">
            <div>
                <div className="flex items-center justify-between mb-2">
                    <p className="text-slate-400 text-sm font-medium">Checkout Counter</p>
                    <div className="text-3xl">👥</div>
                </div>
                <p className="text-2xl font-bold">
                    <span className={queueColor}>{queueLength}</span>
                    <span className="text-lg text-slate-300"> Customers Waiting</span>
                </p>
                <p className="text-xs text-slate-500 h-4">
                    {cashiers.length > 0 
                        ? `${cashiers.length} cashier(s) working automatically.` 
                        : 'No cashiers on duty.'
                    }
                </p>
            </div>
            <button
                onClick={handleCheckout}
                disabled={queueLength === 0}
                className="w-full mt-3 bg-purple-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
                {queueLength > 0 ? `Checkout Next ($${nextCartValue?.toFixed(2)})` : 'Queue Empty'}
            </button>
        </div>
    );
};