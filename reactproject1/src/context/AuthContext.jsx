import React, { createContext, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/cartSlice';
import { persistor } from '../redux/store';

export const AuthContext = createContext({
  token: null,
  setToken: () => {},
  isLoggedIn: false,
  userData: null,
  setUserData: () => {},
  logout: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();

  const commonTokenKeys = ['token', 'authToken', 'accessToken', 'userJWT'];

  useEffect(() => {
    let storedToken = null;
    for (const key of commonTokenKeys) {
      const value = localStorage.getItem(key);
      if (value) {
        storedToken = value;
        break;
      }
    }
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    const loggedIn = !!token;
    setIsLoggedIn(loggedIn);
    if (!loggedIn) setUserData(null);
    else {
      (async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/owner/profile`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
          });
          if (res.ok) setUserData(await res.json());
          else setUserData(null);
        } catch {
          setUserData(null);
        }
      })();
    }
  }, [token]);

  const logout = () => {
    commonTokenKeys.forEach(key => localStorage.removeItem(key));
    dispatch(clearCart());
    persistor.purge();
    setToken(null);
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{ token, setToken, isLoggedIn, userData, setUserData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
