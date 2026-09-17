import React, { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { setCartItems } from '../redux/cartSlice';
import { MapPin, Phone, User, CheckCircle2, ShoppingBag, ArrowLeft, CreditCard, Banknote, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const createRazorpayOrder = async (amountInPaise, token) => {
    try {
        console.log(`Mocking backend order creation for amount: ${amountInPaise / 100}`);
        return `order_MOCKID_${Date.now()}`;
    } catch (error) {
        console.error("Backend Order Creation Failed:", error);
        throw new Error("Order initialization failed.");
    }
};

const paymentOptions = [
    { label: 'Cash on Delivery', icon: '💵', desc: 'Pay cash when food arrives' },
    { label: 'UPI / QR', icon: '📱', desc: 'GPay, PhonePe, Paytm' },
    { label: 'Cards', icon: '💳', desc: 'Credit / Debit Cards' },
    { label: 'Net Banking', icon: '🏦', desc: 'All Indian Banks' },
];

const Payment = () => {
    const { token, userData } = useContext(AuthContext);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const items = useSelector(state => state.cart);
    const subTotal = items.reduce((total, item) => total + (item.qty || 1) * item.price, 0);
    const deliveryFee = items.length > 0 ? 20 : 0;
    const taxes = Math.round(subTotal * 0.05);
    const total = Math.floor(subTotal + deliveryFee + taxes);

    const [selectedOption, setSelectedOption] = useState('Cash on Delivery');
    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    // Delivery Location / Address Form State
    const [deliveryAddress, setDeliveryAddress] = useState({
        fullName: userData?.name || '',
        phone: userData?.phone || '',
        street: userData?.address || '',
        city: 'New Delhi',
        pincode: '110001',
    });

    useEffect(() => {
        if (userData) {
            setDeliveryAddress(prev => ({
                ...prev,
                fullName: userData.name || prev.fullName,
                street: userData.address || prev.street,
            }));
        }
    }, [userData]);

    // Cards form state 
    const [cardNo, setCardNo] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    // Net Banking form state
    const [accountNumber, setAccountNumber] = useState('');
    const [holderName, setHolderName] = useState('');
    const [bank, setBank] = useState('');

    // UPI form state
    const [upiId, setUpiId] = useState('');

    const handleAddressChange = (e) => {
        setDeliveryAddress({ ...deliveryAddress, [e.target.name]: e.target.value });
    };

    const handlePay = async (e) => {
        e.preventDefault();
        if (loading) return;

        if (!deliveryAddress.street.trim() || !deliveryAddress.phone.trim()) {
            alert("Please enter a valid delivery address and phone number.");
            return;
        }

        setLoading(true);

        // --- CASH ON DELIVERY FLOW ---
        if (selectedOption === 'Cash on Delivery') {
            setTimeout(() => {
                setLoading(false);
                setOrderSuccess(true);
                dispatch(setCartItems([]));
                localStorage.removeItem('cart');
            }, 1200);
            return;
        }

        // --- ONLINE PAYMENTS (Razorpay / Cards / UPI / NetBanking) ---
        if (typeof window.Razorpay === 'undefined') {
            alert("Razorpay SDK failed to load. Defaulting to Order Confirmation.");
            setLoading(false);
            setOrderSuccess(true);
            dispatch(setCartItems([]));
            localStorage.removeItem('cart');
            return;
        }

        const amountInPaise = total * 100;
        try {
            const order_id = await createRazorpayOrder(amountInPaise, token);
            const options = {
                key: 'rzp_test_XXXXXXXXXXXXXX',
                amount: amountInPaise,
                currency: "INR",
                name: "Foodie App",
                description: `Food Order for ${deliveryAddress.fullName}`,
                order_id: order_id,
                handler: function (response) {
                    setOrderSuccess(true);
                    dispatch(setCartItems([]));
                    localStorage.removeItem('cart');
                },
                prefill: {
                    name: deliveryAddress.fullName,
                    contact: deliveryAddress.phone,
                },
                theme: { color: "#10B981" }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function () {
                alert("Payment was unsuccessful. Please try again.");
            });
            rzp.open();
        } catch (error) {
            console.error("Payment error:", error);
            alert("Payment error. Please try Cash on Delivery.");
        } finally {
            setLoading(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-5 border border-emerald-100">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-800">Order Placed Successfully!</h2>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        Your food is being prepared and will be delivered to:
                        <br />
                        <span className="font-bold text-gray-700">{deliveryAddress.street}, {deliveryAddress.city}</span>
                    </p>
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-700 text-xs font-semibold">
                        {selectedOption === 'Cash on Delivery' 
                            ? '💵 Payment Mode: Cash on Delivery (Pay Rs ' + total + ' to delivery agent)' 
                            : '💳 Payment Mode: Paid Online'}
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition cursor-pointer text-sm"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 py-8 px-4 font-sans text-gray-800">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Top Navigation */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-emerald-600 transition cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Cart</span>
                    </button>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Secure Checkout</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Left Column: Delivery Location & Payment Method */}
                    <div className="md:col-span-2 space-y-6">

                        {/* 1. Delivery Location Option */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-4">
                            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                                <MapPin className="w-5 h-5 text-emerald-600" />
                                <h3 className="text-base font-bold text-gray-800">Delivery Address</h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Recipient Name</label>
                                    <div className="relative">
                                        <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={deliveryAddress.fullName}
                                            onChange={handleAddressChange}
                                            required
                                            placeholder="Your Full Name"
                                            className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={deliveryAddress.phone}
                                            onChange={handleAddressChange}
                                            required
                                            placeholder="+91 9876543210"
                                            className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Street Address / Landmark</label>
                                    <input
                                        type="text"
                                        name="street"
                                        value={deliveryAddress.street}
                                        onChange={handleAddressChange}
                                        required
                                        placeholder="House / Flat No., Street, Landmark"
                                        className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={deliveryAddress.city}
                                        onChange={handleAddressChange}
                                        placeholder="City"
                                        className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Pincode</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={deliveryAddress.pincode}
                                        onChange={handleAddressChange}
                                        placeholder="Pincode"
                                        className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Payment Method Selector */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-4">
                            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                                <CreditCard className="w-5 h-5 text-emerald-600" />
                                <h3 className="text-base font-bold text-gray-800">Select Payment Method</h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {paymentOptions.map(opt => (
                                    <label
                                        key={opt.label}
                                        onClick={() => setSelectedOption(opt.label)}
                                        className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition border ${
                                            selectedOption === opt.label
                                                ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                                                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                        }`}
                                    >
                                        <span className="text-2xl">{opt.icon}</span>
                                        <div className="flex-1">
                                            <div className="text-xs font-bold text-gray-800">{opt.label}</div>
                                            <div className="text-[10px] text-gray-500">{opt.desc}</div>
                                        </div>
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={selectedOption === opt.label}
                                            readOnly
                                            className="accent-emerald-600"
                                        />
                                    </label>
                                ))}
                            </div>

                            {/* Specific Option Details */}
                            {selectedOption === 'Cash on Delivery' && (
                                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs space-y-1">
                                    <div className="font-bold flex items-center gap-1.5">
                                        <Banknote className="w-4 h-4 text-amber-600" />
                                        <span>Cash on Delivery Selected</span>
                                    </div>
                                    <p className="text-[11px] text-amber-700">
                                        Pay exact cash of <strong className="text-emerald-700">Rs {total}</strong> to the delivery rider when your food arrives.
                                    </p>
                                </div>
                            )}

                            {selectedOption === 'UPI / QR' && (
                                <div className="space-y-2 pt-2">
                                    <label className="block text-xs font-semibold text-gray-600">UPI ID</label>
                                    <input
                                        type="text"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                        placeholder="yourname@upi"
                                        className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            )}

                            {selectedOption === 'Cards' && (
                                <div className="space-y-3 pt-2">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Card Number</label>
                                        <input
                                            type="text"
                                            value={cardNo}
                                            onChange={(e) => setCardNo(e.target.value)}
                                            placeholder="4532 1234 5678 9010"
                                            className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-1/2">
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">Expiry</label>
                                            <input
                                                type="text"
                                                value={expiry}
                                                onChange={(e) => setExpiry(e.target.value)}
                                                placeholder="MM/YY"
                                                className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">CVV</label>
                                            <input
                                                type="text"
                                                value={cvv}
                                                onChange={(e) => setCvv(e.target.value)}
                                                placeholder="123"
                                                className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-4">
                            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                                <h3 className="text-base font-bold text-gray-800">Order Summary</h3>
                            </div>

                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {items.map(item => (
                                    <div key={item.id} className="flex justify-between items-center text-xs">
                                        <span className="text-gray-700 font-semibold line-clamp-1">{item.qty}x {item.name}</span>
                                        <span className="text-gray-900 font-bold">Rs {item.price * item.qty}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 pt-3 space-y-1.5 text-xs text-gray-600">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-gray-800">Rs {subTotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery Fee</span>
                                    <span className="font-semibold text-gray-800">Rs {deliveryFee}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Taxes (5%)</span>
                                    <span className="font-semibold text-gray-800">Rs {taxes}</span>
                                </div>
                                <div className="flex justify-between text-base font-extrabold text-gray-900 border-t border-gray-100 pt-2">
                                    <span>Total Amount</span>
                                    <span className="text-emerald-600">Rs {total}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePay}
                                disabled={loading || items.length === 0}
                                className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm bg-emerald-600 hover:bg-emerald-700 active:scale-98 shadow-md flex items-center justify-center gap-2 transition cursor-pointer ${
                                    loading ? 'opacity-60 cursor-wait' : ''
                                }`}
                            >
                                {loading ? 'Processing Order...' : selectedOption === 'Cash on Delivery' ? 'Confirm Order (COD)' : `Pay Rs ${total}`}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Payment;
