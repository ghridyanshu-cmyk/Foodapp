import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({
    token: null,
    setToken: () => {},
    isLoggedIn: false,
    userData: null,
    setUserData: () => {},
    logout: () => {},
});

const TOKEN_STORAGE_KEY = 'userToken'; 

export const AuthContextProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    const logout = () => {
        setToken(null);
        setUserData(null);
        setIsLoggedIn(false);

        localStorage.removeItem(TOKEN_STORAGE_KEY);
        
        ['token', 'authToken', 'accessToken', 'userJWT'].forEach(key => {
             if (key !== TOKEN_STORAGE_KEY) localStorage.removeItem(key);
        });
    };

    useEffect(() => {
        const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
        
        if (storedToken) {
            setToken(storedToken);
        } else {
            let oldToken = null;
            const commonTokenKeys = ['token', 'authToken', 'accessToken', 'userJWT'];
            for (const key of commonTokenKeys) {
                const value = localStorage.getItem(key);
                if (value) {
                    oldToken = value;
                    localStorage.removeItem(key);
                    break;
                }
            }
            if (oldToken) {
                localStorage.setItem(TOKEN_STORAGE_KEY, oldToken);
                setToken(oldToken);
            }
        }
    }, []);

    useEffect(() => {
        const loggedIn = !!token;
        setIsLoggedIn(loggedIn);

        if (token) {
            localStorage.setItem(TOKEN_STORAGE_KEY, token);

            (async () => {
                try {
                    const res = await fetch(`${import.meta.env.VITE_API_URL}/owner/profile`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        },
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setUserData(data);
                    } else {
                        logout(); 
                    }
                } catch (err) {
                    setUserData(null);
                }
            })();
        } else {
            setUserData(null);
            localStorage.removeItem(TOKEN_STORAGE_KEY);
        }
    }, [token]);

    const contextValue = {
        token,
        setToken,
        isLoggedIn,
        userData,
        setUserData,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};