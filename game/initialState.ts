import { INITIAL_MONEY, INITIAL_PRODUCTS, INITIAL_REPUTATION, AVAILABLE_UPGRADES, AVAILABLE_LICENSES } from '../constants';
import type { GameState } from '../types';

export const initialState: GameState = {
  day: 1,
  money: INITIAL_MONEY,
  reputation: INITIAL_REPUTATION,
  products: JSON.parse(JSON.stringify(INITIAL_PRODUCTS)),
  staff: [],
  upgrades: JSON.parse(JSON.stringify(AVAILABLE_UPGRADES)),
  licenses: JSON.parse(JSON.stringify(AVAILABLE_LICENSES)),
  eventLog: [{ id: 1, day: 1, message: 'Welcome to Supermarket Tycoon! Your journey begins.', type: 'neutral' }],
  customersToday: 0,
  dailySales: 0,
  dailyWages: 0,
  dailyProfit: 0,
  customerQueue: [],
  cashierEfficiencyBonus: 1.0,
  activeEvent: null,
};