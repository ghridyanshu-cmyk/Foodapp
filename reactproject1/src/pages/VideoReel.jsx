import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { User, Upload, X, File, Clock, ArrowLeft, Volume2, VolumeX, Play, Pause, Share2, Eye, Sparkles } from 'lucide-react';
import axios from 'axios';
import LikeButton from '../component/LikeButton';

const VideoPlayer = ({ video, index, activeIndex }) => {
    const videoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showTapIndicator, setShowTapIndicator] = useState(false);
    const isVisible = index === activeIndex;

    useEffect(() => {
        if (videoRef.current) {
            if (isVisible) {
                videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            } else {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
                setIsPlaying(false);
            }
        }
    }, [isVisible]);

    const handleTap = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
            }
            setShowTapIndicator(true);
            setTimeout(() => setShowTapIndicator(false), 600);
        }
    };

    const toggleMute = (e) => {
        e.stopPropagation();
        if (videoRef.current) {
            const nextMute = !isMuted;
            setIsMuted(nextMute);
            videoRef.current.muted = nextMute;
        }
    };

    const handleShare = (e) => {
        e.stopPropagation();
        if (navigator.share) {
            navigator.share({
                title: video.title,
                text: video.description,
                url: window.location.href,
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Reel link copied to clipboard!");
        }
    };

    return (
        <div
            className="w-full h-full relative bg-slate-950 flex flex-col justify-center snap-start overflow-hidden select-none"
            onClick={handleTap}
        >
            {/* Video Element */}
            <video
                ref={videoRef}
                src={video.videoUrl}
                className="w-full h-full object-cover"
                autoPlay={false}
                controls={false}
                loop
                playsInline
                muted={isMuted}
            />

            {/* Tap Play/Pause Indicator Animation */}
            {showTapIndicator && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                    <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white animate-ping">
                        {isPlaying ? <Play className="w-8 h-8 fill-white ml-1" /> : <Pause className="w-8 h-8 fill-white" />}
                    </div>
                </div>
            )}

            {/* Top Bar Overlay */}
            <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 via-black/30 to-transparent flex items-center justify-between z-20">
                <Link
                    to="/"
                    className="p-2 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10 text-white hover:bg-slate-800 transition"
                    onClick={(e) => e.stopPropagation()}
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10 text-xs font-bold text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Foodie Reels</span>
                </div>

                <button
                    onClick={toggleMute}
                    className="p-2 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10 text-white hover:bg-slate-800 transition"
                >
                    {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
                </button>
            </div>

            {/* Bottom Content Info Overlay */}
            <div className="absolute bottom-0 left-0 right-16 p-4 md:p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20 space-y-2">
                
                {/* Creator Pill */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1px]">
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-emerald-400 text-xs font-bold uppercase">
                            {video.owner?.name?.[0] || 'O'}
                        </div>
                    </div>
                    <span className="text-sm font-bold text-white tracking-wide">
                        @{video.owner?.name || 'Chef'}
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                        Owner
                    </span>
                </div>

                {/* Video Title & Description */}
                <h3 className="text-base sm:text-lg font-extrabold text-white line-clamp-1">
                    {video.title}
                </h3>
                {video.description && (
                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                        {video.description}
                    </p>
                )}
            </div>

            {/* Right Action Bar Overlay */}
            <div className="absolute bottom-6 right-3 flex flex-col items-center space-y-5 z-20">
                
                {/* Like Button */}
                <LikeButton
                    videoId={video._id}
                    initialIsLiked={video.isLikedByUser || false}
                    initialLikesCount={video.likesCount || 0}
                />

                {/* Share Button */}
                <button
                    onClick={handleShare}
                    className="p-3 rounded-full bg-slate-900/70 backdrop-blur-md border border-white/10 text-white hover:bg-slate-800 transition active:scale-95"
                    title="Share Reel"
                >
                    <Share2 className="w-5 h-5" />
                </button>

                {/* View Counter Badge */}
                <div className="flex flex-col items-center text-slate-400">
                    <div className="p-2.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10">
                        <Eye className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-[11px] font-bold text-white mt-1">
                        {video.views || 0}
                    </span>
                </div>

            </div>
        </div>
    );
};

const VideoUploadModal = ({ isOpen, onClose, token }) => {
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [videoFile, setVideoFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();

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
        setProgress(1);

        if (!token || !videoFile) {
            setLoading(false);
            return;
        }

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('videoFile', videoFile);

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/videos/share`, data, {
                headers: { Authorization: `Bearer ${token}` },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setProgress(percentCompleted);
                },
            });

            setFormData({ title: '', description: '' });
            setVideoFile(null);
            setProgress(0);
            onClose();
        } catch (error) {
            const statusCode = error.response?.status;
            if (statusCode === 401 || statusCode === 403) {
                navigate('/login');
            }
            setProgress(0);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    disabled={loading}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-3 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-emerald-400" />
                    <span>Upload Gourmet Reel</span>
                </h2>

                <form onSubmit={handleUpload} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Reel Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleTextChange}
                            required
                            className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
                            placeholder="e.g. Sizzling Butter Chicken"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleTextChange}
                            rows="2"
                            className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
                            placeholder="Short description of the recipe..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Select Video File
                        </label>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={handleFileChange}
                            required
                            className="file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-500/20 file:text-emerald-400 hover:file:bg-emerald-500/30 text-xs text-slate-400"
                        />
                        {videoFile && (
                            <p className="mt-1.5 text-xs text-slate-400 flex items-center gap-1">
                                <File className="w-3.5 h-3.5 text-emerald-400" />
                                <span>{videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                            </p>
                        )}
                    </div>

                    {loading && (
                        <div className="w-full bg-slate-800 rounded-full h-2">
                            <div
                                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                            <p className="text-[11px] text-slate-400 mt-1 text-center font-bold">
                                {progress}% Uploaded
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition ${loading ? 'opacity-60 cursor-wait' : ''}`}
                    >
                        <Clock className="w-4 h-4" />
                        <span>{loading ? 'Publishing Reel...' : 'Publish Reel'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

const VideoReel = () => {
    const scrollContainerRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const { token, isLoggedIn, userData } = useContext(AuthContext);
    const [videos, setVideos] = useState([]);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [loadingFeed, setLoadingFeed] = useState(true);
    const isOwner = isLoggedIn && (userData?.role === 'owner' || userData?.role === 'admin');

    useEffect(() => {
        const fetchFeed = async () => {
            setLoadingFeed(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/videos/feed`);
                const fetchedVideos = response.data.data || response.data;
                setVideos(fetchedVideos || []);
            } catch (error) {
                console.error('Feed fetch error:', error);
            } finally {
                setLoadingFeed(false);
            }
        };
        fetchFeed();
    }, []);

    const handleScroll = () => {
        if (!scrollContainerRef.current || videos.length === 0) return;
        const container = scrollContainerRef.current;
        const scrollPosition = container.scrollTop;
        const viewportHeight = container.clientHeight;
        const newIndex = Math.round(scrollPosition / viewportHeight);
        if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
        }
    };

    const handleUploadSuccess = () => {
        setIsUploadOpen(false);
        window.location.reload();
    };

    return (
        <div className="w-full min-h-screen bg-slate-950 flex justify-center items-center font-sans">
            
            {/* Reels Container - Mobile frame view on Desktop, Full screen on Mobile */}
            <div 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="w-full sm:max-w-[420px] h-screen sm:h-[92vh] sm:rounded-3xl sm:border border-slate-800 bg-black overflow-y-scroll snap-y snap-mandatory relative shadow-2xl scrollbar-none"
            >
                {loadingFeed ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-3 text-slate-400">
                        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm font-bold text-slate-300">Loading Foodie Reels...</span>
                    </div>
                ) : videos.length > 0 ? (
                    videos.map((video, index) => (
                        <VideoPlayer
                            key={video._id}
                            video={video}
                            index={index}
                            activeIndex={activeIndex}
                        />
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-slate-400">
                        <Sparkles className="w-10 h-10 text-emerald-500/50" />
                        <h4 className="text-base font-bold text-slate-200">No reels uploaded yet</h4>
                        <p className="text-xs text-slate-500">Check back soon for fresh recipe videos.</p>
                        <Link to="/" className="text-xs font-bold text-emerald-400 hover:underline">
                            Return to Home
                        </Link>
                    </div>
                )}
            </div>

            {/* Owner Upload Floating Action Button */}
            {isOwner && (
                <button
                    onClick={() => setIsUploadOpen(true)}
                    className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition z-40 cursor-pointer"
                    title="Upload Reel"
                >
                    <Upload className="w-6 h-6" />
                </button>
            )}

            <VideoUploadModal
                isOpen={isUploadOpen}
                onClose={handleUploadSuccess}
                token={token}
            />
        </div>
    );
};

export default VideoReel;
