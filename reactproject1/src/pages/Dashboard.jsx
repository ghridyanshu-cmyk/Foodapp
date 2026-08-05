import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, Utensils, Store } from 'lucide-react';

const DashboardSelector = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-lg space-y-8 relative z-10">
                
                {/* Header */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                        <Utensils className="w-3.5 h-3.5" />
                        <span>FoodieExpress Portal</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Select Access Level</h1>
                    <p className="text-sm text-slate-400">Choose your role to proceed to the designated portal.</p>
                </div>

                {/* Role Cards */}
                <div className="space-y-4">
                    
                    {/* User Dashboard Access Card */}
                    <div 
                        onClick={() => navigate('/login')}
                        className="group bg-slate-900/80 hover:bg-slate-900 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/50 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 transition-all cursor-pointer flex items-center justify-between"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">User Portal</h2>
                                <p className="text-xs text-slate-400">Browse gourmet menu, place orders, track delivery.</p>
                            </div>
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Owner Access Panel Card */}
                    <div 
                        onClick={() => navigate('/owner/login')}
                        className="group bg-slate-900/80 hover:bg-slate-900 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 hover:border-teal-500/50 shadow-xl hover:shadow-2xl hover:shadow-teal-500/10 transition-all cursor-pointer flex items-center justify-between"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Store className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-100 group-hover:text-teal-400 transition-colors">Food Owner Portal</h2>
                                <p className="text-xs text-slate-400">Manage video reels, add menu items & inventory.</p>
                            </div>
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-teal-500 group-hover:text-white transition-all">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default DashboardSelector;