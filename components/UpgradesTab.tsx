
import React from 'react';
import type { Upgrade, GameAction } from '../types';

interface UpgradesTabProps {
  upgrades: Upgrade[];
  money: number;
  dispatch: React.Dispatch<GameAction>;
}

export const UpgradesTab: React.FC<UpgradesTabProps> = ({ upgrades, money, dispatch }) => {
    
    const handlePurchase = (upgradeId: string) => {
        dispatch({ type: 'PURCHASE_UPGRADE', payload: { upgradeId } });
    }

    return (
        <div className="space-y-4">
            {upgrades.map(upgrade => (
                <div key={upgrade.id} className={`bg-slate-700/50 p-4 rounded-lg flex justify-between items-center ${upgrade.isPurchased ? 'opacity-50' : ''}`}>
                    <div>
                        <h4 className="text-lg font-bold text-white">{upgrade.name}</h4>
                        <p className="text-sm text-slate-400 max-w-lg">{upgrade.description}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-xl font-bold text-emerald-400 mb-2">${upgrade.cost.toLocaleString()}</p>
                        <button 
                            onClick={() => handlePurchase(upgrade.id)}
                            disabled={upgrade.isPurchased || money < upgrade.cost}
                            className="bg-emerald-600 text-white font-semibold py-2 px-5 rounded-md hover:bg-emerald-500 transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed"
                        >
                            {upgrade.isPurchased ? 'Purchased' : 'Buy'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};
