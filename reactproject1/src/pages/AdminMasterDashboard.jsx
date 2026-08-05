import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
    Users, Store, ShoppingBag, DollarSign, Video, ShieldCheck, 
    Search, Filter, Trash2, CheckCircle2, AlertCircle, 
    Home, LogOut, Sparkles, ChevronRight, Eye, Plus,
    Edit, X, Download, TrendingUp, Award, Clock, ArrowUpRight,
    Lock, Check, Settings, Percent, Activity, Phone, Mail, MapPin,
    Flame, RefreshCcw, Power, PhoneCall, FileText, BadgePercent,
    Utensils, Truck, Navigation, Star, Gift
} from 'lucide-react';

const AdminMasterDashboard = () => {
    const { token, isLoggedIn, role, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // Direct Instant Access Check from localStorage & AuthContext
    const storedToken = localStorage.getItem('authToken') || token;
    const storedRole = localStorage.getItem('userRole') || role;
    
    // Unconditional entry if role is admin or has valid token
    const isMasterAdmin = !!storedToken && (storedRole === 'admin' || role === 'admin' || isLoggedIn);

    // Auto-redirect to /admin/login if not authenticated as Master Admin (No Card Rendered)
    useEffect(() => {
        if (!isMasterAdmin) {
            navigate('/admin/login', { replace: true });
        }
    }, [isMasterAdmin, navigate]);

    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'sellers' | 'customers' | 'products' | 'orders'
    const [searchQuery, setSearchQuery] = useState('');

    // Modals state
    const [showAddSellerModal, setShowAddSellerModal] = useState(false);
    const [showEditWalletModal, setShowEditWalletModal] = useState(false);
    const [showStoreInspectorModal, setShowStoreInspectorModal] = useState(false);
    
    const [selectedStore, setSelectedStore] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [walletInput, setWalletInput] = useState('');

    // Platform Analytics
    const [stats] = useState({
        totalUsers: 7,
        totalSellers: 6,
        totalProducts: 11,
        totalReels: 4,
        totalOrders: 42,
        grossRevenue: 68450,
        platformCommission: 10267, // 15% commission
        peakHour: "01:00 PM - 03:00 PM & 08:00 PM - 10:00 PM",
        avgDeliveryTime: "24 Mins",
        activeRiders: 18
    });

    // Master Sellers / Shopkeepers List
    const [sellers, setSellers] = useState([
        { 
            id: "S1", 
            name: "Amit Kumar", 
            email: "collegeamit79@gmail.com", 
            phone: "+91 98112 09876",
            store: "Royal Punjab Kitchen", 
            category: "North Indian & Mughlai", 
            fssai: "11522034000189",
            gstin: "07AAAAA0000A1Z5",
            commission: 15, 
            status: "Active", 
            items: [
                { id: "p1", name: "Gourmet Butter Chicken", price: 340, inStock: true },
                { id: "p2", name: "Garlic Butter Naan", price: 40, inStock: true }
            ], 
            totalSales: 24500, 
            rating: 4.8, 
            logo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&auto=format&fit=crop&q=60" 
        },
        { 
            id: "S2", 
            name: "Harsh Vardhan", 
            email: "ghridyanshu@gmail.com", 
            phone: "+91 98765 43210",
            store: "Pizzeria Italia & Bistro", 
            category: "Italian & Fast Food", 
            fssai: "11522034000240",
            gstin: "07BBBBB1111B2Z6",
            commission: 15, 
            status: "Active", 
            items: [
                { id: "p3", name: "Crispy Paneer Tikka", price: 270, inStock: true },
                { id: "p4", name: "Mango Lassi Chill", price: 80, inStock: true }
            ], 
            totalSales: 18200, 
            rating: 4.6, 
            logo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&auto=format&fit=crop&q=60" 
        },
        { 
            id: "S3", 
            name: "Aditya Singh", 
            email: "aditya@gmail.com", 
            phone: "+91 97123 45678",
            store: "Urban Spice Grill", 
            category: "BBQ & Tandoori", 
            fssai: "11522034000311",
            gstin: "07CCCCC2222C3Z7",
            commission: 12, 
            status: "Active", 
            items: [
                { id: "p5", name: "Cheesy Pepperoni Pizza", price: 490, inStock: true }
            ], 
            totalSales: 14950, 
            rating: 4.5, 
            logo: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=100&auto=format&fit=crop&q=60" 
        },
    ]);

    // Master Customers List
    const [customers, setCustomers] = useState([
        { id: "U1", name: "Harsh Vardhan", email: "ghridyanshu@gmail.com", phone: "+91 98765 43210", address: "Flat 402, Green Valley, Noida", orders: 12, wallet: 250, tier: "Gold Member", status: "Active", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60" },
        { id: "U2", name: "Arya Sharma", email: "arya@gmail.com", phone: "+91 98112 34567", address: "Sector 18, Commercial Hub, Noida", orders: 6, wallet: 100, tier: "Silver Member", status: "Active", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60" },
        { id: "U3", name: "Ishan Verma", email: "ishan@gmail.com", phone: "+91 97123 45678", address: "Tech Park Block B, Cyber City", orders: 8, wallet: 150, tier: "Gold Member", status: "Active", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=60" },
    ]);

    // Global Food Menu
    const [products, setProducts] = useState([
        { id: "p1", name: "Gourmet Butter Chicken", seller: "Royal Punjab Kitchen", price: 340, category: "Curry", type: "non-veg", inStock: true, salesCount: 142, image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=200&auto=format&fit=crop&q=60" },
        { id: "p2", name: "Crispy Paneer Tikka", seller: "Pizzeria Italia", price: 270, category: "Starters", type: "veg", inStock: true, salesCount: 98, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=200&auto=format&fit=crop&q=60" },
        { id: "p3", name: "Cheesy Pepperoni Pizza", seller: "Urban Spice Grill", price: 490, category: "Pizza", type: "non-veg", inStock: true, salesCount: 86, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&auto=format&fit=crop&q=60" },
        { id: "p4", name: "Mango Lassi Chill", seller: "Royal Punjab Kitchen", price: 80, category: "Beverages", type: "veg", inStock: true, salesCount: 210, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=200&auto=format&fit=crop&q=60" },
    ]);

    // Real-Time Global Orders Feed
    const [orders, setOrders] = useState([
        { id: "ORD-98214", customer: "Harsh Vardhan", seller: "Royal Punjab Kitchen", rider: "Ramesh Kumar 🛵", amount: 420, date: "Today, 02:30 PM", status: "In Transit", payment: "Cash on Delivery" },
        { id: "ORD-76120", customer: "Arya Sharma", seller: "Pizzeria Italia", rider: "Vikas Singh 🛵", amount: 350, date: "Yesterday, 07:15 PM", status: "Delivered", payment: "Paid via UPI" },
        { id: "ORD-54019", customer: "Ishan Verma", seller: "Urban Spice Grill", rider: "Suresh Pal 🛵", amount: 580, date: "29 Jul 2026", status: "Delivered", payment: "Paid via Card" },
    ]);

    // Weekly Sales Analytics Bar Data
    const salesGraphData = [
        { day: 'Mon', revenue: 8400 },
        { day: 'Tue', revenue: 11200 },
        { day: 'Wed', revenue: 9600 },
        { day: 'Thu', revenue: 14500 },
        { day: 'Fri', revenue: 18200 },
        { day: 'Sat', revenue: 24500 },
        { day: 'Sun', revenue: 21000 },
    ];

    // Handlers
    const handleAddSeller = (e) => {
        e.preventDefault();
        const form = e.target;
        const newSeller = {
            id: `S${sellers.length + 1}`,
            name: form.sellerName.value,
            email: form.sellerEmail.value,
            phone: form.sellerPhone.value || "+91 98000 11122",
            store: form.storeName.value,
            category: form.category.value,
            fssai: "11522034000" + Math.floor(100 + Math.random() * 900),
            gstin: "07DDDDD4444D4Z8",
            commission: Number(form.commission.value) || 15,
            status: "Active",
            items: [],
            totalSales: 0,
            rating: 5.0,
            logo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&auto=format&fit=crop&q=60"
        };

        setSellers([newSeller, ...sellers]);
        setShowAddSellerModal(false);
        alert(`Successfully onboarded Merchant Store: ${newSeller.store}!`);
    };

    const handleUpdateWallet = (e) => {
        e.preventDefault();
        if (!selectedCustomer) return;
        const newBalance = Number(walletInput);
        setCustomers(prev => prev.map(c => c.id === selectedCustomer.id ? { ...c, wallet: newBalance } : c));
        setShowEditWalletModal(false);
        alert(`Updated Foodie Cash for ${selectedCustomer.name} to Rs ${newBalance}.00`);
    };

    const handleGrantBonus = (customerId, amount) => {
        setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, wallet: c.wallet + amount } : c));
        alert(`Granted Rs ${amount} Bonus Cash to customer!`);
    };

    const toggleSellerStatus = (id) => {
        setSellers(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'Active' ? 'Suspended' : 'Active' } : s));
    };

    const toggleCustomerStatus = (id) => {
        setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Deactivated' : 'Active' } : c));
    };

    const toggleProductStock = (id) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, inStock: !p.inStock } : p));
    };

    const handleDeleteProduct = (id) => {
        if (window.confirm("Delete this food item from platform catalog?")) {
            setProducts(prev => prev.filter(p => p.id !== id));
        }
    };

    const handleForceDeliverOrder = (orderId) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Delivered' } : o));
        alert(`Order ${orderId} marked as Delivered!`);
    };

    const handleExportCSV = () => {
        const headers = ["Order ID,Customer,Seller,Rider,Amount,Payment,Status,Date\n"];
        const rows = orders.map(o => `${o.id},${o.customer},${o.seller},${o.rider},${o.amount},${o.payment},${o.status},${o.date}`).join("\n");
        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `FoodieExpress_Platform_Audit_${Date.now()}.csv`;
        a.click();
    };

    if (!isMasterAdmin) {
        return null; // Instant redirect executed via useEffect
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-12">
            
            {/* Top Navigation */}
            <div className="bg-white border-b border-slate-200 px-4 py-3 shadow-xs sticky top-0 z-40">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Link to="/" className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <Home className="w-4 h-4" />
                        <span>Home</span>
                    </Link>
                    
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        <span className="text-sm font-extrabold text-slate-900">FoodieExpress Admin Console</span>
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full border border-emerald-200">
                            Super Admin
                        </span>
                    </div>

                    <button 
                        onClick={() => { logout(); navigate('/admin/login'); }} 
                        className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                        Log Out
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-4 space-y-5">

                {/* Hero Banner Header */}
                <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-6 shadow-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border-2 border-white/40 shadow-inner">
                            <ShieldCheck className="w-9 h-9" />
                        </div>
                        <div>
                            <div className="text-[11px] font-bold text-emerald-100 uppercase tracking-widest">Enterprise Command Hub</div>
                            <h1 className="text-2xl font-black tracking-tight">Master Control Console</h1>
                            <p className="text-xs text-emerald-100/90 mt-0.5">Logged in as: ghridyanshu@gmail.com (Super Admin)</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleExportCSV}
                            className="px-3.5 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                        >
                            <Download className="w-4 h-4" />
                            <span>Export Audit CSV</span>
                        </button>
                        <button
                            onClick={() => setShowAddSellerModal(true)}
                            className="px-4 py-2 bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-extrabold rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1.5"
                        >
                            <Plus className="w-4 h-4 text-emerald-600" />
                            <span>Onboard Seller</span>
                        </button>
                    </div>
                </div>

                {/* Platform Analytics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs text-center space-y-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Customers</div>
                        <div className="text-xl font-extrabold text-slate-900">{stats.totalUsers}</div>
                        <div className="text-[10px] text-emerald-600 font-bold">100% Active</div>
                    </div>

                    <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs text-center space-y-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Merchant Stores</div>
                        <div className="text-xl font-extrabold text-slate-900">{stats.totalSellers}</div>
                        <div className="text-[10px] text-teal-600 font-bold">FSSAI Verified</div>
                    </div>

                    <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs text-center space-y-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Menu Dishes</div>
                        <div className="text-xl font-extrabold text-slate-900">{stats.totalProducts}</div>
                        <div className="text-[10px] text-amber-600 font-bold">Active Dishes</div>
                    </div>

                    <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs text-center space-y-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Active Riders</div>
                        <div className="text-xl font-extrabold text-slate-900">{stats.activeRiders} 🛵</div>
                        <div className="text-[10px] text-sky-600 font-bold">Avg {stats.avgDeliveryTime}</div>
                    </div>

                    <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs text-center space-y-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Gross Volume</div>
                        <div className="text-lg font-extrabold text-emerald-600">Rs {stats.grossRevenue}</div>
                        <div className="text-[10px] text-slate-400 font-bold">Gross Sales</div>
                    </div>

                    <div className="bg-amber-50 rounded-2xl p-3.5 border border-amber-200 shadow-xs text-center space-y-1">
                        <div className="text-[10px] font-bold text-amber-800 uppercase">Admin Cut (15%)</div>
                        <div className="text-lg font-extrabold text-amber-900">Rs {stats.platformCommission}</div>
                        <div className="text-[10px] text-amber-700 font-bold">Net Profit</div>
                    </div>
                </div>

                {/* Master Tab Bar */}
                <div className="bg-white rounded-2xl p-1.5 border border-slate-200/80 shadow-xs flex gap-1 overflow-x-auto">
                    {[
                        { id: 'overview', label: 'Executive Analytics', icon: Activity },
                        { id: 'sellers', label: 'Sellers (Shopkeepers)', icon: Store, count: sellers.length },
                        { id: 'customers', label: 'Customers (Users)', icon: Users, count: customers.length },
                        { id: 'products', label: 'Global Food Menu', icon: ShoppingBag, count: products.length },
                        { id: 'orders', label: 'Orders & Logistics Feed', icon: Clock, count: orders.length },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                                activeTab === tab.id
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            <tab.icon className="w-3.5 h-3.5" />
                            <span>{tab.label}</span>
                            {tab.count !== undefined && (
                                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                                }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* TAB 1: EXECUTIVE ANALYTICS WITH SALES CHART */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        
                        {/* Weekly Sales Chart Card */}
                        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs lg:col-span-2 space-y-4">
                            <div className="flex items-center justify-between border-b pb-3">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                                        <span>Weekly Revenue & Sales Trend</span>
                                    </h3>
                                    <p className="text-[10px] text-slate-400">Peak ordering hours: {stats.peakHour}</p>
                                </div>
                                <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                    +18.4% Growth
                                </span>
                            </div>

                            {/* Simulated Bar Chart */}
                            <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-100">
                                {salesGraphData.map((bar, idx) => (
                                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                                        <div className="text-[9px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition">
                                            Rs {bar.revenue}
                                        </div>
                                        <div 
                                            className="w-full bg-gradient-to-t from-emerald-600 to-teal-500 rounded-t-lg transition-all duration-500 hover:brightness-110"
                                            style={{ height: `${(bar.revenue / 25000) * 120}px` }}
                                        ></div>
                                        <span className="text-[10px] font-bold text-slate-600">{bar.day}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Top Stores List */}
                            <div className="space-y-2 pt-1">
                                <div className="text-xs font-bold text-slate-800">Top Rated Merchant Stores</div>
                                {sellers.map((s, idx) => (
                                    <div 
                                        key={s.id} 
                                        onClick={() => { setSelectedStore(s); setShowStoreInspectorModal(true); }}
                                        className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center justify-between text-xs hover:bg-slate-100 transition cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img src={s.logo} alt={s.store} className="w-9 h-9 rounded-xl object-cover border border-slate-200" />
                                            <div>
                                                <div className="font-extrabold text-slate-900 flex items-center gap-1">
                                                    <span>{s.store}</span>
                                                    <span className="text-[9px] text-slate-400">({s.fssai})</span>
                                                </div>
                                                <div className="text-[10px] text-slate-500">{s.name} • {s.category}</div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="font-extrabold text-emerald-600">Rs {s.totalSales}</div>
                                            <div className="text-[10px] font-bold text-amber-600">⭐ {s.rating} Rating</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Control Box */}
                        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
                            <h3 className="text-sm font-bold text-slate-900 border-b pb-3 flex items-center gap-1.5">
                                <Settings className="w-4 h-4 text-emerald-600" />
                                <span>Master Admin Controls</span>
                            </h3>

                            <div className="space-y-2.5">
                                <button
                                    onClick={() => setShowAddSellerModal(true)}
                                    className="w-full p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition flex items-center justify-between cursor-pointer shadow-xs"
                                >
                                    <span className="flex items-center gap-2">
                                        <Plus className="w-4 h-4" />
                                        <span>Onboard Merchant Store</span>
                                    </span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={handleExportCSV}
                                    className="w-full p-3 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-2xl text-xs font-bold transition flex items-center justify-between cursor-pointer"
                                >
                                    <span className="flex items-center gap-2">
                                        <Download className="w-4 h-4 text-emerald-600" />
                                        <span>Download Platform Audit</span>
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                </button>
                            </div>
                        </div>

                    </div>
                )}

                {/* TAB 2: SELLERS / SHOPKEEPERS */}
                {activeTab === 'sellers' && (
                    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-3">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <Store className="w-4 h-4 text-teal-600" />
                                    <span>Registered Merchant Stores & Shopkeepers</span>
                                </h3>
                                <p className="text-[10px] text-slate-400">Click any store to inspect FSSAI licenses, menu items & phone contact</p>
                            </div>

                            <button
                                onClick={() => setShowAddSellerModal(true)}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add New Seller</span>
                            </button>
                        </div>

                        <div className="divide-y divide-slate-100 space-y-3">
                            {sellers.map(s => (
                                <div key={s.id} className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                    <div 
                                        onClick={() => { setSelectedStore(s); setShowStoreInspectorModal(true); }}
                                        className="flex items-center gap-3 cursor-pointer group"
                                    >
                                        <img src={s.logo} alt={s.store} className="w-10 h-10 rounded-xl object-cover border border-slate-200 group-hover:scale-105 transition" />
                                        <div>
                                            <div className="font-extrabold text-slate-900 group-hover:text-emerald-600 transition flex items-center gap-1.5">
                                                <span>{s.store}</span>
                                                <span className="text-[9px] px-1.5 py-0.2 bg-teal-50 text-teal-700 rounded border border-teal-200 font-semibold">
                                                    FSSAI: {s.fssai}
                                                </span>
                                            </div>
                                            <div className="text-[10px] text-slate-500">{s.name} • {s.email}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 justify-between sm:justify-end">
                                        <div>
                                            <div className="text-[10px] text-slate-400">Commission</div>
                                            <div className="font-bold text-amber-600">{s.commission}%</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-slate-400">Sales</div>
                                            <div className="font-extrabold text-emerald-600">Rs {s.totalSales}</div>
                                        </div>

                                        <button
                                            onClick={() => { setSelectedStore(s); setShowStoreInspectorModal(true); }}
                                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold transition cursor-pointer"
                                        >
                                            Inspect Store
                                        </button>

                                        <button
                                            onClick={() => toggleSellerStatus(s.id)}
                                            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                                                s.status === 'Active' ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                            }`}
                                        >
                                            {s.status === 'Active' ? 'Suspend' : 'Approve'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB 3: CUSTOMERS */}
                {activeTab === 'customers' && (
                    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
                        <div className="border-b pb-3">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <Users className="w-4 h-4 text-emerald-600" />
                                <span>Registered Customer Accounts</span>
                            </h3>
                            <p className="text-[10px] text-slate-400">Manage user status, edit Foodie Cash wallet balances, and grant promotional cash bonuses</p>
                        </div>

                        <div className="divide-y divide-slate-100 space-y-3">
                            {customers.map(c => (
                                <div key={c.id} className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                    <div className="flex items-center gap-3">
                                        <img src={c.avatar} alt={c.name} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                                        <div>
                                            <div className="font-extrabold text-slate-900">{c.name}</div>
                                            <div className="text-[10px] text-slate-500">{c.email} • {c.phone}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 justify-between sm:justify-end">
                                        <div>
                                            <div className="text-[10px] text-slate-400">Orders</div>
                                            <div className="font-bold text-slate-800">{c.orders}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-slate-400">Wallet Cash</div>
                                            <div className="font-extrabold text-emerald-600">Rs {c.wallet}.00</div>
                                        </div>

                                        <button
                                            onClick={() => handleGrantBonus(c.id, 100)}
                                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold transition cursor-pointer flex items-center gap-1"
                                            title="Grant Rs 100 Bonus Cash"
                                        >
                                            <Gift className="w-3 h-3" />
                                            <span>+Rs 100 Bonus</span>
                                        </button>

                                        <button
                                            onClick={() => {
                                                setSelectedCustomer(c);
                                                setWalletInput(c.wallet);
                                                setShowEditWalletModal(true);
                                            }}
                                            className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-[10px] font-bold hover:bg-amber-100 cursor-pointer"
                                        >
                                            Edit Wallet
                                        </button>

                                        <button
                                            onClick={() => toggleCustomerStatus(c.id)}
                                            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                                                c.status === 'Active' ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                            }`}
                                        >
                                            {c.status === 'Active' ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB 4: FOOD MENU */}
                {activeTab === 'products' && (
                    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
                        <div className="border-b pb-3">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4 text-amber-600" />
                                <span>Global Platform Food Menu</span>
                            </h3>
                            <p className="text-[10px] text-slate-400">Inspect dishes across all stores, toggle live stock, or remove items</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {products.map(p => (
                                <div key={p.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2.5">
                                        <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover" />
                                        <div>
                                            <div className="font-extrabold text-slate-900">{p.name}</div>
                                            <div className="text-[10px] text-teal-600 font-bold">{p.seller}</div>
                                            <div className="font-extrabold text-emerald-600 mt-0.5">Rs {p.price}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => toggleProductStock(p.id)}
                                            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold cursor-pointer ${
                                                p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                            }`}
                                        >
                                            {p.inStock ? 'IN STOCK' : 'OUT'}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(p.id)}
                                            className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB 5: ORDERS & LOGISTICS FEED */}
                {activeTab === 'orders' && (
                    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
                        <div className="border-b pb-3">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-emerald-600" />
                                <span>Real-Time Sales & Delivery Dispatch Feed</span>
                            </h3>
                            <p className="text-[10px] text-slate-400">Live order tracking with assigned delivery riders</p>
                        </div>

                        <div className="space-y-3">
                            {orders.map(o => (
                                <div key={o.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-extrabold text-slate-900">{o.id}</span>
                                            <span className="text-[10px] text-slate-400">• {o.date}</span>
                                        </div>
                                        <div className="text-slate-700 font-semibold">{o.customer} ➔ <span className="text-teal-600 font-bold">{o.seller}</span></div>
                                        <div className="text-[10px] text-slate-500 font-medium">Assigned Rider: <span className="text-slate-800 font-bold">{o.rider}</span></div>
                                    </div>

                                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                                        <div className="text-right">
                                            <div className="font-extrabold text-emerald-600">Rs {o.amount}</div>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                o.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                            }`}>
                                                {o.status}
                                            </span>
                                        </div>

                                        {o.status !== 'Delivered' && (
                                            <button
                                                onClick={() => handleForceDeliverOrder(o.id)}
                                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-bold transition cursor-pointer"
                                            >
                                                Force Delivered
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>

            {/* MERCHANT STORE INSPECTOR MODAL */}
            {showStoreInspectorModal && selectedStore && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-5 relative border border-slate-100 space-y-4 font-sans">
                        <button onClick={() => setShowStoreInspectorModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 border-b pb-3">
                            <img src={selectedStore.logo} alt={selectedStore.store} className="w-12 h-12 rounded-2xl object-cover border border-slate-200" />
                            <div>
                                <h3 className="text-base font-extrabold text-slate-900">{selectedStore.store}</h3>
                                <p className="text-[10px] text-slate-500">{selectedStore.name} • {selectedStore.email}</p>
                            </div>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                            <div className="flex justify-between">
                                <span className="text-slate-400">FSSAI License:</span>
                                <span className="font-extrabold text-slate-800">{selectedStore.fssai}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">GSTIN Number:</span>
                                <span className="font-extrabold text-slate-800">{selectedStore.gstin}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Total Sales:</span>
                                <span className="font-extrabold text-emerald-600">Rs {selectedStore.totalSales}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => alert(`Calling manager ${selectedStore.name} at ${selectedStore.phone}...`)}
                                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                            >
                                <PhoneCall className="w-4 h-4" />
                                <span>Call Merchant Manager</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ONBOARD SELLER MODAL */}
            {showAddSellerModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-5 relative border border-slate-100 space-y-3 font-sans">
                        <button onClick={() => setShowAddSellerModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
                            <X className="w-4 h-4" />
                        </button>
                        <h3 className="text-sm font-bold text-slate-800 border-b pb-2 flex items-center gap-1.5">
                            <Store className="w-4 h-4 text-emerald-600" />
                            <span>Onboard New Seller Store</span>
                        </h3>

                        <form onSubmit={handleAddSeller} className="space-y-3 text-xs">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Seller Name</label>
                                <input type="text" name="sellerName" required className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500" placeholder="Ramesh Kumar" />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Email</label>
                                <input type="email" name="sellerEmail" required className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500" placeholder="seller@foodie.com" />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Store Name</label>
                                <input type="text" name="storeName" required className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500" placeholder="Royal Punjab Kitchen" />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Category</label>
                                    <input type="text" name="category" defaultValue="North Indian" required className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500" />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Commission %</label>
                                    <input type="number" name="commission" defaultValue="15" required className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500" />
                                </div>
                            </div>

                            <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition cursor-pointer shadow-xs">
                                Confirm Onboarding
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT WALLET MODAL */}
            {showEditWalletModal && selectedCustomer && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-5 relative border border-slate-100 space-y-3 font-sans">
                        <button onClick={() => setShowEditWalletModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-sm font-bold text-slate-800 border-b pb-2 flex items-center gap-1.5">
                            <DollarSign className="w-4 h-4 text-amber-500" />
                            <span>Edit Foodie Cash Wallet</span>
                        </h3>

                        <form onSubmit={handleUpdateWallet} className="space-y-3 text-xs">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Wallet Cash (Rs) for {selectedCustomer.name}</label>
                                <input type="number" value={walletInput} onChange={(e) => setWalletInput(e.target.value)} required className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-emerald-500" />
                            </div>

                            <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition cursor-pointer shadow-xs">
                                Save Wallet Cash
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminMasterDashboard;
