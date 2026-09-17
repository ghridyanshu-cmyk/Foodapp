import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Utensils, ShieldCheck } from 'lucide-react';

axios.defaults.withCredentials = true;

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
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
            await axios.post(`${import.meta.env.VITE_API_URL}/user/register`, {
                name,
                email,
                password
            });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please check details.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
                
                <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-[2px] shadow-lg shadow-emerald-500/20">
                        <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                            <Utensils className="w-7 h-7 text-emerald-400" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-extrabold text-white tracking-tight">Create Account</h1>
                    <p className="text-xs text-slate-400">Join FoodieExpress for fast gourmet delivery</p>
                </div>

                {error && (
                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-rose-400 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Full Name</label>
                        <div className="relative flex items-center">
                            <User className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                className="w-full bg-slate-950/70 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                            />
                        </div>
                    </div>

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

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:scale-98 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm ${loading ? 'opacity-60 cursor-wait' : ''}`}
                    >
                        <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                <div className="pt-2 border-t border-slate-800 flex flex-col items-center gap-2 text-xs">
                    <p className="text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-emerald-400 font-bold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Register;
