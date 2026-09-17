import React, { useState, useContext } from 'react';
import { Star, Clock, Plus, Minus, X, Flame, ShieldAlert, Sparkles, ChefHat } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AddItem, IncreamentQty, DecreamentQty } from '../redux/cartSlice';
import axios from 'axios';
import { dataContext } from '../context/UserContext';

const Card = ({ name, image, id, price, type, rating = "4.6", prepTime = "20-25 mins" }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token, isLoggedIn } = useContext(AuthContext);
    const { setShowCart } = useContext(dataContext);

    const [showDetailsModal, setShowDetailsModal] = useState(false);

    // Check if item is already in Redux cart
    const cartItems = useSelector(state => state.cart || []);
    const existingCartItem = cartItems.find(item => item.id === id);
    const cartQty = existingCartItem ? existingCartItem.qty : 0;

    const isVeg = (type || '').toLowerCase() === 'veg';
    const originalPrice = Math.round(price * 1.25);

    const handleAddToCart = async (e) => {
        if (e) e.stopPropagation();
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
            const existingIndex = localCart.findIndex(item => item.id === id);
            if (existingIndex > -1) {
                localCart[existingIndex].qty += 1;
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

    const handleIncrement = (e) => {
        e.stopPropagation();
        dispatch(IncreamentQty(id));
    };

    const handleDecrement = (e) => {
        e.stopPropagation();
        dispatch(DecreamentQty(id));
    };

    return (
        <>
            <div className="w-full bg-white rounded-2xl p-3.5 flex flex-col justify-between border border-gray-200/80 shadow-xs hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 relative">
                
                {/* Image Box (Clicking opens details modal) */}
                <div 
                    onClick={() => setShowDetailsModal(true)}
                    className="w-full h-[190px] overflow-hidden rounded-xl relative bg-gray-50 cursor-pointer"
                    title="Click to view dish details"
                >
                    <img 
                        src={image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60"} 
                        alt={name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        onError={(e) => { 
                            e.target.onerror = null; 
                            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60"; 
                        }}
                    />
                    
                    {/* Standard Veg / Non-Veg Indicator Icon */}
                    <div className="absolute top-2.5 left-2.5 p-1 bg-white/90 backdrop-blur-xs rounded-md shadow-xs">
                        <div className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center ${
                            isVeg ? 'border-emerald-600' : 'border-rose-600'
                        }`}>
                            <div className={`w-2 h-2 rounded-full ${
                                isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                            }`}></div>
                        </div>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-2.5 right-2.5 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-white text-[11px] font-bold flex items-center gap-1 shadow-xs">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{rating}</span>
                    </div>

                    {/* Prep Time Pill */}
                    <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 bg-white/95 backdrop-blur-xs rounded-full text-gray-700 text-[10px] font-bold flex items-center gap-1 shadow-xs border border-gray-100">
                        <Clock className="w-3 h-3 text-emerald-600" />
                        <span>{prepTime}</span>
                    </div>
                </div>

                {/* Content Details */}
                <div 
                    onClick={() => setShowDetailsModal(true)}
                    className="space-y-1.5 mt-3 px-1 cursor-pointer"
                >
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                        {name}
                    </h3>
                    
                    <p className="text-[11px] text-gray-400 line-clamp-1">
                        Tap image to view recipe, nutrition & details.
                    </p>

                    {/* Price & Discount */}
                    <div className="flex items-center justify-between pt-1">
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-extrabold text-emerald-600">Rs {price}</span>
                            <span className="text-xs text-gray-400 line-through">Rs {originalPrice}</span>
                        </div>
                        <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                            20% OFF
                        </span>
                    </div>
                </div>

                {/* Action ADD Button / Stepper */}
                <div className="mt-3 pt-2 border-t border-gray-100">
                    {cartQty > 0 ? (
                        <div className="w-full py-1.5 px-3 bg-emerald-600 rounded-xl text-white font-bold text-xs shadow-md flex items-center justify-between">
                            <button 
                                onClick={handleDecrement}
                                className="p-1 hover:bg-emerald-700 rounded-md transition cursor-pointer"
                            >
                                <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-sm font-extrabold">{cartQty}</span>
                            <button 
                                onClick={handleIncrement}
                                className="p-1 hover:bg-emerald-700 rounded-md transition cursor-pointer"
                            >
                                <Plus className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleAddToCart}
                            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-xl text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>ADD TO CART</span>
                        </button>
                    )}
                </div>

            </div>

            {/* FOOD ITEM DETAILS MODAL */}
            {showDetailsModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative border border-gray-100 max-h-[90vh] flex flex-col">
                        
                        {/* Modal Image Header */}
                        <div className="w-full h-56 relative bg-gray-100 shrink-0">
                            <img
                                src={image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60"}
                                alt={name}
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            
                            {/* Category Tag */}
                            <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-full flex items-center gap-1.5">
                                <ChefHat className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="capitalize">{type || 'Gourmet Dish'}</span>
                            </div>
                        </div>

                        {/* Modal Details Body */}
                        <div className="p-5 flex-1 overflow-y-auto space-y-4">
                            
                            {/* Title & Rating Header */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-extrabold text-gray-900">{name}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center ${isVeg ? 'border-emerald-600' : 'border-rose-600'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`}></div>
                                        </div>
                                        <span className="text-xs font-bold text-gray-600 capitalize">{type} Dish</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 text-xs font-bold">
                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                    <span>{rating} (120+ ratings)</span>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-xs text-gray-600 leading-relaxed">
                                Freshly cooked gourmet dish prepared with authentic hand-ground spices, pure ghee, and fresh organic ingredients. Served hot & fresh in hygienic eco-friendly packaging.
                            </p>

                            {/* Nutritional Breakdown */}
                            <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-2">
                                <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                                    <Flame className="w-4 h-4 text-emerald-600" />
                                    <span>Nutritional Info (Per Serving)</span>
                                </div>
                                <div className="grid grid-cols-3 text-center text-xs divide-x divide-emerald-200/60 pt-1">
                                    <div>
                                        <div className="font-extrabold text-emerald-800">420 kcal</div>
                                        <div className="text-[10px] text-gray-500">Energy</div>
                                    </div>
                                    <div>
                                        <div className="font-extrabold text-emerald-800">24g</div>
                                        <div className="text-[10px] text-gray-500">Protein</div>
                                    </div>
                                    <div>
                                        <div className="font-extrabold text-emerald-800">32g</div>
                                        <div className="text-[10px] text-gray-500">Carbs</div>
                                    </div>
                                </div>
                            </div>

                            {/* Key Ingredients */}
                            <div className="space-y-1.5">
                                <h4 className="text-xs font-bold text-gray-800">Key Ingredients:</h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {['Fresh Farm Cottage Cheese / Meat', 'Whole Spices', 'Organic Herbs', 'Olive Oil', 'Secret House Sauce'].map((ing, idx) => (
                                        <span key={idx} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[10px] font-semibold rounded-lg">
                                            {ing}
                                        </span>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* Modal Footer Bar */}
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
                            <div>
                                <div className="text-[10px] text-gray-400">Total Price</div>
                                <div className="text-lg font-extrabold text-emerald-600">Rs {price}</div>
                            </div>

                            <button
                                onClick={(e) => {
                                    handleAddToCart(e);
                                    setShowDetailsModal(false);
                                }}
                                className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
                            >
                                <Plus className="w-4 h-4" />
                                <span>ADD TO CART</span>
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};

export default Card;