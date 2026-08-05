import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Store, ShieldCheck } from 'lucide-react';

const OwnerRegister = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/owner/register`, {
                name,
                email,
                password,
                role: 'owner'
            });

            setMessage("Registration successful! Redirecting to login...");
            setTimeout(() => {
                navigate('/owner/login');
            }, 1000);

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Registration failed. Check server status.";
            setMessage(errorMessage);
            console.error("Registration Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
                
                <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-400 p-[2px] shadow-lg shadow-teal-500/20">
                        <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                            <Store className="w-7 h-7 text-teal-400" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-extrabold text-white tracking-tight">Owner Registration</h1>
                    <p className="text-xs text-slate-400">Create your Food Owner Account</p>
                </div>

                {message && (
                    <div className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
                        message.includes('successful')
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                    }`}>
                        <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                        <span>{message}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Restaurant / Owner Name</label>
                        <div className="relative flex items-center">
                            <User className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Gourmet Kitchen"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                className="w-full bg-slate-950/70 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Email Address</label>
                        <div className="relative flex items-center">
                            <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                                type="email"
                                placeholder="owner@restaurant.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="w-full bg-slate-950/70 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Password</label>
                        <div className="relative flex items-center">
                            <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className="w-full bg-slate-950/70 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-sm rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
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
                        className={`w-full py-3.5 px-4 bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 active:scale-98 text-white font-bold rounded-xl shadow-lg shadow-teal-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm ${loading ? 'opacity-60 cursor-wait' : ''}`}
                    >
                        <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                <div className="pt-2 border-t border-slate-800 flex flex-col items-center gap-2 text-xs">
                    <Link to="/owner/login" className="text-teal-400 font-bold hover:underline">
                        Already registered? Log in here →
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default OwnerRegister;
