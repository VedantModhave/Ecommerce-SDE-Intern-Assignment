/**
 * Redux Store Configuration
 * 
 * Centralized state management using Redux Toolkit:
 * - products: Manages product data, search, filtering, and API state
 * - cart: Handles shopping cart items, quantities, and totals
 * 
 * Features:
 * - Automatic middleware setup (Redux DevTools, thunk)
 * - Immutable state updates
 * - Time-travel debugging support
 */
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';

/**
 * Configure Redux store with reducers
 * 
 * @returns {Object} Configured Redux store
 */
export const store = configureStore({
  reducer: {
    products: productsReducer, // Product catalog and search state
    cart: cartReducer,         // Shopping cart state
  },
  // Redux Toolkit automatically includes:
  // - Redux Thunk middleware for async actions
  // - Redux DevTools Extension integration
  // - Immutability checks in development
});

export default store;
