import React, { useContext, useState, useEffect } from 'react';
import Nav from '../component/Nav';
import Categories from '../Category';
import Card from '../component/Card';
import Card2 from '../component/Card2';
import { dataContext } from '../context/UserContext';
import { RxCross1 } from "react-icons/rx";
import { ArrowRight, ShoppingBag, Utensils, Sparkles } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { AuthContext } from '../context/AuthContext';
import { setCartItems } from '../redux/cartSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const { cate, setCate, input, showCart, setShowCart } = useContext(dataContext);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loadingProducts, setLoadingProducts] = useState(true);
    const { token } = useContext(AuthContext);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoadingProducts(true);
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/product/`);
                const loaded = res.data.products || [];
                setProducts(loaded);
                setFilteredProducts(loaded);
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoadingProducts(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchUserCart = async () => {
            if (!token) {
                const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
                dispatch(setCartItems(localCart));
                return;
            }

            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/cart/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const normalizedCartItems = (res.data.cartItems || []).map(item => ({
                    id: item.productId._id,
                    name: item.productId.name,
                    price: item.productId.price,
                    image: item.productId.image,
                    type: item.productId.type,
                    qty: item.qty
                }));

                dispatch(setCartItems(normalizedCartItems));
                localStorage.setItem('cart', JSON.stringify(normalizedCartItems));
            } catch (err) {
                console.error("Error fetching cart:", err);
                if (err.response?.status === 401) {
                    dispatch(setCartItems([]));
                    localStorage.removeItem('cart');
                } else {
                    const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
                    dispatch(setCartItems(localCart));
                }
            }
        };

        fetchUserCart();
    }, [token, dispatch]);

    useEffect(() => {
        let filtered = products;
        if (selectedCategory && selectedCategory !== 'All') {
            filtered = filtered.filter(item => item.category?.toLowerCase() === selectedCategory.toLowerCase());
        }
        if (input) {
            const search = input.toLowerCase();
            filtered = filtered.filter(
                item =>
                    item.name.toLowerCase().includes(search) ||
                    (item.category && item.category.toLowerCase().includes(search))
            );
        }
        setFilteredProducts(filtered);
    }, [input, products, selectedCategory]);

    const handleCategoryClick = category => setSelectedCategory(category);

    const items = useSelector(state => state.cart);
    const subTotal = items.reduce((total, item) => total + (item.qty || 1) * item.price, 0);
    const deliveryFee = items.length > 0 ? 20 : 0;
    const taxes = Math.round(subTotal * 0.05);
    const total = Math.floor(subTotal + deliveryFee + taxes);

    return (
        <div className="bg-slate-950 min-h-screen text-slate-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-emerald-500 selection:text-white">
            
            {/* Top Glass Navigation */}
            <Nav />

            {/* Hero Banner */}
            <section className="relative px-4 sm:px-8 pt-8 pb-6 max-w-7xl mx-auto w-full">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/20 p-8 md:p-12 shadow-2xl shadow-emerald-950/40">
                    <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="relative z-10 max-w-2xl space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Gourmet Delivery Experience</span>
                        </div>
                        
                        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
                            Craving Something <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Extraordinary?</span>
                        </h1>
                        
                        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                            Discover handcrafted recipes, authentic flavors, and hot meals delivered right to your doorstep in minutes.
                        </p>
                    </div>
                </div>
            </section>

            {/* Category Selector Bar */}
            <section className="px-4 sm:px-8 py-4 max-w-7xl mx-auto w-full">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                        <Utensils className="w-5 h-5 text-emerald-400" />
                        <span>Explore Categories</span>
                    </h2>
                    {selectedCategory !== 'All' && (
                        <button 
                            onClick={() => setSelectedCategory('All')} 
                            className="text-xs text-emerald-400 hover:underline font-semibold"
                        >
                            Reset Filter
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-1 scrollbar-none">
                    {Categories.map(item => {
                        const isSelected = selectedCategory.toLowerCase() === item.name.toLowerCase();
                        return (
                            <button
                                key={item.name}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all flex-shrink-0 cursor-pointer ${
                                    isSelected
                                        ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/25 border border-emerald-400/30 scale-105'
                                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700'
                                }`}
                                onClick={() => handleCategoryClick(item.name)}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span>{item.name}</span>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Food Items Grid */}
            <main className="px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full flex-grow">
                {loadingProducts ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                            <div key={n} className="w-[280px] sm:w-[300px] h-[400px] bg-slate-900/60 rounded-3xl p-4 border border-slate-800 animate-pulse flex flex-col justify-between">
                                <div className="w-full h-[55%] bg-slate-800 rounded-2xl"></div>
                                <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                                <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                                <div className="h-10 bg-slate-800 rounded-xl"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                        {filteredProducts.map(item => (
                            <Card
                                key={item._id}
                                name={item.name}
                                image={item.image}
                                price={item.price}
                                id={item._id}
                                type={item.type}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                            <Utensils className="w-10 h-10 text-emerald-500/50" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-300">No dishes match your query</h3>
                        <p className="text-slate-500 text-sm max-w-md">Try searching for a different item or select another food category.</p>
                        <button
                            onClick={() => { setSelectedCategory('All'); setCate([]); }}
                            className="px-4 py-2 rounded-xl bg-slate-800 text-emerald-400 text-sm font-semibold border border-slate-700 hover:bg-slate-700 transition"
                        >
                            View All Dishes
                        </button>
                    </div>
                )}
            </main>

            {/* Slide-over Cart Drawer */}
            {/* Backdrop */}
            {showCart && (
                <div 
                    className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 transition-opacity"
                    onClick={() => setShowCart(false)}
                />
            )}

            {/* Drawer */}
            <div className={`fixed top-0 right-0 z-50 w-full sm:w-[420px] h-full bg-slate-900 border-l border-slate-800 shadow-2xl p-6 transition-transform duration-300 ease-out flex flex-col justify-between ${showCart ? "translate-x-0" : "translate-x-full"}`}>
                
                {/* Drawer Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-emerald-400" />
                        <h3 className="text-lg font-bold text-slate-100">Your Order Cart</h3>
                        <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                            {items.length}
                        </span>
                    </div>
                    <button 
                        onClick={() => setShowCart(false)}
                        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    >
                        <RxCross1 className="w-5 h-5" />
                    </button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto py-4 space-y-3 scrollbar-thin">
                    {items.length > 0 ? (
                        items.map(item => (
                            <Card2 key={item.id} name={item.name} price={item.price} image={item.image} id={item.id} qty={item.qty} />
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-3 p-6">
                            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                                <ShoppingBag className="w-8 h-8 text-emerald-500/40" />
                            </div>
                            <h4 className="text-base font-bold text-slate-300">Your cart is empty</h4>
                            <p className="text-xs text-slate-500">Browse our menu and add your favorite gourmet dishes.</p>
                        </div>
                    )}
                </div>

                {/* Drawer Footer & Checkout */}
                {items.length > 0 && (
                    <div className="border-t border-slate-800 pt-4 space-y-4">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-slate-400">
                                <span>Subtotal</span>
                                <span className="font-semibold text-slate-200">Rs {subTotal}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Delivery Charge</span>
                                <span className="font-semibold text-slate-200">Rs {deliveryFee}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Taxes (5%)</span>
                                <span className="font-semibold text-slate-200">Rs {taxes}</span>
                            </div>
                            <div className="flex justify-between text-base font-extrabold text-white border-t border-slate-800 pt-2">
                                <span>Total Amount</span>
                                <span className="text-emerald-400">Rs {total}</span>
                            </div>
                        </div>

                        <button 
                            className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:scale-98 rounded-2xl text-white font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer text-base"
                            onClick={() => {
                                setShowCart(false);
                                navigate("/payment");
                            }}
                        >
                            <span>Proceed to Payment</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Home;