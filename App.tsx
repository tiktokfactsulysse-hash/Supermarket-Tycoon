import React, { useReducer } from 'react';
import { Header } from './components/Header';
import { StatCard } from './components/StatCard';
import { ControlPanel } from './components/ControlPanel';
import { EventLog } from './components/EventLog';
import { Modal } from './components/Modal';
import { CheckoutCard } from './components/CheckoutCard';
import { useGameLoop } from './hooks/useGameLoop';
import { gameReducer } from './game/gameReducer';
import { initialState } from './game/initialState';
import { TICK_INTERVAL } from './constants';
import { StaffRole } from './types';

function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useGameLoop(dispatch, TICK_INTERVAL);
  
  const profitColor = state.dailyProfit >= 0 ? 'border-green-500' : 'border-red-500';
  const cashiers = state.staff.filter(s => s.role === StaffRole.Cashier);

  return (
    <div className="min-h-screen bg-slate-900 font-sans p-4 sm:p-6 lg:p-8">
      <Header money={state.money} day={state.day} reputation={state.reputation} />
      
      <main className="container mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard title="Daily Profit" value={`$${state.dailyProfit.toLocaleString()}`} icon="💹" colorClass={profitColor} />
            <StatCard title="Daily Sales" value={`$${state.dailySales.toLocaleString()}`} icon="🛒" colorClass="border-blue-500" />
            <CheckoutCard 
              queueLength={state.customerQueue.length}
              nextCartValue={state.customerQueue[0]}
              cashiers={cashiers}
              dispatch={dispatch}
            />
            <StatCard title="Daily Wages" value={`$${state.dailyWages.toLocaleString()}`} icon="💸" colorClass="border-yellow-500" />
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <ControlPanel state={state} dispatch={dispatch} />
            </div>
            <div>
                <EventLog events={state.eventLog} />
            </div>
        </div>
      </main>

      {state.activeEvent && (
        <Modal title={state.activeEvent.title} onClose={() => dispatch({type: 'DISMISS_EVENT'})}>
            <p className="text-slate-300 mb-6">{state.activeEvent.message}</p>
            <div className="flex justify-end space-x-3">
                {state.activeEvent.choices.map((choice, index) => (
                    <button 
                        key={index}
                        onClick={() => {
                            choice.action();
                            dispatch({type: 'DISMISS_EVENT'});
                        }}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
                    >
                        {choice.text}
                    </button>
                ))}
            </div>
        </Modal>
      )}

      {state.money < 0 && (
          <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center text-center p-4">
              <div>
                  <h2 className="text-5xl font-extrabold text-red-500 mb-4">Game Over</h2>
                  <p className="text-xl text-slate-300">You've gone bankrupt!</p>
                  <p className="text-slate-400 mt-2">Refresh the page to start a new empire.</p>
              </div>
          </div>
      )}

    </div>
  );
}

export default App;