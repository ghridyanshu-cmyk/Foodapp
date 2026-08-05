import React, { useContext, useEffect } from 'react';
import { MdFastfood } from "react-icons/md";
import { IoMdSearch, IoMdClose } from "react-icons/io";
import { HiShoppingBag } from "react-icons/hi2";
import { Film, User } from "lucide-react";
import { dataContext } from '../context/UserContext';
import { AuthContext } from '../context/AuthContext';
import { food_items } from '../Food';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

const Nav = () => {
    let { input, setInput, cate, setCate, setShowCart } = useContext(dataContext);
    const { isLoggedIn, role, userData } = useContext(AuthContext);
    const navigate = useNavigate();
    
    useEffect(() => {
        let newlist = food_items.filter((item) => item.food_name.includes(input) ||
            item.food_name.toLowerCase().includes(input))
        setCate(newlist)
    }, [input, setCate]); 
    
    let items = useSelector(state => state.cart);
    const cartCount = items.reduce((sum, i) => sum + (i.qty || 1), 0);
    
    const handleProfileClick = async() => {
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
        <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-900/80 border-b border-slate-800/80 px-4 md:px-8 py-3 transition-all duration-300">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                
                {/* Brand Logo & Title */}
                <div 
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => navigate('/')}
                >
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-[2px] shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                        <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                            <MdFastfood className="w-6 h-6 text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
                        </div>
                    </div>
                    <div className="hidden sm:flex flex-col">
                        <span className="font-extrabold text-xl bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent tracking-tight">
                            FoodieExpress
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase -mt-1">
                            Fresh & Fast
                        </span>
                    </div>
                </div>

                {/* Search Bar */}
                <form 
                    onSubmit={(e) => e.preventDefault()} 
                    className="flex-1 max-w-lg relative flex items-center"
                >
                    <div className="w-full relative flex items-center">
                        <IoMdSearch className="absolute left-4 w-5 h-5 text-emerald-400 pointer-events-none" />
                        <input 
                            className="w-full bg-slate-800/80 hover:bg-slate-800 focus:bg-slate-800/90 text-slate-100 text-sm md:text-base pl-11 pr-10 py-2.5 rounded-2xl border border-slate-700/60 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-500" 
                            onChange={(e) => setInput(e.target.value)} 
                            value={input} 
                            type="text" 
                            placeholder="Search gourmet dishes, pizza, burgers..." 
                        />
                        {input && (
                            <button 
                                type="button"
                                onClick={() => setInput("")}
                                className="absolute right-3 text-slate-400 hover:text-white"
                            >
                                <IoMdClose className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </form>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    
                    {/* Video Reels Quick Link */}
                    <Link
                        to="/vedioreel"
                        className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 text-slate-200 hover:text-emerald-400 text-sm font-medium transition-all"
                        title="Watch Food Reels"
                    >
                        <Film className="w-4 h-4 text-emerald-400" />
                        <span>Reels</span>
                    </Link>

                    {/* Profile Button */}
                    <button 
                        onClick={handleProfileClick}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 text-slate-200 hover:text-white text-sm font-medium transition-all group"
                    >
                        <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                            {userData?.avatarUrl ? (
                                <img src={userData.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <User className="w-4 h-4" />
                            )}
                        </div>
                        <span className="hidden lg:inline font-semibold">
                            {isLoggedIn ? (userData?.name?.split(' ')[0] || (role === 'owner' ? 'Owner' : 'Profile')) : 'Login'}
                        </span>
                    </button>

                    {/* Cart Trigger Button */}
                    <button 
                        className="relative p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer" 
                        onClick={() => setShowCart(true)}
                        title="Open Order Cart"
                    >
                        <HiShoppingBag className="w-6 h-6" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 animate-pulse">
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