import React from 'react';
import type { ProductLicense, GameAction } from '../types';

interface LicensesTabProps {
  licenses: ProductLicense[];
  money: number;
  dispatch: React.Dispatch<GameAction>;
}

export const LicensesTab: React.FC<LicensesTabProps> = ({ licenses, money, dispatch }) => {
    
    const handlePurchase = (licenseId: string) => {
        dispatch({ type: 'PURCHASE_LICENSE', payload: { licenseId } });
    }

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-2">Product Licenses</h3>
            {licenses.map(license => (
                <div key={license.id} className={`bg-slate-700/50 p-4 rounded-lg flex justify-between items-center ${license.isPurchased ? 'opacity-50' : ''}`}>
                    <div>
                        <h4 className="text-lg font-bold text-white">{license.name}</h4>
                        <p className="text-sm text-slate-400 max-w-lg">{license.description}</p>
                        <div className="mt-2 text-xs text-slate-300">
                            Unlocks: {license.productsToUnlock.map(p => `${p.icon} ${p.name}`).join(', ')}
                        </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xl font-bold text-emerald-400 mb-2">${license.cost.toLocaleString()}</p>
                        <button 
                            onClick={() => handlePurchase(license.id)}
                            disabled={license.isPurchased || money < license.cost}
                            className="bg-emerald-600 text-white font-semibold py-2 px-5 rounded-md hover:bg-emerald-500 transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed"
                        >
                            {license.isPurchased ? 'Purchased' : 'Buy License'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};