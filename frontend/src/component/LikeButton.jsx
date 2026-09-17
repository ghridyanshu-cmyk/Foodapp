import React, { useState, useContext } from 'react';
import { Heart } from 'lucide-react';

import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';

const LikeButton = ({ videoId, initialIsLiked, initialLikesCount }) => {
    // State to manage the visual status of the button
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likesCount, setLikesCount] = useState(initialLikesCount);
    const [loading, setLoading] = useState(false);

    // Get security state from context
    const { token, isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLikeToggle = async () => {
        if (!isLoggedIn || !token) {
            // toast removed
            navigate('/login');
            return;
        }

        // Optimistically update the UI for instant feedback
        const previousLikedState = isLiked;
        const previousCount = likesCount;
        
        setIsLiked(!isLiked);
        setLikesCount(prev => prev + (isLiked ? -1 : 1));
        setLoading(true);

        try {
            // Send authenticated request to the backend toggle endpoint
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/likes/toggle/${videoId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            // Backend should return the final, correct likesCount
            const { likesCount: newCount, isLiked: newIsLiked } = response.data.data;

            // Final sync with authoritative backend data (should match our optimistic update)
            setLikesCount(newCount);
            setIsLiked(newIsLiked);

            

        } catch (error) {
            // Revert the state on API failure (pessimistic update failure)
            setIsLiked(previousLikedState);
            setLikesCount(previousCount);
            
            const statusCode = error.response?.status;
            if (statusCode === 401 || statusCode === 403) {
                // toast removed
                navigate('/login');
            } else {
                // toast removed
            }
            console.error("Like API Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-1">
            <button
                onClick={handleLikeToggle}
                disabled={loading}
                className={`p-3 rounded-full shadow-lg transition-colors duration-150 ${
                    isLiked ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                } ${loading ? 'opacity-50 cursor-wait' : ''}`}
                aria-label={isLiked ? "Unlike video" : "Like video"}
            >
                <Heart className="w-6 h-6 fill-current" />
            </button>
            <span className="text-sm font-semibold text-white">
                {likesCount}
            </span>
        </div>
    );
};

export default LikeButton;