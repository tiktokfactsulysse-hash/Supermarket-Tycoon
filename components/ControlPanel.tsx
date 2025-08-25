import React, { useState } from 'react';
import type { GameState, GameAction } from '../types';
import { InventoryTab } from './InventoryTab';
import { StaffTab } from './StaffTab';
import { UpgradesTab } from './UpgradesTab';
import { LicensesTab } from './LicensesTab';

interface ControlPanelProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

type Tab = 'Inventory' | 'Staff' | 'Upgrades' | 'Licenses';

export const ControlPanel: React.FC<ControlPanelProps> = ({ state, dispatch }) => {
  const [activeTab, setActiveTab] = useState<Tab>('Inventory');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Inventory':
        return <InventoryTab products={state.products} money={state.money} dispatch={dispatch} />;
      case 'Staff':
        return <StaffTab hiredStaff={state.staff} money={state.money} dispatch={dispatch} />;
      case 'Upgrades':
        return <UpgradesTab upgrades={state.upgrades} money={state.money} dispatch={dispatch} />;
      case 'Licenses':
        return <LicensesTab licenses={state.licenses} money={state.money} dispatch={dispatch} />;
      default:
        return null;
    }
  };
  
  const TabButton: React.FC<{tabName: Tab}> = ({ tabName }) => {
    const isActive = activeTab === tabName;
    return (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-6 py-3 text-lg font-semibold rounded-t-lg transition-colors ${
                isActive 
                ? 'bg-slate-800 text-white' 
                : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
            }`}
        >
            {tabName}
        </button>
    )
  }

  return (
    <div className="bg-slate-800/50 rounded-xl shadow-lg border border-slate-700/50">
      <div className="flex border-b border-slate-700">
          <TabButton tabName="Inventory"/>
          <TabButton tabName="Staff"/>
          <TabButton tabName="Upgrades"/>
          <TabButton tabName="Licenses"/>
      </div>
      <div className="p-6 bg-slate-800 rounded-b-xl">
        {renderTabContent()}
      </div>
    </div>
  );
};