import React, { createContext, useState, useEffect } from 'react';

// 1. Create the Context object
export const AuthContext = createContext({
    token: null,
    role: null,
    setToken: () => {},
    isLoggedIn: false,
    userData: null, 
    setUserData: () => {}, 
    logout: () => {},
});

// 2. Provider Component
export const AuthContextProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null); 

    const commonTokenKeys = ['token', 'authToken', 'accessToken', 'userJWT'];

    // Logout helper to clear token, role, user state, and cart
    const logout = () => {
        commonTokenKeys.forEach(k => localStorage.removeItem(k));
        localStorage.removeItem('userRole');
        localStorage.removeItem('cart');
        setToken(null);
        setRole(null);
        setUserData(null);
        setIsLoggedIn(false);
    };

    // --- 3. Effect to fetch token & role from localStorage on mount ---
    useEffect(() => {
        let storedToken = null;
        for (const key of commonTokenKeys) {
            const value = localStorage.getItem(key);
            if (value) {
                storedToken = value;
                break;
            }
        }
        const storedRole = localStorage.getItem('userRole');
        
        if (storedToken) {
            setToken(storedToken);
            if (storedRole) setRole(storedRole);
        }
    }, []);

    // --- 4. Update login status & fetch user/owner profile whenever token or role changes ---
    useEffect(() => {
        const loggedIn = !!token;
        setIsLoggedIn(loggedIn);

        if (!loggedIn) {
            setUserData(null);
        } else {
            (async () => {
                const currentRole = role || localStorage.getItem('userRole');
                const baseUrl = import.meta.env.VITE_API_URL;

                const fetchUserProfile = async () => {
                    try {
                        const res = await fetch(`${baseUrl}/user/profile`, {
                            method: 'GET',
                            headers: { "Authorization": `Bearer ${token}` }
                        });
                        if (res.ok) {
                            const result = await res.json();
                            const data = result.data?.user || result.data || result;
                            return { ...data, role: 'user' };
                        }
                    } catch (e) {
                        // Ignore
                    }
                    return null;
                };

                const fetchOwnerProfile = async () => {
                    try {
                        const res = await fetch(`${baseUrl}/owner/profile`, {
                            method: 'GET',
                            headers: { "Authorization": `Bearer ${token}` }
                        });
                        if (res.ok) {
                            const result = await res.json();
                            const data = result.data?.owner || result.data || result;
                            return { ...data, role: 'owner' };
                        }
                    } catch (e) {
                        // Ignore
                    }
                    return null;
                };

                let profile = null;
                if (currentRole === 'owner') {
                    profile = await fetchOwnerProfile();
                    if (!profile) profile = await fetchUserProfile();
                } else if (currentRole === 'user') {
                    profile = await fetchUserProfile();
                    if (!profile) profile = await fetchOwnerProfile();
                } else {
                    profile = await fetchUserProfile();
                    if (!profile) profile = await fetchOwnerProfile();
                }

                if (profile) {
                    setUserData(profile);
                    const detectedRole = profile.role || (currentRole || 'user');
                    setRole(detectedRole);
                    localStorage.setItem('userRole', detectedRole);
                } else {
                    // Token is invalid for both User and Owner - clear state
                    logout();
                }
            })();
        }
    }, [token, role]);

    const handleSetToken = (newToken, newRole = null) => {
        if (newToken) {
            localStorage.setItem('authToken', newToken);
            if (newRole) {
                localStorage.setItem('userRole', newRole);
                setRole(newRole);
            }
            setToken(newToken);
        } else {
            logout();
        }
    };

    const contextValue = {
        token,
        role,
        setToken: handleSetToken,
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
