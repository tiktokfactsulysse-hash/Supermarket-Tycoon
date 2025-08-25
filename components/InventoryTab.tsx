
import React, { useState } from 'react';
import type { Product, GameAction } from '../types';

interface InventoryTabProps {
  products: Product[];
  money: number;
  dispatch: React.Dispatch<GameAction>;
}

const ProductCard: React.FC<{ product: Product; money: number; dispatch: React.Dispatch<GameAction> }> = ({ product, money, dispatch }) => {
    const [markup, setMarkup] = useState(product.markup);
    const [restockAmount, setRestockAmount] = useState(10);
    const salePrice = (product.basePrice * markup).toFixed(2);
    const stockPercentage = (product.stock / product.capacity) * 100;

    const handleRestock = () => {
        dispatch({ type: 'RESTOCK', payload: { productId: product.id, amount: restockAmount } });
    }
    
    const handleMarkupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMarkup = parseFloat(e.target.value);
        setMarkup(newMarkup);
        dispatch({type: 'SET_MARKUP', payload: {productId: product.id, markup: newMarkup}});
    }

    const canAffordRestock = money >= restockAmount * product.purchaseCost;

    return (
        <div className="bg-slate-700/50 p-4 rounded-lg flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xl font-bold">{product.icon} {product.name}</h4>
                    <span className="px-2 py-1 text-xs rounded-full bg-slate-600 text-slate-300">{product.quality}</span>
                </div>
                <div className="text-sm text-slate-400 mb-4">Sale Price: <span className="font-semibold text-emerald-400">${salePrice}</span> ({(markup * 100 - 100).toFixed(0)}% markup)</div>
                
                {/* Stock Level */}
                <div className="mb-2">
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>Stock</span>
                        <span>{product.stock} / {product.capacity}</span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2.5">
                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${stockPercentage}%` }}></div>
                    </div>
                </div>

                {/* Markup Slider */}
                <div className="mb-4">
                    <label className="block text-xs text-slate-300 mb-1">Set Markup</label>
                    <input 
                        type="range" 
                        min="1.05" 
                        max="2.0" 
                        step="0.05"
                        value={markup}
                        onChange={handleMarkupChange}
                        className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
            </div>

            {/* Restock Controls */}
            <div className="flex items-center space-x-2">
                <input 
                    type="number" 
                    value={restockAmount}
                    onChange={(e) => setRestockAmount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 bg-slate-800 border border-slate-600 rounded-md px-2 py-1 text-center"
                />
                <button 
                    onClick={handleRestock}
                    disabled={!canAffordRestock}
                    className="flex-grow bg-blue-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-blue-500 transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed"
                >
                    Restock (${(restockAmount * product.purchaseCost).toFixed(2)})
                </button>
            </div>
        </div>
    );
};

export const InventoryTab: React.FC<InventoryTabProps> = ({ products, money, dispatch }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} money={money} dispatch={dispatch} />
      ))}
    </div>
  );
};
