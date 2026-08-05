import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Utensils, ShieldCheck } from 'lucide-react';

const Login = () => {
    const { setToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/login`, {
                email,
                password
            });

            const tokenPayload = response.data.data || response.data;
            const userToken = tokenPayload.accessToken;

            if (!userToken) {
                setError("Login failed: Token missing in response.");
                setLoading(false);
                return;
            }

            localStorage.setItem('authToken', userToken);
            localStorage.setItem('userRole', 'user');
            setToken(userToken, 'user');
            navigate('/userprofilepage');

        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
            console.error("Login Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
                
                {/* Brand Header */}
                <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-[2px] shadow-lg shadow-emerald-500/20">
                        <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                            <Utensils className="w-7 h-7 text-emerald-400" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-extrabold text-white tracking-tight">Welcome Back</h1>
                    <p className="text-xs text-slate-400">Log in to order fresh gourmet meals</p>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-rose-400 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Input */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Email Address</label>
                        <div className="relative flex items-center">
                            <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="w-full bg-slate-950/70 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Password</label>
                        <div className="relative flex items-center">
                            <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className="w-full bg-slate-950/70 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-sm rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
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

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:scale-98 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm ${loading ? 'opacity-60 cursor-wait' : ''}`}
                    >
                        <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                {/* Footer Links */}
                <div className="pt-2 border-t border-slate-800 flex flex-col items-center gap-2 text-xs">
                    <p className="text-slate-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-emerald-400 font-bold hover:underline">
                            Sign Up
                        </Link>
                    </p>
                    <Link to="/owner/login" className="text-slate-500 hover:text-slate-300 transition">
                        Are you a Food Owner? Switch to Owner Login →
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Login;
