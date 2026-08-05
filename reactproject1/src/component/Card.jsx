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
    const { token } = useContext(AuthContext);
    const { setShowCart } = useContext(dataContext);

    const handleAddToCart = async () => {
        if (!token) {
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
            console.error("Failed to add to cart:", error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    const isVeg = (type || '').toLowerCase() === 'veg';

    return (
        <div className="w-[280px] sm:w-[300px] h-[400px] bg-slate-800/60 backdrop-blur-md rounded-3xl p-4 flex flex-col justify-between border border-slate-700/50 hover:border-emerald-500/50 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1.5 transition-all duration-300 group">
            
            {/* Image Container with Zoom effect */}
            <div className="w-full h-[55%] overflow-hidden rounded-2xl relative bg-slate-900/50">
                <img 
                    src={image || "https://placehold.co/300x300/10B981/ffffff?text=Food"} 
                    alt={name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x300/10B981/ffffff?text=Food"; }}
                />
                
                {/* Dietary Badge Pill */}
                <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full backdrop-blur-md border flex items-center gap-1.5 text-xs font-bold ${
                    isVeg 
                        ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400' 
                        : 'bg-rose-950/80 border-rose-500/40 text-rose-400'
                }`}>
                    {isVeg ? <LuLeafyGreen className="w-3.5 h-3.5" /> : <GiChickenOven className="w-3.5 h-3.5" />}
                    <span className="capitalize">{type || 'veg'}</span>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col gap-2 mt-2">
                <h3 className="text-lg font-bold text-slate-100 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                    {name}
                </h3>
                <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Price</span>
                        <span className="text-xl font-extrabold text-emerald-400">Rs {price}</span>
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <button
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:scale-98 rounded-xl text-white font-semibold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                onClick={handleAddToCart}
            >
                <Plus className="w-4 h-4" />
                <span>Add to dish</span>
            </button>
        </div>
    );
};

export default Card;