import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // 👈 Imported Link
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; 

const Login = () => {
    // 🔑 We only need setToken here, not isLoggedIn, since we navigate immediately
    const { setToken } = useContext(AuthContext); 
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    // 🚨 The useEffect hook for navigation is removed. Navigation will now happen
    // synchronously inside handleSubmit after the API call succeeds.
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Using environment variable VITE_API_URL directly in the POST request URL
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/login`, {
                email,
                password
            });
            
            // Determine where the tokens are (either directly in response.data or nested in response.data.data)
            const tokenPayload = response.data.data || response.data;
            const userToken = tokenPayload.accessToken || tokenPayload.token || tokenPayload.jwt; 
            
            if (userToken) {
                // 1. Save to localStorage (for persistence across browser restarts).
                localStorage.setItem('authToken', userToken); 
                
                // 2. Update the React Context state instantly.
                setToken(userToken); 
                
                console.log("Login successful. Token saved and Context updated. Navigating now.");
                
                // 3. Immediate and direct navigation after successful state update.
                navigate('/userprofilepage'); 
                
            } else {
                console.error("Login failed: Token missing in response or key name incorrect.", response.data);
            }
        } catch (error) {
            console.error(error);
            // Optionally show error message from backend (e.g., Invalid credentials)
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
                    <h2 className="text-2xl font-bold text-center mb-6">Login In</h2>
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
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-100"
                            />
                            <span
                                className="absolute right-3 top-2 cursor-pointer text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >{showPassword ? '🙈' : '👁️'}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                            <a href="#" className="text-gray-500 hover:underline">forget password</a>
                            
                            {/* 💡 FIX: Replaced <a> with Link and href with to */}
                            <Link to="/register" className="text-green-600 hover:underline">Sign up</Link>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-all"
                        >Login in</button>
                    </form>
                    <div className="flex justify-center gap-4 mt-6">
                        <button className="bg-white border rounded-full p-2 shadow hover:bg-gray-100"><span className="text-xl">G</span></button>
                        <button className="bg-white border rounded-full p-2 shadow hover:bg-gray-100"><span className="text-xl">F</span></button>
                    </div>
                </div>
            </div>
            <div className="hidden md:flex flex-1 items-center justify-center">
                <svg width="300" height="200" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="50" y="80" width="180" height="60" rx="10" fill="#222" />
                    <rect x="70" y="60" width="140" height="40" rx="8" fill="#222" />
                    <circle cx="70" cy="150" r="15" fill="#222" />
                    <circle cx="210" cy="150" r="15" fill="#222" />
                </svg>
            </div>
        </div>
    );
};

export default Login