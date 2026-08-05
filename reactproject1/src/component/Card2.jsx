import React, { useContext } from 'react';
import { Trash2, Plus, Minus } from "lucide-react";
import { useDispatch } from 'react-redux';
import { DecreamentQty, IncreamentQty, RemoveItem } from '../redux/cartSlice';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Card2 = ({ name, id, price, image, qty }) => {
    const dispatch = useDispatch();
    const { token } = useContext(AuthContext);

    const updateBackendCart = async (qtyDiff) => {
        if (!token) return true; // Local update if guest
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/cart/add`, {
                productId: id,
                qty: qtyDiff,
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return true;
        } catch (err) {
            console.error("Backend update failed:", err);
            return false;
        }
    };

    const handleQuantityChange = async (actionType) => {
        let newQty = qty;
        if (actionType === 'increment') newQty += 1;
        else if (actionType === 'decrement' && qty > 1) newQty -= 1;
        else return;

        const qtyDiff = newQty - qty;
        const success = await updateBackendCart(qtyDiff);
        if (!success) return;

        if (actionType === 'increment') dispatch(IncreamentQty(id));
        else if (actionType === 'decrement') dispatch(DecreamentQty(id));

        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const index = localCart.findIndex(item => item.id === id);
        if (index !== -1) localCart[index].qty = newQty;
        localStorage.setItem('cart', JSON.stringify(localCart));
    };

    const handleRemoveItem = async () => {
        if (token) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/cart/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } catch (err) {
                console.error("Remove failed on server:", err);
            }
        }

        dispatch(RemoveItem(id));

        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const updatedCart = localCart.filter(item => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    return (
        <div className="w-full bg-slate-800/80 backdrop-blur-md rounded-2xl p-3.5 flex items-center justify-between border border-slate-700/60 shadow-lg hover:border-slate-600 transition-all gap-3">
            
            {/* Left Section: Thumbnail & Title */}
            <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 border border-slate-700/50">
                    <img 
                        src={image || "https://placehold.co/100x100/10B981/ffffff?text=Food"} 
                        alt={name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/10B981/ffffff?text=Food"; }}
                    />
                </div>
                
                <div className="flex flex-col min-w-0">
                    <h4 className="text-sm font-bold text-slate-100 line-clamp-1 truncate">
                        {name}
                    </h4>
                    <span className="text-xs font-semibold text-emerald-400 mt-0.5">
                        Rs {price}
                    </span>
                </div>
            </div>

            {/* Right Section: Stepper & Remove */}
            <div className="flex items-center gap-3 flex-shrink-0">
                {/* Stepper Control */}
                <div className="flex items-center bg-slate-900/90 rounded-xl p-1 border border-slate-700/70">
                    <button
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 flex items-center justify-center transition-all disabled:opacity-40"
                        onClick={() => handleQuantityChange('decrement')}
                        disabled={qty <= 1}
                    >
                        <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-extrabold text-emerald-400">
                        {qty}
                    </span>
                    <button
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 flex items-center justify-center transition-all"
                        onClick={() => handleQuantityChange('increment')}
                    >
                        <Plus className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Trash Button */}
                <button
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    onClick={handleRemoveItem}
                    title="Remove item"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Card2;
