
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// axios.defaults.baseURL = "http://localhost:8000"; 
axios.defaults.withCredentials = true;


const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/register`, {
        name,
        email,
        password
      });
      console.log(response.data);
      navigate('/login');
      // Optionally show success message or redirect
    } catch (error) {
      console.error(error);
      // Optionally show error message
    }
  };
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  return (
    <div className="flex min-h-screen bg-gradient-to-r from-gray-200 to-green-500">
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-white/80 rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-black rounded flex items-center justify-center">
              <span className="text-white text-2xl font-bold">A</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-100"
            />
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
              <a href="/login" className="text-green-600 hover:underline">Login in</a>
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-all"
            >Sign up</button>
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

export default Register;
