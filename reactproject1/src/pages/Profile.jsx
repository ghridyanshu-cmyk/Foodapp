import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { User, MapPin, LogOut, Home, Gamepad, Edit, ChevronRight, X, Camera, Save, ShoppingBag } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

// --- Edit Profile Modal Component ---

const EditProfileModal = ({ isOpen, onClose, userData, onSave }) => {
    const [formData, setFormData] = useState({
        name: userData.name,
        email: userData.email,
        address: userData.address,
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(userData.profilePicUrl);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setFormData({
            name: userData.name,
            email: userData.email,
            address: userData.address,
        });
        setPreviewUrl(userData.profilePicUrl);
    }, [userData]);

    const handleTextChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(formData, imageFile);
        } catch (error) {
            console.error("Save failed in modal:", error);
        } finally {
            setLoading(false);
            onClose(); // Close modal on success or failure
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                    <X className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Edit Profile</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Image Upload/Preview */}
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <img src={previewUrl} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover border-4 border-gray-200" />
                            <label htmlFor="profile-image" className="absolute bottom-0 right-0 p-1 bg-emerald-500 rounded-full cursor-pointer border-2 border-white shadow-md">
                                <Camera className="w-4 h-4 text-white" />
                                <input id="profile-image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </label>
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleTextChange} required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" />
                    </div>

                    {/* Email (Usually Read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleTextChange} required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" disabled />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed here.</p>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Shipping Address</label>
                        <textarea name="address" value={formData.address} onChange={handleTextChange} rows="2"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" />
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full flex justify-center items-center space-x-2 py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 transition duration-150">
                        <Save className="w-4 h-4" />
                        <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
};


// --- Main Profile Component ---

// Mock User Data Structure (for initial state before fetch)
const defaultUserData = {
    _id: '',
    name: "Loading User...",
    email: "loading@app.com",
    address: "Fetching address...",
    profilePicUrl: "https://placehold.co/100x100/CCCCCC/ffffff?text=U",
    role: "User"
};

const Profile = () => {
    // 🔑 Access context for token/login status and setter function
    const { token, isLoggedIn, setToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const [userData, setUserData] = useState(defaultUserData);
    const [isEditing, setIsEditing] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    // Use the primary theme color (Tailwind emerald-500/green-500)
    const PRIMARY_COLOR = 'text-emerald-500';

    // 1. Fetch User Data on Load
    useEffect(() => {
        if (!isLoggedIn || !token) {
            setLoadingData(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                // Fetch user data securely
                const response = await axios.get('http://localhost:8000/api/v2/user/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                // 🔑 FIX: Resilient data extraction
                // Check for 'data.user' (typical ApiResponse structure) or direct data.
                const rawData = response.data.data || response.data;
                const data = rawData.user || rawData;

                setUserData({
                    _id: data._id,
                    name: data.name || defaultUserData.name,
                    email: data.email || defaultUserData.email,
                    address: data.address || "No address saved.",
                    profilePicUrl: data.avatarUrl || data.profilePicUrl || defaultUserData.profilePicUrl,
                    role: data.role || defaultUserData.role
                });
            } catch (error) {
                toast.error("Failed to load profile data.");
                console.error("Error fetching profile:", error);
                handleLogout(false); // Log user out if token fails validation
            } finally {
                setLoadingData(false);
            }
        };
        fetchProfile();
    }, [isLoggedIn, token, navigate]); // Added navigate to dependency array

    // 2. Handle Logout (Redirects to /login and clears state)
    const handleLogout = (showToast = true) => {
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');

        // Use setToken from context to globally update login status
        if (typeof setToken === 'function') {
            setToken(null);
        }

        if (showToast) {
            toast.success("Logged out successfully!");
        }
        navigate('/'); // Standard secure practice: redirect to login page
    };

    // 3. Handle Profile Save (Edit Modal Submission)
    const handleSaveProfile = async (formData, imageFile) => {
        const url = `${import.meta.env.VITE_API_URL}/user/update`;
        const data = new FormData();

        // Append form text data
        data.append('name', formData.name);
        data.append('address', formData.address);

        // Append image if provided
        if (imageFile) {
            data.append('avatar', imageFile); // 'avatar' must match your backend's Multer field name
        }

        if (!token) {
            toast.error("Authentication required to save.");
            return;
        }

        try {
            const response = await axios.put(url, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            // Update local state with new data from server response
            const updatedRawData = response.data.user || response.data;

            setUserData(prev => ({
                ...prev,
                name: updatedRawData.name,
                address: updatedRawData.address,
                profilePicUrl: updatedRawData.avatarUrl || updatedRawData.profilePicUrl || prev.profilePicUrl
            }));

            toast.success("Profile updated successfully!");

        } catch (error) {
            console.error("Profile update failed:", error);
            toast.error("Failed to update profile.");
            // Re-throw error to be caught by modal submission handler
            throw error;
        }
    };

    // --- Conditional Render ---
    if (!isLoggedIn && !loadingData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <h1 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h1>
                <p className="text-gray-600 mb-6">Please log in to view your profile.</p>
                <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-2 bg-emerald-500 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-600 transition"
                >
                    Go to Login
                </button>
            </div>
        );
    }

    if (loadingData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg font-semibold text-emerald-500">Loading Profile...</div>
            </div>
        );
    }

    const navItems = [
        { name: "Home", icon: Home, path: "/" },
        { name: "Play", icon: Gamepad, path: "/vedioreel" },
        { name: "My Orders", icon: ShoppingBag, path: "/profile/orders" },
    ];


    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">

            {/* Header / Background Wave */}
            <div className="relative pt-12 pb-24 bg-white shadow-md">
                <div className="absolute inset-x-0 top-0 h-40 bg-emerald-500 clip-bottom-wave">
                    {/* Background wave effect via clip-path */}
                </div>

                {/* Profile Info Card */}
                <div className="relative mx-auto max-w-sm w-11/12 bg-white rounded-xl shadow-xl p-6 text-center z-10">
                    <img
                        src={userData.profilePicUrl}
                        alt="Profile Picture"
                        className="w-20 h-20 rounded-full object-cover mx-auto -mt-16 border-4 border-white shadow-lg"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/10B981/ffffff?text=U"; }}
                    />
                    <h1 className="text-xl font-bold text-gray-800 mt-3">{userData.name}</h1>
                    <p className="text-sm text-gray-500">{userData.role}</p>
                    <div className="mt-4 flex justify-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-xs font-medium text-gray-600">{userData.email}</span>
                    </div>
                </div>
            </div>

            {/* Main Account Options Section */}
            <div className="flex-grow p-4 space-y-4">

                {/* Simple Navigation Options (Home, Play, Orders) */}
                <div className="bg-white rounded-xl shadow-md divide-y divide-gray-100">
                    <h2 className="text-lg font-semibold p-4 text-gray-700">Quick Access</h2>
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
                        >
                            <div className="flex items-center space-x-3">
                                <item.icon className={`w-5 h-5 ${PRIMARY_COLOR}`} />
                                <span className="text-base font-medium text-gray-700">{item.name}</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </Link>
                    ))}
                </div>

                {/* Account Details & Management */}
                <div className="bg-white rounded-xl shadow-md divide-y divide-gray-100">
                    <h2 className="text-lg font-semibold p-4 text-gray-700">Account Management</h2>

                    {/* Edit Profile Link */}
                    <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition cursor-pointer" onClick={() => setIsEditing(true)}>
                        <div className="flex items-center space-x-3">
                            <Edit className={`w-5 h-5 ${PRIMARY_COLOR}`} />
                            <span className="text-base font-medium text-gray-700">Edit Profile</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                </div>

                {/* Address/Location */}
                <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
                    <div className="flex items-center space-x-3">
                        <MapPin className={`w-5 h-5 ${PRIMARY_COLOR}`} />
                        <div className="flex flex-col">
                            <span className="text-base font-medium text-gray-700">Shipping Address</span>
                            <span className="text-xs text-gray-500 w-64 truncate">{userData.address}</span>
                        </div>
                    </div>
                    <Edit className="w-5 h-5 text-gray-400 cursor-pointer hover:text-emerald-500" />
                </div>
            

            {/* Logout Button */}
            <button
                onClick={() => handleLogout()}
                className="w-full flex items-center justify-center space-x-3 p-4 bg-white text-red-500 rounded-xl shadow-md hover:bg-gray-100 transition font-semibold"
            >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
                </button>
                </div >

        
        

            {/* Edit Profile Modal */ }
    <EditProfileModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        userData={userData}
        onSave={handleSaveProfile}
    />
    

    {/* Custom CSS for the wave effect */ }
    <style jsx="true">{`
                .clip-bottom-wave {
                    clip-path: polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%);
                }
            `}
            </style>
        
        
            </div >
            );
    
};

export default Profile;