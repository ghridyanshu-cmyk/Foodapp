import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

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
            setToken(userToken);
            navigate('/userprofilepage');

        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Check credentials.');
            console.error("Login Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-r from-gray-200 to-green-500">
            <div className="flex flex-1 items-center justify-center">
                <div className="bg-white/80 rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4">
                    <div className="flex justify-center mb-6">
                        <div className="w-12 h-12 bg-black rounded flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">A</span>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-6">User Login</h2>

                    {error && (
                        <div className="p-3 mb-4 text-sm bg-red-100 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-100"
                        />
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-100"
                            />
                            <span
                                className="absolute right-3 top-2 cursor-pointer text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </span>
                        </div>

                        <div className="flex justify-between text-sm mb-2">
                            <a href="#" className="text-gray-500 hover:underline">Forget password</a>
                            <Link to="/register" className="text-green-600 hover:underline">Sign up</Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 rounded-lg text-white font-semibold transition-all ${loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
