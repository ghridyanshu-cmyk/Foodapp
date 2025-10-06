import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext'; // Path set to: ../context/AuthContext
import { Link, useNavigate } from 'react-router-dom';
import { User, Video, LogOut, Upload, X, Save, File, Clock, ShoppingBag, ChevronRight } from 'lucide-react'; 

import axios from 'axios';
import LikeButton from '../component/LikeButton'; // 🔑 Import LikeButton Component

// --- Video Player/Card Component (Functional Display) ---
const VideoPlayer = ({ video, index, activeIndex }) => {
    const videoRef = useRef(null);
    const isVisible = index === activeIndex;

    // Use effect to control play/pause based on visibility
    useEffect(() => {
        if (videoRef.current) {
            if (isVisible) {
                // When component is active/visible, play the video
                videoRef.current.play();
            } else {
                // When scrolling away, pause the video
                videoRef.current.pause();
                videoRef.current.currentTime = 0; // Reset video to start
            }
        }
    }, [isVisible]);

    return (
        <div className="w-full h-screen relative bg-black flex flex-col justify-center snap-start">
            {/* Video Element */}
            <video 
                ref={videoRef} // Attach ref
                src={video.videoUrl} 
                className="w-full h-full object-cover" 
                autoPlay={false} // Autoplay is controlled by useEffect now
                controls={false} // Controls hidden
                loop 
                muted // Muted is mandatory for autoplay
            />
            
            {/* Video Info Overlay */}
            <div className="absolute bottom-0 left-0 p-4 text-white w-full bg-gradient-to-t from-black/50 to-transparent">
                <h3 className="text-lg font-bold">{video.title}</h3>
                <p className="text-sm text-gray-300">{video.description}</p>
                <div className="flex items-center text-xs mt-1">
                    <User className="w-3 h-3 mr-1" />
                    <span>{video.owner?.name || 'Unknown Owner'}</span>
                </div>
            </div>

            {/* 🔑 Like Button and other icons (Sidebar) */}
            <div className="absolute inset-y-0 right-0 p-4 flex flex-col justify-end items-center space-y-6 z-20">
                <LikeButton
                    videoId={video._id}
                    initialIsLiked={video.isLikedByUser || false} 
                    initialLikesCount={video.likesCount || 0}
                />
                {/* Placeholder for comments/share icons */}
            </div>
        </div>
    );
};


// --- Owner/Admin Upload Modal Component ---

const VideoUploadModal = ({ isOpen, onClose, token }) => {
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [videoFile, setVideoFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const navigate = useNavigate(); // Initialize useNavigate inside modal

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
        setProgress(1); // Start progress immediately
        
        if (!token) { // CRUCIAL FRONTEND CHECK: Prevent unauthorized attempt
            // toast removed
            setLoading(false);
            return;
        }

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
                },
                onUploadProgress: (progressEvent) => {
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
            // 🔑 FIX: Handle 401/403 error for expired token or wrong role
            const statusCode = error.response?.status;
            if (statusCode === 401 || statusCode === 403) {
                // toast removed
                navigate('/login'); // Redirect to force re-login
            } else {
                const msg = error.response?.data?.message || 'Upload failed. Check server logs.';
                // toast removed
            }
            console.error("Video upload failed:", error);
            setProgress(0); // Reset progress on failure
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


// --- Main Video Reel Component ---

const VideoReel = () => {
    const scrollContainerRef = useRef(null); // Ref for the scroll container
    const [activeIndex, setActiveIndex] = useState(0); // State to track the currently visible video index

    const { token, isLoggedIn, userData } = useContext(AuthContext); 
    const [videos, setVideos] = useState([]);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [loadingFeed, setLoadingFeed] = useState(true);

    // Assume user data contains role for conditional rendering
    const isOwner = isLoggedIn && (userData?.role === 'owner' || userData?.role === 'admin');

    // 1. Fetch Video Feed on Load
    useEffect(() => {
        const fetchFeed = async () => {
            setLoadingFeed(true);
            try {
                // Fetch feed (public route, no token needed)
                const response = await axios.get('http://localhost:8000/api/v2/videos/feed');
                // Backend returns: { data: [{...}, {...}] }
                const fetchedVideos = response.data.data || response.data;
                setVideos(fetchedVideos);
            } catch (error) {
                // toast removed
                console.error("Feed fetch error:", error);
            } finally {
                setLoadingFeed(false);
            }
        };
        fetchFeed();
    }, []);
    
    // 2. Handle scroll event to determine which video is fully visible
    const handleScroll = () => {
        if (!scrollContainerRef.current || videos.length === 0) return;

        const container = scrollContainerRef.current;
        const scrollPosition = container.scrollTop;
        const viewportHeight = container.clientHeight;

        // Calculate which element is centered or fully visible
        const newIndex = Math.round(scrollPosition / viewportHeight);
        
        if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
        }
    };
    
    // 3. Handle upload success and reload
    const handleUploadSuccess = () => {
        setIsUploadOpen(false);
        // Refresh feed immediately after successful upload
        document.location.reload(); 
    };

    return (
        <div 
            ref={scrollContainerRef} // Attach ref here
            onScroll={handleScroll} // Attach scroll handler
            className="w-full h-screen bg-gray-900 overflow-y-scroll snap-y snap-mandatory relative"
        >
            
           
            {loadingFeed && (
                <div className="h-screen flex items-center justify-center text-white">Loading Video Feed...</div>
            )}
            
            {/* Video Feed Container */}
            <div className="w-full h-full">
                {videos.length > 0 ? (
                    videos.map((video, index) => (
                        <VideoPlayer 
                            key={video._id} 
                            video={video} 
                            index={index} 
                            activeIndex={activeIndex} // Pass active index
                        />
                    ))
                ) : (
                    !loadingFeed && <div className="h-screen flex items-center justify-center text-white text-lg">No reels available yet.</div>
                )}
            </div>

            {/* Owner Upload Button (Floating Action Button) */}
            {isOwner && (
                <button
                    onClick={() => setIsUploadOpen(true)}
                    className="fixed bottom-12 right-6 p-4 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition z-20"
                    title="Share New Reel"
                >
                    <Upload className="w-6 h-6" />
                </button>
            )}

            {/* Upload Modal */}
            <VideoUploadModal 
                isOpen={isUploadOpen} 
                onClose={handleUploadSuccess} 
                token={token}
            />
        </div>
    );
};

export default VideoReel;