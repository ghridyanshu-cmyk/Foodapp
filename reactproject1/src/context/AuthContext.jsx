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
    const dispatch = useDispatch();
    const [token, setToken] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

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

        if (!loggedIn) {
            setUserData(null);
            dispatch(setCartItems([]));
            localStorage.removeItem('cart');
        } else {
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
    }, [token, dispatch]);

    return (
        <AuthContext.Provider value={{ token, setToken, isLoggedIn, userData, setUserData }}>
            {children}
        </AuthContext.Provider>
    );
};
