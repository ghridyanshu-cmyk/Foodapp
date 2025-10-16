import React, { createContext, useState, useEffect, useContext } from 'react';
import { food_items } from '../Food';
import { AuthContext } from './AuthContext';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/cartSlice'; // 🔥 make sure you export this action

export const dataContext = createContext();

function UserContext({ children }) {
    const [cate, setCate] = useState(food_items);
    const [input, setInput] = useState("");
    const [showCart, setShowCart] = useState(false);
    const { isLoggedIn } = useContext(AuthContext);
    const dispatch = useDispatch();

    // 👇 Clear Redux + localStorage cart when logged out
    useEffect(() => {
        if (!isLoggedIn) {
            localStorage.removeItem('cart');
            dispatch(clearCart());
        }
    }, [isLoggedIn, dispatch]);

    const data = {
        input,
        setInput,
        cate,
        setCate,
        showCart,
        setShowCart,
    };

    return (
        <dataContext.Provider value={data}>
            {children}
        </dataContext.Provider>
    );
}

export default UserContext;
