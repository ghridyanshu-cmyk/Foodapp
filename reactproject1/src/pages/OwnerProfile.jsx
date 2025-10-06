import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import { Link, useNavigate } from 'react-router-dom';
// FIX: Added ChevronRight to the import list
import { User, Video, LogOut, Upload, X, Save, File, Clock, ShoppingBag, ChevronRight } from 'lucide-react'; 

import axios from 'axios';

// --- Owner/Admin Upload Modal Component ---

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
            // toast removed
            setLoading(false);
            return;
        }

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        
        // CRITICAL: Must match the Multer field name in videoRoutes.js (videoFile)
        data.append('videoFile', videoFile); 

        try {
            // Send authenticated request to secure route
            await axios.post('http://localhost:8000/api/v2/videos/share', data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // Content-Type is automatically set by FormData
                },
                onUploadProgress: (progressEvent) => {
                    // Simulate progress bar update
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                }
            });

            // toast removed
            // Reset state and close
            setFormData({ title: '', description: '' });
            setVideoFile(null);
            setProgress(0);
            onClose();

        } catch (error) {
            console.error("Video upload failed:", error);
            const msg = error.response?.data?.message || 'Upload failed. Check server logs.';
            // toast removed
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
                <button onClick={onClose} disabled={loading} className="absolute top-4 right-4 text-gray-500 hover:text-red-600">
                    <X className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2 flex items-center space-x-2">
                    <Upload className="w-5 h-5 text-emerald-600" />
                    <span>Share New Reel (Owner Only)</span>
                </h2>

                <form onSubmit={handleUpload} className="space-y-4">
                    {/* Title Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Video Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleTextChange} required
                               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" 
                               placeholder="e.g., New Dish Launch" />
                    </div>
                    
                    {/* Description Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                        <textarea name="description" value={formData.description} onChange={handleTextChange} rows="2"
                                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" />
                    </div>

                    {/* File Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Video File</label>
                        <input type="file" accept="video/*" onChange={handleFileChange} required
                               className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
                        
                        {videoFile && (
                            <p className="mt-2 text-xs text-gray-500 flex items-center space-x-1">
                                <File className="w-3 h-3" /> 
                                <span>{videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                            </p>
                        )}
                    </div>
                    
                    {/* Progress Bar */}
                    {loading && (
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                            <p className="text-xs text-gray-500 mt-1 text-center">{progress}% Uploaded</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button type="submit" disabled={loading}
                            className={`w-full flex justify-center items-center space-x-2 py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 transition'}`}>
                        <Clock className="w-4 h-4" />
                        <span>{loading ? 'Processing...' : 'Share Video Reel'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
};


// --- Main Owner Profile Component ---

// Helper: fallback avatar
const fallbackAvatar = "https://placehold.co/100x100/10B981/ffffff?text=O";

const OwnerProfile = () => {
    const { token, isLoggedIn, userData } = useContext(AuthContext); 
    const navigate = useNavigate();
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    // Fallbacks for name/email/avatar
    const name = userData?.name || "Admin Dashboard";
    const email = userData?.email || "admin@app.com";
    const role = userData?.role || "Owner / Content Creator";
    const avatarUrl = userData?.avatarUrl || fallbackAvatar;

    const isOwner = isLoggedIn;
    if (!isOwner) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <h1 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h1>
                <p className="text-gray-600 mb-6">You must log in as an Owner to access this panel.</p>
                <button onClick={() => navigate('/login')} className="px-6 py-2 bg-emerald-500 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-600 transition">Go to Login</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white p-4 flex flex-col items-center">
            {/* Header */}
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-10 mb-10 text-center border border-emerald-200 relative flex flex-col items-center">
                <img 
                    src={avatarUrl} 
                    alt="Owner Avatar" 
                    className="w-28 h-28 rounded-full object-cover mx-auto mb-4 border-4 border-emerald-400 shadow-lg"
                />
                <h1 className="text-4xl font-extrabold text-emerald-700 mb-2 tracking-tight">{name}</h1>
                <p className="text-lg text-gray-500 mb-2">{role}</p>
                <span className="text-gray-700 font-medium text-lg mb-2">{email}</span>
                <div className="absolute top-6 right-6 bg-emerald-100 px-4 py-1 rounded-full text-emerald-700 text-xs font-semibold shadow">Owner</div>
            </div>

            {/* Owner Actions */}
            <div className="space-y-6 w-full max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link 
                        to="/addproduct" 
                        className="flex items-center justify-between p-6 bg-white rounded-2xl shadow hover:shadow-lg border border-emerald-100 hover:border-emerald-400 transition group"
                    >
                        <div className="flex items-center space-x-4">
                            <Video className="w-7 h-7 text-emerald-500 group-hover:text-emerald-700 transition" />
                            <span className="text-lg font-semibold text-gray-700 group-hover:text-emerald-700 transition">Add Product</span>
                        </div>
                        <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-emerald-700 transition" />
                    </Link>
                    <Link 
                        to="/owner/products" 
                        className="flex items-center justify-between p-6 bg-white rounded-2xl shadow hover:shadow-lg border border-emerald-100 hover:border-emerald-400 transition group"
                    >
                        <div className="flex items-center space-x-4">
                            <ShoppingBag className="w-7 h-7 text-emerald-500 group-hover:text-emerald-700 transition" />
                            <span className="text-lg font-semibold text-gray-700 group-hover:text-emerald-700 transition">My Products</span>
                        </div>
                        <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-emerald-700 transition" />
                    </Link>
                    <button
                        onClick={() => setIsUploadOpen(true)}
                        className="flex items-center justify-between p-6 bg-white rounded-2xl shadow hover:shadow-lg border border-emerald-100 hover:border-emerald-400 transition group w-full"
                    >
                        <span className="flex items-center space-x-4">
                            <Upload className="w-7 h-7 text-emerald-500 group-hover:text-emerald-700 transition" />
                            <span className="text-lg font-semibold text-gray-700 group-hover:text-emerald-700 transition">Add Video</span>
                        </span>
                        <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-emerald-700 transition" />
                    </button>
                    <Link 
                        to="/owner/videos"
                        className="flex items-center justify-between p-6 bg-white rounded-2xl shadow hover:shadow-lg border border-emerald-100 hover:border-emerald-400 transition group"
                    >
                        <div className="flex items-center space-x-4">
                            <Video className="w-7 h-7 text-emerald-500 group-hover:text-emerald-700 transition" />
                            <span className="text-lg font-semibold text-gray-700 group-hover:text-emerald-700 transition">My Videos</span>
                        </div>
                        <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-emerald-700 transition" />
                    </Link>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="w-full flex items-center justify-center space-x-3 p-4 text-white rounded-2xl bg-green-500 hover:bg-green-600 shadow transition font-semibold text-lg"
                >
                    <LogOut className="w-6 h-6" />
                    <span>Logout</span>
                </button>
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