import type { Product, StaffMember, Upgrade, ProductLicense } from './types';
import { ProductQuality, StaffRole } from './types';

export const TICK_INTERVAL = 5000; // 5 seconds per day
export const INITIAL_MONEY = 7500;
export const INITIAL_REPUTATION = 50;
export const RENT_COST = 50;

export const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: 'Bread', quality: ProductQuality.Budget, basePrice: 1.5, stock: 50, capacity: 100, markup: 1.3, purchaseCost: 1.0, icon: '🍞' },
  { id: 2, name: 'Milk', quality: ProductQuality.Standard, basePrice: 2.5, stock: 40, capacity: 80, markup: 1.25, purchaseCost: 1.8, icon: '🥛' },
  { id: 3, name: 'Apples', quality: ProductQuality.Standard, basePrice: 0.5, stock: 100, capacity: 200, markup: 1.4, purchaseCost: 0.3, icon: '🍎' },
  { id: 4, name: 'Cereal', quality: ProductQuality.Budget, basePrice: 3.0, stock: 30, capacity: 60, markup: 1.35, purchaseCost: 2.2, icon: '🥣' },
];

export const AVAILABLE_STAFF: StaffMember[] = [
  { id: 101, name: 'Alice', role: StaffRole.Cashier, wage: 80, efficiency: 0.7 },
  { id: 102, name: 'Bob', role: StaffRole.Stocker, wage: 70, efficiency: 0.6 },
  { id: 103, name: 'Charlie', role: StaffRole.Cashier, wage: 90, efficiency: 0.85 },
  { id: 104, name: 'Diana', role: StaffRole.Manager, wage: 150, efficiency: 0.9 },
];

export const AVAILABLE_UPGRADES: Upgrade[] = [
    {
        id: 'self-checkout',
        name: 'Self-Checkout Kiosk',
        description: 'Reduces need for cashiers and slightly improves customer throughput.',
        cost: 2500,
        isPurchased: false,
        effect: (state) => ({ ...state, cashierEfficiencyBonus: state.cashierEfficiencyBonus + 0.1, reputation: state.reputation + 2 }),
    },
    {
        id: 'faster-scanners',
        name: 'Faster Scanners',
        description: 'Upgrade checkout scanners to increase cashier efficiency by 20%.',
        cost: 3000,
        isPurchased: false,
        effect: (state) => ({ ...state, cashierEfficiencyBonus: state.cashierEfficiencyBonus + 0.2 }),
    },
    {
        id: 'larger-stockroom',
        name: 'Larger Stockroom',
        description: 'Increases the capacity of all products by 50%.',
        cost: 4000,
        isPurchased: false,
        effect: (state) => ({
            ...state,
            products: state.products.map(p => ({ ...p, capacity: Math.floor(p.capacity * 1.5) })),
        }),
    },
    {
        id: 'marketing-campaign',
        name: 'Local Ad Campaign',
        description: 'Run a marketing campaign to boost reputation and attract more customers for a while.',
        cost: 1500,
        isPurchased: false, // This could be a recurring purchase in a more complex game
        effect: (state) => ({ ...state, reputation: Math.min(100, state.reputation + 10) }),
    },
    {
        id: 'premium-supplier',
        name: 'Premium Supplier Deal',
        description: 'Unlock access to premium quality products, attracting wealthier customers.',
        cost: 5000,
        isPurchased: false,
        effect: (state) => ({
            ...state,
            products: [
                ...state.products,
                { id: 5, name: 'Artisanal Cheese', quality: ProductQuality.Premium, basePrice: 8, stock: 0, capacity: 40, markup: 1.5, purchaseCost: 5, icon: '🧀' },
                { id: 6, name: 'Organic Berries', quality: ProductQuality.Premium, basePrice: 6, stock: 0, capacity: 50, markup: 1.6, purchaseCost: 3.5, icon: '🍓' },
            ],
        }),
    }
];

export const AVAILABLE_LICENSES: ProductLicense[] = [
    {
        id: 'snacks-license',
        name: 'Snacks License',
        description: 'Unlock a variety of popular snacks to sell.',
        cost: 1000,
        isPurchased: false,
        productsToUnlock: [
            { id: 10, name: 'Potato Chips', quality: ProductQuality.Standard, basePrice: 2.0, stock: 0, capacity: 150, markup: 1.4, purchaseCost: 1.2, icon: '🥔' },
            { id: 11, name: 'Chocolate Bar', quality: ProductQuality.Standard, basePrice: 1.5, stock: 0, capacity: 200, markup: 1.5, purchaseCost: 0.8, icon: '🍫' },
        ]
    },
    {
        id: 'drinks-license',
        name: 'Drinks License',
        description: 'Stock your shelves with refreshing beverages.',
        cost: 1500,
        isPurchased: false,
        productsToUnlock: [
            { id: 12, name: 'Soda Can', quality: ProductQuality.Budget, basePrice: 0.8, stock: 0, capacity: 300, markup: 1.6, purchaseCost: 0.4, icon: '🥤' },
            { id: 13, name: 'Orange Juice', quality: ProductQuality.Standard, basePrice: 3.5, stock: 0, capacity: 80, markup: 1.4, purchaseCost: 2.5, icon: '🧃' },
        ]
    },
    {
        id: 'frozen-foods-license',
        name: 'Frozen Foods License',
        description: 'Requires special freezers, but offers high-margin products.',
        cost: 3500,
        isPurchased: false,
        productsToUnlock: [
            { id: 14, name: 'Ice Cream Tub', quality: ProductQuality.Premium, basePrice: 5.0, stock: 0, capacity: 60, markup: 1.6, purchaseCost: 3.0, icon: '🍦' },
            { id: 15, name: 'Frozen Pizza', quality: ProductQuality.Standard, basePrice: 6.0, stock: 0, capacity: 100, markup: 1.5, purchaseCost: 4.0, icon: '🍕' },
        ]
    }
];