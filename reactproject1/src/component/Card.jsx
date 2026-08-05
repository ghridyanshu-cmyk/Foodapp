import React, { useContext } from 'react';
import { LuLeafyGreen } from "react-icons/lu";
import { GiChickenOven } from "react-icons/gi";
import { Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AddItem } from '../redux/cartSlice';
import axios from 'axios';
import { dataContext } from '../context/UserContext';

const Card = ({ name, image, id, price, type }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token, isLoggedIn } = useContext(AuthContext);
    const { setShowCart } = useContext(dataContext);

    const handleAddToCart = async () => {
        if (!token || !isLoggedIn) {
            navigate('/login');
            return;
        }

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/cart/add`, {
                productId: id,
                qty: 1,
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const newItem = { id, name, price, image, type, qty: 1 };
            dispatch(AddItem(newItem));

            let localCart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existingItemIndex = localCart.findIndex(item => item.id === id);
            if (existingItemIndex > -1) {
                localCart[existingItemIndex].qty += 1;
            } else {
                localCart.push(newItem);
            }
            localStorage.setItem('cart', JSON.stringify(localCart));
            setShowCart(true);

        } catch (error) {
            console.error("Backend cart add error:", error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    const isVeg = (type || '').toLowerCase() === 'veg';

    return (
        <div className="w-full max-w-[280px] sm:max-w-[300px] h-[380px] bg-white rounded-2xl p-4 flex flex-col justify-between border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 group mx-auto">
            
            {/* Image Box */}
            <div className="w-full h-[58%] overflow-hidden rounded-xl relative bg-gray-50">
                <img 
                    src={image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60"} 
                    alt={name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60"; 
                    }}
                />
                
                {/* Veg / Non-Veg Badge */}
                <div className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 ${
                    isVeg 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                    {isVeg ? <LuLeafyGreen className="w-3.5 h-3.5 text-emerald-600" /> : <GiChickenOven className="w-3.5 h-3.5 text-rose-600" />}
                    <span className="capitalize">{type || 'veg'}</span>
                </div>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-1.5 mt-2">
                <h3 className="text-base font-bold text-gray-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                    {name}
                </h3>
                <div className="flex justify-between items-center">
                    <span className="text-lg font-extrabold text-emerald-600">Rs {price}</span>
                </div>
            </div>

            {/* Add Button */}
            <button
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-xl text-white font-bold text-sm shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                onClick={handleAddToCart}
            >
                <Plus className="w-4 h-4" />
                <span>Add to dish</span>
            </button>
        </div>
    );
};

export default Card;