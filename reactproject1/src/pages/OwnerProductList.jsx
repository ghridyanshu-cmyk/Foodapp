import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Path set to: ../context/AuthContext
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Package, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const OwnerProductList = () => {
    const { token, isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Helper to fetch data ---
    const fetchProducts = async (userToken) => {
        if (!userToken) {
            setError("Authentication required.");
            setLoading(false);
            return;
        }

        try {
            // 🔑 UPDATED ENDPOINT: Now using the correct route defined in your backend
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/product/ownerproducts`, {
                headers: { 'Authorization': `Bearer ${userToken}` }
            });
            
            // The backend returns the products array under the 'data' key of the ApiResponse
            const fetchedProducts = response.data.data || [];
            setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);
            setError(null);

        } catch (err) {
            console.error("Fetch Error:", err);
            setError(err.response?.data?.message || "Failed to load products.");
            // If 401, redirect to login
            if (err.response?.status === 401 || err.response?.status === 403) {
                navigate('/owner/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(token);
    }, [token, navigate]);

    // --- Delete Handler ---
    const handleDelete = async (productId) => {
        // Use a non-blocking modal or custom confirmation UI instead of window.confirm in production
        if (!window.confirm("Are you sure you want to delete this product? This action is irreversible.")) {
            return;
        }

        try {
            // Securely send DELETE request with the product ID to the protected route
            await axios.delete(`${import.meta.env.VITE_API_URL}/product/delete/${productId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            toast.success("Product successfully deleted.");
            // Update local state by filtering out the deleted item
            setProducts(prevProducts => prevProducts.filter(p => p._id !== productId));

        } catch (err) {
            toast.error(err.response?.data?.message || "Deletion failed. Check privileges.");
            console.error("Delete Error:", err);
        }
    };

    if (!isLoggedIn || error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
                <h1 className="text-xl font-bold text-gray-800">{error || "Please log in to manage products."}</h1>
                <Link to="/owner-login" className="mt-4 px-6 py-2 bg-emerald-500 text-white rounded-lg">Go to Login</Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg font-semibold text-emerald-500">Loading Product List...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
    

            <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QTY</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img 
                                                    className="h-10 w-10 rounded object-cover" 
                                                    src={product.image} 
                                                    alt={product.name}
                                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/40x40/CCCCCC/ffffff?text=NoImg"; }}
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                <div className="text-xs text-gray-500">{product.type}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        Rs {product.price}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {product.qty}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="text-red-600 hover:text-red-900 transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5 inline" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-10 text-center text-gray-500 text-lg">
                                    <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                                    No products have been added yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OwnerProductList;