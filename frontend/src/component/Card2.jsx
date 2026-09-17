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
        if (!token) return true;
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
        await updateBackendCart(qtyDiff);

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
        <div className="w-full bg-white rounded-xl p-3 flex items-center justify-between border border-gray-200 shadow-sm hover:shadow-md transition-all gap-3">
            
            {/* Left Thumbnail & Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                    <img 
                        src={image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60"} 
                        alt={name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60"; }}
                    />
                </div>
                
                <div className="flex flex-col min-w-0">
                    <h4 className="text-sm font-bold text-gray-800 line-clamp-1">
                        {name}
                    </h4>
                    <span className="text-xs font-semibold text-emerald-600 mt-0.5">
                        Rs {price}
                    </span>
                </div>
            </div>

            {/* Right Stepper & Delete */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
                <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200">
                    <button
                        className="w-6 h-6 rounded bg-white hover:bg-gray-200 active:scale-95 text-gray-700 flex items-center justify-center transition disabled:opacity-40"
                        onClick={() => handleQuantityChange('decrement')}
                        disabled={qty <= 1}
                    >
                        <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center text-xs font-bold text-gray-800">
                        {qty}
                    </span>
                    <button
                        className="w-6 h-6 rounded bg-white hover:bg-gray-200 active:scale-95 text-gray-700 flex items-center justify-center transition"
                        onClick={() => handleQuantityChange('increment')}
                    >
                        <Plus className="w-3 h-3" />
                    </button>
                </div>

                <button
                    className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition"
                    onClick={handleRemoveItem}
                    title="Remove"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Card2;
