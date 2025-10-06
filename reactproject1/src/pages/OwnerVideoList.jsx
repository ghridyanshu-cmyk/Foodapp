import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Path fixed to: ../../context/AuthContext
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Package, X, CheckCircle, AlertTriangle, Video, List, Plus, PlayCircle, Home } from 'lucide-react'; // Added Home icon

import axios from 'axios';

const OwnerVideoList = () => {
    const { token, isLoggedIn, userData } = useContext(AuthContext);
    const navigate = useNavigate();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get Owner Info safely
    const ownerName = userData?.name || 'Owner';

    // --- Helper to fetch data ---
    const fetchVideos = async (userToken) => {
        if (!userToken) {
            setError("Authentication required.");
            setLoading(false);
            return;
        }

        try {
            // Fetch videos added by the current owner
            const response = await axios.get('http://localhost:8000/api/v2/videos/ownervideos', {
                headers: { 'Authorization': `Bearer ${userToken}` }
            });
            // Handle ApiResponse structure (response.data.data)
            const fetchedVideos = response.data.data || response.data.videos || [];
            setVideos(Array.isArray(fetchedVideos) ? fetchedVideos : []);
            setError(null);
        } catch (err) {
            console.error("Fetch Error:", err);
            setError(err.response?.data?.message || "Failed to load videos.");
            // If 401, redirect to owner login
            if (err.response?.status === 401 || err.response?.status === 403) {
                navigate('/owner/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos(token);
    }, [token, navigate]);

    // --- Delete Handler ---
    const handleDelete = async (videoId) => {
        if (!window.confirm("Are you sure you want to delete this video? This action is irreversible.")) {
            return;
        }

        try {
            // Securely send DELETE request to the protected route
            await axios.delete(`http://localhost:8000/api/v2/videos/delete/${videoId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            // toast removed
            // Update local state by filtering out the deleted item
            setVideos(prevVideos => prevVideos.filter(v => v._id !== videoId));

        } catch (err) {
            // toast removed
            console.error("Delete Error:", err);
        }
    };

    if (!isLoggedIn || error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
                <h1 className="text-xl font-bold text-gray-800">{error || "Please log in to manage videos."}</h1>
                <Link to="/owner/login" className="mt-4 px-6 py-2 bg-emerald-500 text-white rounded-lg">Go to Login</Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg font-semibold text-emerald-500">Loading Video List...</div>
            </div>
        );
    }

    // --- Render ---
    return (
        <div className="w-full h-screen bg-gray-900 flex flex-col relative">
            
            {/* FIXED HEADER (Matching Video Reel Style) */}
            <header className="fixed top-0 left-0 w-full z-10 bg-emerald-700 text-white p-4 flex justify-between items-center shadow-lg">
                <h1 className="text-xl font-bold flex items-center space-x-2">
                    <Video className="w-5 h-5" />
                    <span>My Video Reels</span>
                </h1>
                <p className="text-sm text-emerald-100">{ownerName}</p>
            </header>

            {/* MAIN CONTENT AREA (Scrollable) */}
            <div className="flex-grow pt-16 p-4 overflow-y-auto bg-gray-100">
                
                <div className="max-w-4xl mx-auto space-y-4">
                    
                    {/* Empty State / Success */}
                    {videos.length === 0 && (
                        <div className="bg-white p-10 rounded-xl shadow-md text-center mt-12">
                            <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-700">No Reels Uploaded Yet</h2>
                            <p className="text-gray-500">Share your first video using the button below.</p>
                        </div>
                    )}
                    
                    {/* Video List Display */}
                    {videos.map((video) => (
                        <div key={video._id} className="bg-white rounded-xl shadow-lg flex items-center justify-between p-3 sm:p-4">
                            
                            {/* Video Info and Thumbnail (Simulated) */}
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0 h-16 w-16 bg-gray-200 rounded-lg overflow-hidden relative">
                                    {/* Placeholder for video thumbnail/player */}
                                    <PlayCircle className="w-8 h-8 text-emerald-600 absolute inset-0 m-auto" />
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-base font-medium text-gray-900 line-clamp-1">{video.title}</div>
                                    <div className="text-xs text-gray-500">Views: {video.views || 0} | Likes: {video.likesCount || 0}</div>
                                </div>
                            </div>
                            
                            {/* Actions */}
                            <button
                                onClick={() => handleDelete(video._id)}
                                className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
                                
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* FLOATING ACTION BUTTON (Add New) - Assuming this links to the upload modal */}
            <Link
                to="/owner/profile" // Link back to the dashboard where the modal is triggered
                className="fixed bottom-6 right-6 p-4 bg-emerald-600 text-white rounded-full shadow-2xl hover:bg-emerald-700 transition z-20 flex items-center space-x-2"
                title="Back to Dashboard"
            >
                <Home className="w-6 h-6" />
            </Link>
        </div>
    );
};

export default OwnerVideoList;