import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';

// Custom hook for products
export const useProducts = () => {
  const dispatch = useDispatch();
  const products = useSelector(state => state.products);
  
  const setSearchTerm = useCallback((term) => {
    dispatch({ type: 'products/setSearchTerm', payload: term });
  }, [dispatch]);
  
  const setSelectedCategory = useCallback((category) => {
    dispatch({ type: 'products/setSelectedCategory', payload: category });
  }, [dispatch]);
  
  const clearFilters = useCallback(() => {
    dispatch({ type: 'products/clearFilters' });
  }, [dispatch]);
  
  return {
    ...products,
    setSearchTerm,
    setSelectedCategory,
    clearFilters,
  };
};

// Custom hook for cart
export const useCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const cartTotal = useSelector(state => 
    state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  );
  const cartItemCount = useSelector(state => 
    state.cart.items.reduce((count, item) => count + item.quantity, 0)
  );
  
  const addToCart = useCallback((product, quantity = 1) => {
    dispatch({ type: 'cart/addToCart', payload: { product, quantity } });
  }, [dispatch]);
  
  const removeFromCart = useCallback((productId) => {
    dispatch({ type: 'cart/removeFromCart', payload: productId });
  }, [dispatch]);
  
  const updateQuantity = useCallback((productId, quantity) => {
    dispatch({ type: 'cart/updateQuantity', payload: { id: productId, quantity } });
  }, [dispatch]);
  
  const clearCart = useCallback(() => {
    dispatch({ type: 'cart/clearCart' });
  }, [dispatch]);
  
  return {
    cartItems,
    cartTotal,
    cartItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
};
