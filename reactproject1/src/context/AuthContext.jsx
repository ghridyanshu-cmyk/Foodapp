import React, { createContext, useState, useEffect } from 'react';

// 1. Create the Context object
export const AuthContext = createContext({
    token: null,
    setToken: () => {},
    isLoggedIn: false,
    userData: null, 
    setUserData: () => {}, 
});

// 2. Provider Component
export const AuthContextProvider = ({ children }) => {
    // State to hold the token
    const [token, setToken] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // State to hold profile data (name, email, role)
    const [userData, setUserData] = useState(null); 

    // Common keys to check in localStorage for robustness
    const commonTokenKeys = ['token', 'authToken', 'accessToken', 'userJWT'];

    // --- 3. Effect to fetch token from localStorage on mount ---
    useEffect(() => {
        let storedToken = null;
        
        // Loop through common keys to find the active token
        for (const key of commonTokenKeys) {
            const value = localStorage.getItem(key);
            if (value) {
                storedToken = value;
                break;
            }
        }
        
        // If a token is found, set it and mark as logged in
        if (storedToken) {
            setToken(storedToken);
            // NOTE: Full userData is usually fetched in App.js or a central hook
            // after the token is set here, to ensure role is also loaded.
        }

    }, []);

    // --- 4. Update login status whenever token state changes ---
    useEffect(() => {
        const loggedIn = !!token;
        setIsLoggedIn(loggedIn);
        // If logging out, clear user data
        if (!loggedIn) {
            setUserData(null);
        } else {
            // Fetch owner profile from backend if token exists
            (async () => {
                try {
                    const res = await fetch("http://localhost:8000/api/v2/owner/profile", {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        },
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setUserData(data);
                    } else {
                        setUserData(null);
                    }
                } catch (err) {
                    setUserData(null);
                }
            })();
        }
    }, [token]);

    // 5. Value provided to consuming components
    const contextValue = {
        token,
        setToken,
        isLoggedIn,
        userData, 
        setUserData, 
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
