import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/cartSlice';
import { food_items } from '../Food';

export const dataContext = createContext();

function UserContext({ children }) {
  const [cate, setCate] = useState(food_items);
  const [input, setInput] = useState("");
  const [showCart, setShowCart] = useState(false);
  const { isLoggedIn, ready } = useContext(AuthContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!ready) return;

    if (!isLoggedIn) {
      dispatch(clearCart());
      localStorage.removeItem('cart');
    }
  }, [isLoggedIn, ready, dispatch]);

  const data = { cate, setCate, input, setInput, showCart, setShowCart };
  return <dataContext.Provider value={data}>{children}</dataContext.Provider>;
}

export default UserContext;
