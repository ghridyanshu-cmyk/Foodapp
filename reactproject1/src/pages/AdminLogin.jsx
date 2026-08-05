import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react'; 
import { AuthContext } from '../context/AuthContext';

const AdminLogin = () => {
    const { setToken } = useContext(AuthContext); 
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const cleanEmail = email.toLowerCase().trim();

        // Direct Master Admin Authentication & Instant Hard Redirect to /admin/dashboard
        if (cleanEmail === 'ghridyanshu@gmail.com') {
            const adminToken = "master_admin_token_" + Date.now();
            localStorage.setItem('authToken', adminToken);
            localStorage.setItem('userRole', 'admin');
            setToken(adminToken, 'admin');
            window.location.href = '/admin/dashboard';
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/owner/login`, {
                email: cleanEmail,
                password
            });
            
            const tokenPayload = response.data.data || response.data;
            const userToken = tokenPayload.accessToken;

            if (!userToken) {
                setMessage("Master Admin authentication failed.");
                setLoading(false);
                return;
            }
            
            localStorage.setItem('authToken', userToken);
            localStorage.setItem('userRole', 'admin');
            setToken(userToken, 'admin');
            window.location.href = '/admin/dashboard';

        } catch (error) {
            const serverMsg = error.response?.data?.message || error.response?.data?.error || "Master Admin login failed. Check email & password.";
            setMessage(serverMsg);
            console.error("Admin Login Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
                
                <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-400 p-[2px] shadow-lg shadow-amber-500/20">
                        <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                            <ShieldCheck className="w-7 h-7 text-amber-400" />
                        </div>
                    </div>
                    <div>
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-widest">
                            RESTRICTED ACCESS
                        </span>
                        <h1 className="text-2xl font-extrabold text-white tracking-tight mt-2">Master Admin Portal</h1>
                        <p className="text-xs text-slate-400 mt-0.5">Enter Super Admin credentials to access Master Control</p>
                    </div>
                </div>

                {message && (
                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-rose-400 flex-shrink-0" />
                        <span>{message}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Admin Email Address</label>
                        <div className="relative flex items-center">
                            <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                                type="email"
                                placeholder="ghridyanshu@gmail.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="w-full bg-slate-950/70 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Admin Password</label>
                        <div className="relative flex items-center">
                            <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className="w-full bg-slate-950/70 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-sm rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                            />
                            <button
                                type="button"
                                className="absolute right-3 text-slate-400 hover:text-slate-200"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-600 hover:to-emerald-600 active:scale-98 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm ${loading ? 'opacity-60 cursor-wait' : ''}`}
                    >
                        <span>{loading ? 'Verifying Admin Access...' : 'Master Admin Login'}</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                <div className="pt-2 border-t border-slate-800 flex flex-col items-center gap-2 text-xs">
                    <Link to="/owner/login" className="text-amber-400 font-bold hover:underline">
                        Shopkeeper Login →
                    </Link>
                    <Link to="/login" className="text-slate-500 hover:text-slate-300 transition">
                        Return to User Login
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default AdminLogin;
