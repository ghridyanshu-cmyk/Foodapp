import React, { useContext, useEffect } from 'react';
import { MdFastfood } from "react-icons/md";
import { IoMdSearch, IoMdClose } from "react-icons/io";
import { HiShoppingBag } from "react-icons/hi2";
import { User, Film } from "lucide-react";
import { dataContext } from '../context/UserContext';
import { AuthContext } from '../context/AuthContext';
import { food_items } from '../Food';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

const Nav = () => {
    let { input, setInput, setCate, setShowCart } = useContext(dataContext);
    const { isLoggedIn, role, userData } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        let newlist = food_items.filter((item) => 
            item.food_name.toLowerCase().includes(input.toLowerCase())
        );
        setCate(newlist);
    }, [input, setCate]);

    let items = useSelector(state => state.cart);
    const cartCount = items.reduce((sum, i) => sum + (i.qty || 1), 0);

    const handleProfileClick = async () => {
        if (isLoggedIn) {
            if (role === 'owner') {
                await navigate('/owner/profile');
            } else {
                await navigate('/userprofilepage');
            }
        } else {
            await navigate('/dashboard');
        }
    };

    return (
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm px-4 md:px-8 py-3.5 transition-all">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                
                {/* Brand Logo */}
                <div 
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => navigate('/')}
                >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                        <MdFastfood className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-extrabold text-xl text-gray-800 tracking-tight hidden sm:inline">
                        Foodie<span className="text-emerald-600">Express</span>
                    </span>
                </div>

                {/* Search Bar */}
                <form 
                    onSubmit={(e) => e.preventDefault()} 
                    className="flex-1 max-w-md relative flex items-center"
                >
                    <div className="w-full relative flex items-center">
                        <IoMdSearch className="absolute left-3.5 w-5 h-5 text-emerald-600 pointer-events-none" />
                        <input 
                            className="w-full bg-gray-100 focus:bg-white text-gray-800 text-sm pl-10 pr-9 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-gray-400" 
                            onChange={(e) => setInput(e.target.value)} 
                            value={input} 
                            type="text" 
                            placeholder="Search dishes or categories..." 
                        />
                        {input && (
                            <button 
                                type="button"
                                onClick={() => setInput("")}
                                className="absolute right-3 text-gray-400 hover:text-gray-600"
                            >
                                <IoMdClose className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </form>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-3">
                    
                    {/* Video Reels Link */}
                    <Link
                        to="/vedioreel"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-bold transition border border-emerald-200 shadow-xs"
                        title="Watch Food Videos & Reels"
                    >
                        <Film className="w-4.5 h-4.5 text-emerald-600 animate-pulse" />
                        <span className="hidden sm:inline">Reels</span>
                    </Link>

                    {/* Profile Button */}
                    <button 
                        onClick={handleProfileClick}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition"
                    >
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                            {userData?.avatarUrl ? (
                                <img src={userData.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <User className="w-4 h-4" />
                            )}
                        </div>
                        <span className="hidden lg:inline">
                            {isLoggedIn ? (userData?.name?.split(' ')[0] || (role === 'owner' ? 'Owner' : 'Profile')) : 'Login'}
                        </span>
                    </button>

                    {/* Cart Trigger */}
                    <button 
                        className="relative p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer" 
                        onClick={() => setShowCart(true)}
                        title="Cart"
                    >
                        <HiShoppingBag className="w-6 h-6" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>

            </div>
        </header>
    );
};

export default Nav;