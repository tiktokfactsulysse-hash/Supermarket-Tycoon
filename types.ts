export enum ProductQuality {
  Budget = 'Budget',
  Standard = 'Standard',
  Premium = 'Premium',
}

export interface Product {
  id: number;
  name: string;
  quality: ProductQuality;
  basePrice: number;
  stock: number;
  capacity: number;
  markup: number; // as a percentage, e.g., 1.25 for 25% markup
  purchaseCost: number;
  icon: string;
}

export enum StaffRole {
  Cashier = 'Cashier',
  Stocker = 'Stocker',
  Manager = 'Manager',
}

export interface StaffMember {
  id: number;
  name: string;
  role: StaffRole;
  wage: number; // per day
  efficiency: number; // 0 to 1
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  isPurchased: boolean;
  effect: (state: GameState) => GameState;
}

export interface ProductLicense {
  id: string;
  name: string;
  description: string;
  cost: number;
  isPurchased: boolean;
  productsToUnlock: Product[];
}

export interface GameEvent {
  id: number;
  day: number;
  message: string;
  type: 'positive' | 'negative' | 'neutral';
}

export interface GameState {
  day: number;
  money: number;
  reputation: number; // 0 to 100
  products: Product[];
  staff: StaffMember[];
  upgrades: Upgrade[];
  licenses: ProductLicense[];
  eventLog: GameEvent[];
  customersToday: number;
  dailySales: number;
  dailyWages: number;
  dailyProfit: number;
  customerQueue: number[]; // Array of cart values
  cashierEfficiencyBonus: number;
  activeEvent: {
    title: string;
    message: string;
    choices: { text: string; action: () => void }[];
  } | null;
}

export type GameAction =
  | { type: 'TICK' }
  | { type: 'SET_MARKUP'; payload: { productId: number; markup: number } }
  | { type: 'RESTOCK'; payload: { productId: number; amount: number } }
  | { type: 'HIRE_STAFF'; payload: StaffMember }
  | { type: 'FIRE_STAFF'; payload: { staffId: number } }
  | { type: 'PURCHASE_UPGRADE'; payload: { upgradeId: string } }
  | { type: 'PURCHASE_LICENSE'; payload: { licenseId: string } }
  | { type: 'MANUAL_CHECKOUT' }
  | { type: 'DISMISS_EVENT' };