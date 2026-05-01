import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CartCtx = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart]           = useState(null);
  const [subtotal, setSubtotal]   = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading]     = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setCart(null); setSubtotal(0); setItemCount(0); return; }
    try {
      setLoading(true);
      const r = await api.get('/cart');
      setCart(r.data.cart);
      setSubtotal(r.data.subtotal);
      setItemCount(r.data.itemCount);
    } catch {} finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, quantity = 1, size, color) => {
    const r = await api.post('/cart/add', { productId, quantity, size, color });
    setCart(r.data.cart); setSubtotal(r.data.subtotal); setItemCount(r.data.itemCount);
  };

  const updateItem = async (itemId, quantity) => {
    const r = await api.put(`/cart/item/${itemId}`, { quantity });
    setCart(r.data.cart); setSubtotal(r.data.subtotal); setItemCount(r.data.itemCount);
  };

  const removeItem = async (itemId) => {
    const r = await api.delete(`/cart/item/${itemId}`);
    setCart(r.data.cart); setSubtotal(r.data.subtotal); setItemCount(r.data.itemCount);
  };

  const clearCart = async () => {
    await api.delete('/cart/clear');
    setCart(null); setSubtotal(0); setItemCount(0);
  };

  return (
    <CartCtx.Provider value={{ cart, subtotal, itemCount, loading, addToCart, updateItem, removeItem, clearCart, fetchCart }}>
      {children}
    </CartCtx.Provider>
  );
};

export const useCart = () => useContext(CartCtx);
