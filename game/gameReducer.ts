import type { GameState, GameAction } from '../types';
import { StaffRole } from '../types';
import { RENT_COST, AVAILABLE_UPGRADES } from '../constants';

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'TICK': {
      // --- Simulation Logic for a Day ---
      const newState: GameState = { ...state, day: state.day + 1, dailySales: 0, dailyWages: 0, customerQueue: [...state.customerQueue] };

      // 1. Calculate Staff Effects
      const cashiers = newState.staff.filter(s => s.role === StaffRole.Cashier);
      const stockers = newState.staff.filter(s => s.role === StaffRole.Stocker);
      const managers = newState.staff.filter(s => s.role === StaffRole.Manager);
      
      const cashierEfficiency = cashiers.reduce((acc, s) => acc + s.efficiency, 0) * newState.cashierEfficiencyBonus;
      const stockerEfficiency = stockers.reduce((acc, s) => acc + s.efficiency, 0);
      const managerBonus = managers.length > 0 ? 1.1 : 1.0;

      // 2. Calculate Customer Traffic & Generate Queue
      const baseCustomers = 25;
      const reputationFactor = newState.reputation / 50; // from 0 to 2
      const pricingFactor = 1 - (newState.products.reduce((acc, p) => acc + p.markup, 0) / newState.products.length - 1.25) / 2;
      let customers = Math.floor(baseCustomers * reputationFactor * pricingFactor * managerBonus);
      customers = Math.max(5, customers);
      newState.customersToday = customers;
      
      let reputationChange = 0;
      
      const inStockProducts = newState.products.filter(p => p.stock > 0);
      if (inStockProducts.length > 0) {
        const avgPrice = inStockProducts.reduce((acc, p) => acc + (p.basePrice * p.markup), 0) / inStockProducts.length;
        for (let i = 0; i < customers; i++) {
            const itemsInCart = Math.floor(Math.random() * 4) + 1;
            const cartValue = (avgPrice * itemsInCart) * (Math.random() * 0.4 + 0.8); // Add some variance
            newState.customerQueue.push(parseFloat(cartValue.toFixed(2)));
        }
      }

      // 3. Simulate Checkout (Automated by Cashiers)
      let totalSales = 0;
      const autoCheckouts = Math.floor(cashierEfficiency * managerBonus * 25); // Each efficiency point helps checkout more customers
      for(let i = 0; i < autoCheckouts; i++) {
        if(newState.customerQueue.length > 0) {
            const sale = newState.customerQueue.shift();
            if (sale) {
                totalSales += sale;
            }
        }
      }
      newState.dailySales = totalSales;
      newState.money += totalSales;

      // 4. Pay Wages & Rent
      const totalWages = newState.staff.reduce((acc, s) => acc + s.wage, 0);
      newState.dailyWages = totalWages;
      newState.money -= totalWages;
      newState.money -= RENT_COST;

      // 5. Update Reputation
      reputationChange += (managerBonus - 1) * 2; // Managers boost reputation
      // Penalty for long queue
      if (newState.customerQueue.length > 10) {
          reputationChange -= (newState.customerQueue.length - 10) * 0.2;
          newState.eventLog.unshift({id: Date.now(), day: newState.day, message: `Long queues are frustrating customers!`, type: 'negative'})
      }
      // Penalty for out of stock items
      const outOfStockCount = state.products.length - inStockProducts.length;
      if (outOfStockCount > 0) {
          reputationChange -= outOfStockCount * 0.2;
      }
      newState.reputation = Math.max(0, Math.min(100, newState.reputation + reputationChange));
      
      // 6. Update Daily Profit
      newState.dailyProfit = newState.dailySales - newState.dailyWages - RENT_COST;

      // 7. Auto-stocking by stockers
      if(stockers.length > 0) {
          const restockAmount = Math.floor(stockerEfficiency * 20); // Each stocker efficiency point restocks some items
          newState.products.forEach(p => {
              if (p.stock < p.capacity / 2) {
                  const needed = p.capacity - p.stock;
                  const canAffordAmount = Math.floor(newState.money / p.purchaseCost);
                  const toRestock = Math.min(needed, restockAmount, canAffordAmount);
                  if (toRestock > 0) {
                      p.stock += toRestock;
                      newState.money -= toRestock * p.purchaseCost;
                      newState.eventLog.unshift({id: Date.now(), day: newState.day, message: `Stocker restocked ${toRestock} units of ${p.name}.`, type: 'neutral'});
                  }
              }
          })
      }

      return newState;
    }
    case 'MANUAL_CHECKOUT': {
        if (state.customerQueue.length === 0) return state;

        const newState = {...state, customerQueue: [...state.customerQueue]};
        const sale = newState.customerQueue.shift();
        
        if (sale) {
            newState.money += sale;
            newState.dailySales += sale;
            newState.dailyProfit += sale;
        }

        return newState;
    }
    case 'SET_MARKUP': {
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.payload.productId ? { ...p, markup: action.payload.markup } : p
        ),
      };
    }
    case 'RESTOCK': {
      const product = state.products.find(p => p.id === action.payload.productId);
      if (!product) return state;
      
      const amountToStock = Math.min(action.payload.amount, product.capacity - product.stock);
      const cost = amountToStock * product.purchaseCost;

      if (state.money >= cost && amountToStock > 0) {
        return {
          ...state,
          money: state.money - cost,
          products: state.products.map(p =>
            p.id === action.payload.productId ? { ...p, stock: p.stock + amountToStock } : p
          ),
        };
      }
      return state;
    }
    case 'HIRE_STAFF': {
        const cost = action.payload.wage * 2; // hiring bonus
        if(state.money < cost) return state;
        return {
            ...state,
            money: state.money - cost,
            staff: [...state.staff, action.payload],
            eventLog: [...state.eventLog, {id: Date.now(), day: state.day, message: `Hired ${action.payload.name} the ${action.payload.role}.`, type: 'neutral'}]
        }
    }
    case 'FIRE_STAFF': {
        return {
            ...state,
            staff: state.staff.filter(s => s.id !== action.payload.staffId),
            eventLog: [...state.eventLog, {id: Date.now(), day: state.day, message: `Fired a staff member.`, type: 'negative'}]
        }
    }
    case 'PURCHASE_UPGRADE': {
        const upgrade = state.upgrades.find(u => u.id === action.payload.upgradeId);
        if (!upgrade || upgrade.isPurchased || state.money < upgrade.cost) return state;

        // The 'upgrade' from state has lost its 'effect' function due to JSON serialization.
        // We must find the original upgrade from the constants to get the function.
        const originalUpgrade = AVAILABLE_UPGRADES.find(u => u.id === action.payload.upgradeId);
        if (!originalUpgrade || typeof originalUpgrade.effect !== 'function') {
            console.error(`Upgrade effect function not found for ID: ${action.payload.upgradeId}`);
            return state; // Safety return
        }

        const newState: GameState = {
            ...state,
            money: state.money - upgrade.cost,
            upgrades: state.upgrades.map(u => u.id === action.payload.upgradeId ? { ...u, isPurchased: true } : u),
            eventLog: [...state.eventLog, { id: Date.now(), day: state.day, message: `Purchased Upgrade: ${upgrade.name}!`, type: 'positive' }]
        };
        
        // Call the effect function from the original constant, not from the state object.
        return originalUpgrade.effect(newState);
    }
    case 'PURCHASE_LICENSE': {
      const license = state.licenses.find(l => l.id === action.payload.licenseId);
      if (!license || license.isPurchased || state.money < license.cost) return state;

      return {
        ...state,
        money: state.money - license.cost,
        licenses: state.licenses.map(l => l.id === action.payload.licenseId ? { ...l, isPurchased: true } : l),
        products: [...state.products, ...license.productsToUnlock],
        eventLog: [...state.eventLog, { id: Date.now(), day: state.day, message: `Purchased License: ${license.name}!`, type: 'positive' }]
      };
    }
    case 'DISMISS_EVENT':
        return { ...state, activeEvent: null };
    default:
      return state;
  }
}