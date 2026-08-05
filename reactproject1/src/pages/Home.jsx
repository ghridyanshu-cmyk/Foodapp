import React, { useContext, useState, useEffect } from 'react';
import Nav from '../component/Nav';
import Categories from '../Category';
import Card from '../component/Card';
import Card2 from '../component/Card2';
import { food_items } from '../Food';
import { dataContext } from '../context/UserContext';
import { RxCross1 } from "react-icons/rx";
import { ArrowRight, ShoppingBag, Utensils } from "lucide-react";
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
    const { token, isLoggedIn } = useContext(AuthContext);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoadingProducts(true);
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/product/`);
                const apiProducts = res.data.products || [];
                
                // If API returns products from DB, use them; otherwise fallback to food_items catalog
                if (apiProducts.length > 0) {
                    setProducts(apiProducts);
                    setFilteredProducts(apiProducts);
                } else {
                    const normalizedFallback = food_items.map(item => ({
                        _id: String(item.id),
                        name: item.food_name || item.name,
                        price: item.price,
                        image: item.image,
                        type: item.type,
                        category: item.category
                    }));
                    setProducts(normalizedFallback);
                    setFilteredProducts(normalizedFallback);
                }
            } catch (err) {
                console.warn("Backend products fetch failed, using fallback food_items:", err);
                const normalizedFallback = food_items.map(item => ({
                    _id: String(item.id),
                    name: item.food_name || item.name,
                    price: item.price,
                    image: item.image,
                    type: item.type,
                    category: item.category
                }));
                setProducts(normalizedFallback);
                setFilteredProducts(normalizedFallback);
            } finally {
                setLoadingProducts(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchUserCart = async () => {
            if (!token || !isLoggedIn) {
                dispatch(setCartItems([]));
                localStorage.removeItem('cart');
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
                dispatch(setCartItems([]));
                localStorage.removeItem('cart');
            }
        };

        fetchUserCart();
    }, [token, isLoggedIn, dispatch]);

    useEffect(() => {
        let filtered = products;
        if (selectedCategory && selectedCategory !== 'All') {
            filtered = filtered.filter(item => 
                (item.category || '').toLowerCase() === selectedCategory.toLowerCase()
            );
        }
        if (input) {
            const search = input.toLowerCase();
            filtered = filtered.filter(item =>
                (item.name || '').toLowerCase().includes(search) ||
                (item.category || '').toLowerCase().includes(search)
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
        <div className="bg-slate-100 min-h-screen text-gray-800 flex flex-col font-sans relative">
            
            {/* Clean Light Navbar */}
            <Nav />

            {/* Category Filter Chips Bar */}
            <section className="px-4 sm:px-8 pt-6 pb-2 max-w-7xl mx-auto w-full">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                        <Utensils className="w-4 h-4 text-emerald-600" />
                        <span>Categories</span>
                    </h2>
                    {selectedCategory !== 'All' && (
                        <button 
                            onClick={() => setSelectedCategory('All')} 
                            className="text-xs text-emerald-600 hover:underline font-semibold"
                        >
                            View All
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-none">
                    {Categories.map(item => {
                        const isSelected = selectedCategory.toLowerCase() === item.name.toLowerCase();
                        return (
                            <button
                                key={item.name}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex-shrink-0 cursor-pointer shadow-sm ${
                                    isSelected
                                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
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

            {/* Food Grid */}
            <main className="px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full flex-grow">
                {loadingProducts ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                            <div key={n} className="w-[270px] sm:w-[290px] h-[380px] bg-white rounded-2xl p-4 border border-gray-200 animate-pulse flex flex-col justify-between">
                                <div className="w-full h-[58%] bg-gray-200 rounded-xl"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-9 bg-gray-200 rounded-xl"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                        {filteredProducts.map(item => (
                            <Card
                                key={item._id || item.id}
                                name={item.name}
                                image={item.image}
                                price={item.price}
                                id={item._id || item.id}
                                type={item.type}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
                        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <Utensils className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">No dishes match your selection</h3>
                        <p className="text-gray-500 text-xs">Try selecting another category or search term.</p>
                        <button
                            onClick={() => setSelectedCategory('All')}
                            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow hover:bg-emerald-700 transition"
                        >
                            Reset Category
                        </button>
                    </div>
                )}
            </main>

            {/* Slide-over Cart Drawer */}
            {showCart && (
                <div 
                    className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity"
                    onClick={() => setShowCart(false)}
                />
            )}

            <div className={`fixed top-0 right-0 z-50 w-full sm:w-[400px] h-full bg-white shadow-2xl p-5 transition-transform duration-300 ease-out flex flex-col justify-between ${showCart ? "translate-x-0" : "translate-x-full"}`}>
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-3.5">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-emerald-600" />
                        <h3 className="text-base font-bold text-gray-800">Order Cart</h3>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                            {items.length}
                        </span>
                    </div>
                    <button 
                        onClick={() => setShowCart(false)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                    >
                        <RxCross1 className="w-5 h-5" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto py-4 space-y-3">
                    {items.length > 0 ? (
                        items.map(item => (
                            <Card2 key={item.id} name={item.name} price={item.price} image={item.image} id={item.id} qty={item.qty} />
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-2 p-6">
                            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                <ShoppingBag className="w-7 h-7 text-emerald-600" />
                            </div>
                            <h4 className="text-sm font-bold text-gray-700">Your cart is empty</h4>
                            <p className="text-xs text-gray-400">Add delicious dishes from the menu to start your order.</p>
                        </div>
                    )}
                </div>

                {/* Checkout Section */}
                {items.length > 0 && (
                    <div className="border-t border-gray-200 pt-3.5 space-y-3">
                        <div className="space-y-1.5 text-xs text-gray-600">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-semibold text-gray-800">Rs {subTotal}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery Fee</span>
                                <span className="font-semibold text-gray-800">Rs {deliveryFee}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Taxes (5%)</span>
                                <span className="font-semibold text-gray-800">Rs {taxes}</span>
                            </div>
                            <div className="flex justify-between text-base font-extrabold text-gray-900 border-t border-gray-100 pt-2">
                                <span>Total</span>
                                <span className="text-emerald-600">Rs {total}</span>
                            </div>
                        </div>

                        <button 
                            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-xl text-white font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
                            onClick={() => {
                                setShowCart(false);
                                navigate("/payment");
                            }}
                        >
                            <span>Proceed to Payment</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Home;