import React, { createContext, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCartItems } from '../redux/cartSlice';

export const AuthContext = createContext({
  token: null,
  setToken: () => {},
  isLoggedIn: false,
  userData: null,
  setUserData: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ NEW
  const dispatch = useDispatch();
  const tokenKeys = ['token', 'authToken', 'accessToken', 'userJWT'];

  useEffect(() => {
    let storedToken = null;
    for (const key of tokenKeys) {
      const value = localStorage.getItem(key);
      if (value) {
        storedToken = value;
        break;
      }
    }
    if (storedToken) setToken(storedToken);
    setLoading(false); // ✅ finished checking token
  }, []);

  useEffect(() => {
    const loggedIn = !!token;
    setIsLoggedIn(loggedIn);

    if (!loggedIn) {
      setUserData(null);
    } else {
      (async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/owner/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) setUserData(await res.json());
        } catch {
          setUserData(null);
        }
      })();

      (async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            dispatch(setCartItems(data));
            localStorage.setItem('cart', JSON.stringify(data));
          }
        } catch {}
      })();
    }
  }, [token, dispatch]);

  if (loading) return null; // ✅ WAIT until token is checked

  return (
    <AuthContext.Provider value={{ token, setToken, isLoggedIn, userData, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
