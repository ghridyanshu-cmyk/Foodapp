import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
    User, Video, LogOut, Upload, X, Save, File, Clock, ShoppingBag, 
    ChevronRight, Store, Plus, Package, DollarSign, Eye, CheckCircle2, 
    Truck, ChefHat, ArrowLeft, Trash2, Edit
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setCartItems } from '../redux/cartSlice';
import axios from 'axios';

// --- Shopkeeper Upload Video Modal ---
const VideoUploadModal = ({ isOpen, onClose, token }) => {
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [videoFile, setVideoFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleTextChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setVideoFile(file);
        setProgress(0);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!videoFile) {
            setLoading(false);
            return;
        }

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('videoFile', videoFile);

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/videos/share`, data, {
                headers: { 'Authorization': `Bearer ${token}` },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                }
            });

            setFormData({ title: '', description: '' });
            setVideoFile(null);
            setProgress(0);
            alert("Video Reel uploaded successfully!");
            onClose();

        } catch (error) {
            console.error("Video upload failed:", error);
            alert("Video upload failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 relative border border-slate-100 space-y-4">
                <button onClick={onClose} disabled={loading} className="absolute top-4 right-4 text-slate-400 hover:text-rose-600">
                    <X className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-bold text-slate-900 border-b pb-3 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-emerald-600" />
                    <span>Upload Shop Video Reel</span>
                </h2>

                <form onSubmit={handleUpload} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Reel Title</label>
                        <input 
                            type="text" 
                            name="title" 
                            value={formData.title} 
                            onChange={handleTextChange} 
                            required
                            className="w-full bg-slate-50 border border-slate-300 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500" 
                            placeholder="e.g., Sizzling Butter Chicken Preparation" 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Description (Optional)</label>
                        <textarea 
                            name="description" 
                            value={formData.description} 
                            onChange={handleTextChange} 
                            rows="2"
                            className="w-full bg-slate-50 border border-slate-300 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500" 
                            placeholder="Short description..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Select Video File</label>
                        <input 
                            type="file" 
                            accept="video/*" 
                            onChange={handleFileChange} 
                            required
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 text-xs text-slate-500" 
                        />
                        
                        {videoFile && (
                            <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                                <File className="w-3.5 h-3.5 text-emerald-600" /> 
                                <span>{videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                            </p>
                        )}
                    </div>
                    
                    {loading && (
                        <div className="w-full bg-slate-200 rounded-full h-2">
                            <div className="bg-emerald-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                            <p className="text-[11px] text-slate-500 mt-1 text-center font-bold">{progress}% Uploaded</p>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded-xl text-white font-bold text-xs bg-emerald-600 hover:bg-emerald-700 shadow-md flex items-center justify-center gap-2 transition cursor-pointer ${loading ? 'opacity-50 cursor-wait' : ''}`}
                    >
                        <Clock className="w-4 h-4" />
                        <span>{loading ? 'Processing Upload...' : 'Publish Video Reel'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- Main Shopkeeper Profile Component ---
const OwnerProfile = () => {
    const { token, isLoggedIn, userData, logout } = useContext(AuthContext); 
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [shopOrders, setShopOrders] = useState([
        {
            id: "ORD-98214",
            customer: "Harsh Vardhan",
            phone: "+91 98765 43210",
            address: "Flat 402, Green Valley, Noida",
            total: 420,
            status: "In Transit",
            items: "1x Butter Chicken, 2x Naan"
        },
        {
            id: "ORD-76120",
            customer: "Amit Kumar",
            phone: "+91 98112 09876",
            address: "Sector 18, Commercial Hub",
            total: 350,
            status: "Delivered",
            items: "1x Paneer Tikka, 1x Lassi"
        }
    ]);

    const handleLogout = () => {
        dispatch(setCartItems([]));
        localStorage.removeItem('cart');
        logout();
        navigate('/owner/login');
    };

    const handleUpdateOrderStatus = (orderId, newStatus) => {
        setShopOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        alert(`Order ${orderId} status updated to ${newStatus}`);
    };

    const shopkeeperName = userData?.name || "Gourmet Kitchen Shopkeeper";
    const shopkeeperEmail = userData?.email || "shopkeeper@foodie.com";
    const shopkeeperRole = "Store Owner & Manager";
    const avatarUrl = userData?.avatarUrl || "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&auto=format&fit=crop&q=80";

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
                <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-xl space-y-4 border border-slate-200">
                    <Store className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h1 className="text-xl font-bold text-slate-800">Shopkeeper Access Denied</h1>
                    <p className="text-xs text-slate-500">You must log in with a Shopkeeper account to access this store portal.</p>
                    <button 
                        onClick={() => navigate('/owner/login')} 
                        className="w-full py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow hover:bg-emerald-700 transition cursor-pointer"
                    >
                        Go to Shopkeeper Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 font-sans text-slate-800 pb-12">
            
            {/* Shopkeeper Banner Header */}
            <div className="bg-slate-900 text-white pt-8 pb-16 px-4 relative overflow-hidden">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    
                    <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
                        <img 
                            src={avatarUrl} 
                            alt="Shopkeeper Avatar" 
                            className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500 shadow-xl"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&auto=format&fit=crop&q=80"; }}
                        />
                        <div className="space-y-1">
                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <h1 className="text-2xl font-extrabold">{shopkeeperName}</h1>
                                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                                    Shopkeeper
                                </span>
                            </div>
                            <div className="text-xs text-slate-400 font-medium">{shopkeeperRole} • {shopkeeperEmail}</div>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Logout Portal</span>
                    </button>
                </div>
            </div>

            {/* Shopkeeper Analytics Overlay */}
            <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-20">
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 grid grid-cols-4 divide-x divide-slate-100 text-center">
                    <div>
                        <div className="text-xl font-extrabold text-slate-800">11</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Products</div>
                    </div>
                    <div>
                        <div className="text-xl font-extrabold text-slate-800">4</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Reels</div>
                    </div>
                    <div>
                        <div className="text-xl font-extrabold text-slate-800">14</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Orders</div>
                    </div>
                    <div>
                        <div className="text-xl font-extrabold text-emerald-600">Rs 12,450</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Revenue</div>
                    </div>
                </div>
            </div>

            {/* Main Shopkeeper Actions */}
            <div className="max-w-4xl mx-auto px-4 mt-6 space-y-6">
                
                {/* 4 Primary Control Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <Link 
                        to="/addproduct" 
                        className="p-5 bg-white rounded-2xl shadow-xs hover:shadow-md border border-slate-200 hover:border-emerald-500 transition group flex flex-col justify-between"
                    >
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                            <Plus className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition">Add Product</div>
                            <div className="text-[10px] text-slate-400">Add new dish to store menu</div>
                        </div>
                    </Link>

                    <Link 
                        to="/owner/products" 
                        className="p-5 bg-white rounded-2xl shadow-xs hover:shadow-md border border-slate-200 hover:border-emerald-500 transition group flex flex-col justify-between"
                    >
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                            <Package className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition">My Products</div>
                            <div className="text-[10px] text-slate-400">Manage menu inventory & pricing</div>
                        </div>
                    </Link>

                    <button
                        onClick={() => setIsUploadOpen(true)}
                        className="p-5 bg-white rounded-2xl shadow-xs hover:shadow-md border border-slate-200 hover:border-emerald-500 transition group flex flex-col justify-between text-left cursor-pointer"
                    >
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                            <Upload className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition">Upload Video</div>
                            <div className="text-[10px] text-slate-400">Share food video reel</div>
                        </div>
                    </button>

                    <Link 
                        to="/owner/videos"
                        className="p-5 bg-white rounded-2xl shadow-xs hover:shadow-md border border-slate-200 hover:border-emerald-500 transition group flex flex-col justify-between"
                    >
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                            <Video className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition">My Video Reels</div>
                            <div className="text-[10px] text-slate-400">Manage published video reels</div>
                        </div>
                    </Link>
                </div>

                {/* Shopkeeper Customer Orders Dashboard */}
                <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-emerald-600" />
                            <h3 className="text-sm font-bold text-slate-900">Incoming Customer Orders</h3>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            Live Management
                        </span>
                    </div>

                    <div className="space-y-3">
                        {shopOrders.map(order => (
                            <div key={order.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-extrabold text-slate-900">{order.id}</span>
                                        <span className="text-slate-400">• {order.customer} ({order.phone})</span>
                                    </div>
                                    <div className="text-slate-600 font-semibold">{order.items}</div>
                                    <div className="text-[10px] text-slate-400">{order.address}</div>
                                </div>

                                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                                    <div className="text-right">
                                        <div className="text-xs font-extrabold text-emerald-600">Rs {order.total}</div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                            order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    {order.status !== 'Delivered' && (
                                        <button
                                            onClick={() => handleUpdateOrderStatus(order.id, 'Delivered')}
                                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition cursor-pointer"
                                        >
                                            Mark Delivered
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Video Upload Modal */}
            <VideoUploadModal 
                isOpen={isUploadOpen} 
                onClose={() => setIsUploadOpen(false)} 
                token={token}
            />
        </div>
    );
};

export default OwnerProfile;