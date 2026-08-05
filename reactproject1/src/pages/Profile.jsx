import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
    User, MapPin, LogOut, Home, Edit, ChevronRight, X, Save, 
    ShoppingBag, ShieldCheck, Mail, Phone, Wallet, Ticket, Heart, 
    Copy, Check, Plus, Star, RotateCcw, Download, Navigation, Truck,
    ChefHat, CheckCircle2, Clock, Map, PhoneCall, Sparkles
} from 'lucide-react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { AddItem, setCartItems } from '../redux/cartSlice';

const Profile = () => {
    const { token, isLoggedIn, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [userData, setUserData] = useState({
        _id: '',
        name: "Foodie Member",
        email: "user@foodie.com",
        phone: "+91 98765 43210",
        address: "Flat 402, Green Valley, Noida",
        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
        role: "Gold Foodie Member",
        walletBalance: 250
    });

    const [isEditing, setIsEditing] = useState(false);
    const [showOrdersDrawer, setShowOrdersDrawer] = useState(false);
    const [showCouponsModal, setShowCouponsModal] = useState(false);
    const [showTrackingModal, setShowTrackingModal] = useState(false);
    const [activeTrackingOrder, setActiveTrackingOrder] = useState(null);
    const [copiedCoupon, setCopiedCoupon] = useState('');
    const [loadingData, setLoadingData] = useState(true);

    // Realistic Orders List with Restaurant Info & Status
    const [orders, setOrders] = useState([
        {
            id: "ORD-98214",
            restaurant: "Royal Punjab Kitchen",
            restLogo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&auto=format&fit=crop&q=60",
            date: "Today, 02:30 PM",
            status: "In Transit",
            eta: "Arriving in 12 mins",
            total: 420,
            paymentMode: "Cash on Delivery",
            deliveryAddress: "Flat 402, Green Valley Heights, Sector 62, Noida",
            userRating: 0,
            rider: {
                name: "Ramesh Kumar 🛵",
                phone: "+91 98112 34567",
                vehicle: "UP 16 AB 4092 (Honda Activa)",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60"
            },
            items: [
                { id: "p1", name: "Gourmet Butter Chicken", type: "non-veg", qty: 1, price: 340, image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=200&auto=format&fit=crop&q=60" },
                { id: "p2", name: "Garlic Butter Naan", type: "veg", qty: 2, price: 40, image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=200&auto=format&fit=crop&q=60" }
            ]
        },
        {
            id: "ORD-76120",
            restaurant: "Pizzeria Italia & Bistro",
            restLogo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&auto=format&fit=crop&q=60",
            date: "Yesterday, 07:15 PM",
            status: "Delivered",
            eta: "Delivered successfully",
            total: 350,
            paymentMode: "Paid via UPI",
            deliveryAddress: "Flat 402, Green Valley Heights, Sector 62, Noida",
            userRating: 5,
            items: [
                { id: "p3", name: "Crispy Paneer Tikka", type: "veg", qty: 1, price: 270, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=200&auto=format&fit=crop&q=60" },
                { id: "p4", name: "Mango Lassi Chill", type: "veg", qty: 1, price: 80, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=200&auto=format&fit=crop&q=60" }
            ]
        }
    ]);

    // Coupons Data
    const coupons = [
        { code: "FOODIE50", desc: "Get 50% OFF up to Rs 100 on orders above Rs 199", tag: "POPULAR" },
        { code: "FREEDEL", desc: "Free Delivery on all gourmet orders", tag: "DELIVERY" },
        { code: "WELCOME100", desc: "Rs 100 Instant Cashback into Foodie Wallet", tag: "NEW" },
    ];

    // Saved Favorite Dishes Data
    const favoriteDishes = [
        { id: "fav1", name: "Butter Chicken Special", price: 340, image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=200&auto=format&fit=crop&q=60" },
        { id: "fav2", name: "Paneer Tikka Grill", price: 280, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=200&auto=format&fit=crop&q=60" },
    ];

    // Fetch Profile
    useEffect(() => {
        if (!isLoggedIn || !token) {
            setLoadingData(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const rawData = response.data.data || response.data;
                const data = rawData.user || rawData;

                setUserData({
                    _id: data._id || '',
                    name: data.name || "Foodie Member",
                    email: data.email || "user@foodie.com",
                    phone: data.phone || "+91 98765 43210",
                    address: data.address || "Flat 402, Green Valley, Noida",
                    avatarUrl: data.avatarUrl || data.profilePicUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
                    role: data.role || "Gold Foodie Member",
                    walletBalance: 250
                });
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoadingData(false);
            }
        };

        fetchProfile();
    }, [isLoggedIn, token]);

    const handleLogout = () => {
        dispatch(setCartItems([]));
        localStorage.removeItem('cart');
        logout();
        navigate('/');
    };

    const handleReorder = (orderItems) => {
        orderItems.forEach(item => {
            dispatch(AddItem({
                id: item.id,
                name: item.name,
                price: item.price,
                qty: item.qty,
                image: item.image
            }));
        });
        setShowOrdersDrawer(false);
        alert("Order items added to your cart!");
        navigate('/');
    };

    const handleOpenTracking = (order) => {
        setActiveTrackingOrder(order);
        setShowTrackingModal(true);
    };

    const handleRateOrder = (orderId, newRating) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, userRating: newRating } : o));
        alert(`Thank you! Rated ${newRating} stars for order ${orderId}.`);
    };

    // PDF INVOICE GENERATOR FUNCTION
    const handleDownloadInvoice = (order) => {
        const invoiceHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice - ${order.id}</title>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; color: #1e293b; background: #fff; }
                    .header { display: flex; justify-content: space-between; border-bottom: 3px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; }
                    .brand { font-size: 26px; font-weight: 800; color: #10b981; }
                    .badge { background: #d1fae5; color: #065f46; font-size: 12px; font-weight: bold; padding: 4px 12px; border-radius: 20px; }
                    .section { display: flex; justify-content: space-between; margin-bottom: 30px; }
                    .box { width: 48%; background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0; }
                    .box h4 { margin-top: 0; color: #0f172a; font-size: 14px; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; }
                    .box p { margin: 4px 0; font-size: 12px; color: #475569; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                    th { background: #f1f5f9; text-align: left; padding: 12px; font-size: 12px; color: #334155; border-bottom: 2px solid #e2e8f0; }
                    td { padding: 12px; font-size: 12px; border-bottom: 1px solid #e2e8f0; }
                    .total-box { text-align: right; margin-top: 20px; }
                    .grand-total { font-size: 20px; font-weight: 800; color: #10b981; margin-top: 6px; }
                    .footer { margin-top: 50px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <div class="brand">FoodieExpress Invoice</div>
                        <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Official Tax Receipt & Order Summary</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 16px; font-weight: bold;">${order.id}</div>
                        <div style="font-size: 12px; color: #64748b;">${order.date}</div>
                        <div class="badge" style="margin-top: 8px; display: inline-block;">${order.paymentMode}</div>
                    </div>
                </div>

                <div class="section">
                    <div class="box">
                        <h4>Shopkeeper & Kitchen Details</h4>
                        <p><strong>Shopkeeper / Manager:</strong> Authorized Food Shopkeeper</p>
                        <p><strong>Restaurant:</strong> ${order.restaurant}</p>
                        <p><strong>GSTIN:</strong> 07AAAAA0000A1Z5</p>
                        <p><strong>Support:</strong> +91 1800-FOODIE</p>
                    </div>
                    <div class="box">
                        <h4>Customer & Delivery Address</h4>
                        <p><strong>Customer Name:</strong> ${userData.name}</p>
                        <p><strong>Phone:</strong> ${userData.phone}</p>
                        <p><strong>Delivery Location:</strong> ${order.deliveryAddress}</p>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>S.NO</th>
                            <th>DISH NAME</th>
                            <th>QUANTITY</th>
                            <th>UNIT PRICE</th>
                            <th style="text-align: right;">AMOUNT</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map((it, idx) => `
                            <tr>
                                <td>${idx + 1}</td>
                                <td><strong>${it.name}</strong> (${it.type})</td>
                                <td>${it.qty}</td>
                                <td>Rs ${it.price}</td>
                                <td style="text-align: right;">Rs ${it.price * it.qty}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="total-box">
                    <p style="font-size: 12px; margin: 2px 0;">Subtotal: Rs ${order.total - 30}</p>
                    <p style="font-size: 12px; margin: 2px 0;">Delivery & Taxes: Rs 30</p>
                    <div class="grand-total">Total Amount: Rs ${order.total}</div>
                </div>

                <div class="footer">
                    <p>Thank you for ordering with FoodieExpress! Save or print this PDF for your records.</p>
                </div>

                <script>
                    window.onload = function() {
                        window.print();
                    };
                </script>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(invoiceHtml);
        printWindow.document.close();
    };

    const copyCouponCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCoupon(code);
        setTimeout(() => setCopiedCoupon(''), 2000);
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        const form = e.target;
        const updatedName = form.name.value;
        const updatedAddress = form.address.value;
        const updatedPhone = form.phone.value;

        setUserData(prev => ({
            ...prev,
            name: updatedName,
            address: updatedAddress,
            phone: updatedPhone
        }));

        setIsEditing(false);

        if (token) {
            try {
                await axios.put(`${import.meta.env.VITE_API_URL}/user/update`, {
                    name: updatedName,
                    address: updatedAddress,
                    phone: updatedPhone
                }, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } catch (err) {
                console.error("Profile update failed:", err);
            }
        }
    };

    if (!isLoggedIn && !loadingData) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
                <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-lg border border-slate-200 space-y-4">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                        <User className="w-7 h-7" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">Account Login Required</h2>
                    <p className="text-xs text-slate-500">Please log in to manage your Foodie profile, wallet, and past food orders.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    if (loadingData) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
                <div className="text-xs font-bold text-emerald-600 animate-pulse">Loading Profile...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-12">
            
            {/* Top Navigation */}
            <div className="bg-white border-b border-slate-200 px-4 py-3 shadow-xs">
                <div className="max-w-md mx-auto flex items-center justify-between">
                    <Link to="/" className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <Home className="w-4 h-4" />
                        <span>Home</span>
                    </Link>
                    <span className="text-sm font-bold text-slate-800">Account Dashboard</span>
                    <button onClick={handleLogout} className="text-xs font-bold text-rose-600 hover:underline cursor-pointer">
                        Log Out
                    </button>
                </div>
            </div>

            <div className="max-w-md mx-auto p-4 space-y-4">

                {/* Active Delivery Tracking Banner (If order in transit) */}
                {orders.some(o => o.status === 'In Transit') && (
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl p-4 shadow-lg flex items-center justify-between animate-pulse">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl">
                                <Truck className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="text-[11px] font-bold text-amber-100">Live Order In Transit 🚚</div>
                                <div className="text-sm font-extrabold">Arriving in 12 mins</div>
                            </div>
                        </div>
                        <button
                            onClick={() => handleOpenTracking(orders.find(o => o.status === 'In Transit'))}
                            className="px-3.5 py-1.5 bg-white text-amber-900 hover:bg-amber-50 rounded-xl text-xs font-extrabold shadow-sm transition cursor-pointer"
                        >
                            Track Live
                        </button>
                    </div>
                )}

                {/* User Header Profile Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 text-center relative space-y-3">
                    <div className="relative inline-block">
                        <img
                            src={userData.avatarUrl}
                            alt={userData.name}
                            className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-emerald-500 shadow-md"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80"; }}
                        />
                        <button
                            onClick={() => setIsEditing(true)}
                            className="absolute bottom-0 right-0 p-1.5 bg-emerald-600 text-white rounded-full shadow border border-white cursor-pointer hover:bg-emerald-700 transition"
                            title="Edit Profile"
                        >
                            <Edit className="w-3 h-3" />
                        </button>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-slate-900">{userData.name}</h2>
                        <p className="text-xs text-slate-500 font-medium">{userData.email}</p>
                        <div className="mt-1.5 flex justify-center items-center gap-2">
                            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                <span>{userData.role}</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Foodie Wallet */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl p-4 shadow-md flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl">
                            <Wallet className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <div className="text-[11px] font-semibold text-emerald-100">Foodie Cash Wallet</div>
                            <div className="text-lg font-extrabold">Rs {userData.walletBalance}.00</div>
                        </div>
                    </div>
                    <button
                        onClick={() => alert("Rs 250 Foodie Cash is ready for your next checkout!")}
                        className="px-3 py-1.5 bg-white text-emerald-700 hover:bg-emerald-50 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                        Active Cash
                    </button>
                </div>

                {/* Food Coupons & Discounts */}
                <button
                    onClick={() => setShowCouponsModal(true)}
                    className="w-full p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between hover:bg-amber-100/60 transition cursor-pointer"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500 text-white rounded-xl shadow-xs">
                            <Ticket className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                            <div className="text-xs font-bold text-amber-900">Food Vouchers & Promo Codes</div>
                            <div className="text-[10px] text-amber-700">3 active coupons available</div>
                        </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-amber-700" />
                </button>

                {/* Options List */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                    
                    {/* My Orders Button */}
                    <button
                        onClick={() => setShowOrdersDrawer(true)}
                        className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition text-left cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                <ShoppingBag className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-slate-800">My Order History & Live Tracking</div>
                                <div className="text-[10px] text-slate-400">{orders.length} past orders with live tracking</div>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>

                    {/* Delivery Address */}
                    <div
                        onClick={() => setIsEditing(true)}
                        className="p-4 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                <MapPin className="w-4 h-4" />
                            </div>
                            <div className="max-w-[220px]">
                                <div className="text-xs font-bold text-slate-800">Delivery Location</div>
                                <div className="text-[10px] text-slate-500 truncate">{userData.address}</div>
                            </div>
                        </div>
                        <Edit className="w-3.5 h-3.5 text-slate-400 hover:text-emerald-600" />
                    </div>

                    {/* Customer Support */}
                    <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                <Phone className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-slate-800">24/7 Foodie Support</div>
                                <div className="text-[10px] text-slate-400">+91 1800-FOODIE (Helpline)</div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Log Out Button */}
                <button
                    onClick={handleLogout}
                    className="w-full py-3 bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold rounded-2xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out Account</span>
                </button>

            </div>

            {/* LIVE DELIVERY TRACKING MODAL */}
            {showTrackingModal && activeTrackingOrder && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 relative border border-slate-100 overflow-hidden space-y-4">
                        <button
                            onClick={() => setShowTrackingModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2 border-b pb-3">
                            <Truck className="w-5 h-5 text-amber-600" />
                            <div>
                                <h3 className="text-base font-extrabold text-slate-900">Live Delivery Tracking</h3>
                                <p className="text-[10px] text-slate-400">{activeTrackingOrder.id} • {activeTrackingOrder.restaurant}</p>
                            </div>
                        </div>

                        {/* Live ETA Banner */}
                        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center space-y-1">
                            <div className="text-xs font-bold text-amber-800">Estimated Delivery Time</div>
                            <div className="text-2xl font-extrabold text-amber-900 tracking-tight">{activeTrackingOrder.eta}</div>
                            <div className="w-full bg-amber-200 rounded-full h-1.5 mt-2 overflow-hidden">
                                <div className="bg-amber-600 h-1.5 rounded-full w-3/4 animate-pulse"></div>
                            </div>
                        </div>

                        {/* Tracking Progress Steps */}
                        <div className="space-y-3 pt-2">
                            {[
                                { step: "Order Placed & Confirmed", done: true, time: "02:30 PM" },
                                { step: "Food Prepared by Shopkeeper Chef", done: true, time: "02:42 PM" },
                                { step: "Rider Picked Up & Out for Delivery", done: true, active: true, time: "02:50 PM" },
                                { step: "Delivered to Doorstep", done: false, time: "Est 03:02 PM" },
                            ].map((s, idx) => (
                                <div key={idx} className="flex items-start gap-3 text-xs">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 ${
                                        s.active 
                                            ? 'bg-amber-500 text-white animate-bounce ring-4 ring-amber-100' 
                                            : s.done 
                                                ? 'bg-emerald-500 text-white' 
                                                : 'bg-slate-200 text-slate-500'
                                    }`}>
                                        {s.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className={`font-bold ${s.active ? 'text-amber-900' : s.done ? 'text-slate-800' : 'text-slate-400'}`}>
                                            {s.step}
                                        </div>
                                        <div className="text-[10px] text-slate-400">{s.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Delivery Rider Card */}
                        {activeTrackingOrder.rider && (
                            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img src={activeTrackingOrder.rider.avatar} alt="Rider" className="w-10 h-10 rounded-full object-cover border border-emerald-500" />
                                    <div>
                                        <div className="text-xs font-bold text-slate-900">{activeTrackingOrder.rider.name}</div>
                                        <div className="text-[10px] text-slate-500">{activeTrackingOrder.rider.vehicle}</div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => alert(`Calling rider at ${activeTrackingOrder.rider.phone}...`)}
                                    className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                                >
                                    <PhoneCall className="w-4 h-4" />
                                    <span>Call</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ORDER HISTORY DRAWER / MODAL */}
            {showOrdersDrawer && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-5 relative border border-slate-100 max-h-[85vh] flex flex-col font-sans">
                        
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between border-b pb-3 mb-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                                    <ShoppingBag className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">My Food Orders</h3>
                                    <p className="text-[10px] text-slate-400">PDF Receipts & live delivery tracking</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowOrdersDrawer(false)}
                                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Order Cards List */}
                        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                            {orders.map(order => (
                                <div key={order.id} className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3 shadow-xs">
                                    
                                    {/* Restaurant & Order Status Header */}
                                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                                        <div className="flex items-center gap-2.5">
                                            <img src={order.restLogo} alt={order.restaurant} className="w-9 h-9 rounded-xl object-cover border border-slate-200" />
                                            <div>
                                                <div className="text-xs font-bold text-slate-900">{order.restaurant}</div>
                                                <div className="text-[10px] text-slate-400">{order.id} • {order.date}</div>
                                            </div>
                                        </div>

                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                                            order.status === 'In Transit'
                                                ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                                                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                        }`}>
                                            {order.status === 'In Transit' ? <Truck className="w-3 h-3 text-amber-600" /> : <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                                            <span>{order.status}</span>
                                        </span>
                                    </div>

                                    {/* ETA / Delivery Tag & Live Track Button */}
                                    <div className="px-2.5 py-1.5 bg-white rounded-lg text-[10px] font-semibold text-slate-600 flex items-center justify-between border border-slate-100">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3 text-emerald-600" />
                                            <span>{order.eta}</span>
                                        </span>

                                        {order.status === 'In Transit' ? (
                                            <button
                                                onClick={() => {
                                                    setShowOrdersDrawer(false);
                                                    handleOpenTracking(order);
                                                }}
                                                className="px-2 py-0.5 bg-amber-500 hover:bg-amber-600 text-white rounded font-extrabold text-[10px] transition cursor-pointer"
                                            >
                                                Track Live
                                            </button>
                                        ) : (
                                            <span className="text-slate-400">{order.paymentMode}</span>
                                        )}
                                    </div>

                                    {/* Itemized Order List */}
                                    <div className="space-y-2 pt-1">
                                        {order.items.map((it, idx) => (
                                            <div key={idx} className="flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-3 h-3 rounded-xs border flex items-center justify-center ${
                                                        it.type === 'veg' ? 'border-emerald-600' : 'border-rose-600'
                                                    }`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${
                                                            it.type === 'veg' ? 'bg-emerald-600' : 'bg-rose-600'
                                                        }`}></div>
                                                    </div>
                                                    <img src={it.image} alt={it.name} className="w-7 h-7 rounded-md object-cover" />
                                                    <span className="text-slate-800 font-semibold">{it.qty}x {it.name}</span>
                                                </div>
                                                <span className="font-bold text-slate-900">Rs {it.price * it.qty}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action Buttons: Invoice Download & Reorder */}
                                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-0.5">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star
                                                    key={star}
                                                    onClick={() => handleRateOrder(order.id, star)}
                                                    className={`w-4 h-4 cursor-pointer transition ${
                                                        star <= order.userRating 
                                                            ? 'fill-amber-400 text-amber-400 hover:scale-110' 
                                                            : 'text-slate-300 hover:text-amber-400'
                                                    }`}
                                                />
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => handleDownloadInvoice(order)}
                                                className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                                                title="Print or Save PDF Invoice"
                                            >
                                                <Download className="w-3 h-3 text-emerald-600" />
                                                <span>PDF Invoice</span>
                                            </button>

                                            <button
                                                onClick={() => handleReorder(order.items)}
                                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-bold flex items-center gap-1 transition cursor-pointer shadow-xs"
                                            >
                                                <RotateCcw className="w-3 h-3" />
                                                <span>Re-Order</span>
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            )}

            {/* Coupons Modal */}
            {showCouponsModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5 relative border border-slate-100 space-y-3">
                        <button
                            onClick={() => setShowCouponsModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <h3 className="text-sm font-bold text-slate-800 border-b pb-2 flex items-center gap-1.5">
                            <Ticket className="w-4 h-4 text-amber-500" />
                            <span>Active Promo Coupons</span>
                        </h3>

                        <div className="space-y-2.5">
                            {coupons.map((c, idx) => (
                                <div key={idx} className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <span className="font-extrabold text-xs text-amber-900 tracking-wide bg-amber-200/60 px-2 py-0.5 rounded">
                                            {c.code}
                                        </span>
                                        <button
                                            onClick={() => copyCouponCode(c.code)}
                                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
                                        >
                                            {copiedCoupon === c.code ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                            <span>{copiedCoupon === c.code ? 'COPIED' : 'COPY'}</span>
                                        </button>
                                    </div>
                                    <p className="text-[11px] text-amber-800">{c.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Profile Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5 relative border border-slate-100 space-y-4">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <h3 className="text-sm font-bold text-slate-800 border-b pb-2">Edit Profile Details</h3>

                        <form onSubmit={handleSaveProfile} className="space-y-3">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={userData.name}
                                    required
                                    className="w-full bg-slate-50 border border-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    defaultValue={userData.phone}
                                    required
                                    className="w-full bg-slate-50 border border-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">Delivery Address</label>
                                <textarea
                                    name="address"
                                    defaultValue={userData.address}
                                    rows="2"
                                    required
                                    className="w-full bg-slate-50 border border-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer flex items-center justify-center gap-1.5"
                            >
                                <Save className="w-3.5 h-3.5" />
                                <span>Save Changes</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Profile;