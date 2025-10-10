import React, { useState, useRef } from 'react';
import axios from 'axios';
import { CloudUpload, XCircle, DollarSign, Package } from 'lucide-react'; // Using lucide-react for icons

const AddProduct = () => {
    const [productData, setProductData] = useState({
        name: '',
        price: '',
        qty: 1,
        type: '',
        category: '',
        id: '' // Note: You might want to remove 'id' if MongoDB generates it
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null); // State for success messages

    const fileInputRef = useRef(null);

    const handleTextChange = (e) => {
        setProductData({ ...productData, [e.target.name]: e.target.value });
    };

    const clearImage = () => {
        setImageFile(null);
        setImagePreviewUrl('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreviewUrl(URL.createObjectURL(file));
            setError(null);
        } else {
            clearImage();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        const formData = new FormData();
        
        // Append all text fields
        Object.keys(productData).forEach(key => {
            formData.append(key, productData[key]);
        });
        
        // Input validation and file append
        if (imageFile) {
            // CRITICAL FIX: The field name 'image' MUST match the name used in Multer and the controller
            formData.append('image', imageFile); 
        } else {
            setError('Please select an image file.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                `${VITE_API_URL}/product/addproduct`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true // Important for sending cookies/auth tokens
                }
            );
            
            setSuccessMessage(response.data?.message || 'Product added successfully!');
            
            // Reset form data and image state
            setProductData({ name: '', price: '', qty: 1, type: '', category: '', id: '' });
            clearImage();

            // Clear success message after a few seconds
            setTimeout(() => setSuccessMessage(null), 3000);

        } catch (error) {
            console.error('Submission Error:', error.response?.data?.error || error);
            setError(error.response?.data?.message || 'Failed to add product. Please check server status and permissions.');
        } finally {
            setLoading(false);
        }
    };

    const InputField = ({ name, label, type = 'text', placeholder, icon: Icon, required = true, className = "", children }) => (
        <div className={className}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="mt-1 relative rounded-lg shadow-sm">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                )}
                <input
                    type={type}
                    name={name}
                    id={name}
                    value={productData[name]}
                    onChange={handleTextChange}
                    required={required}
                    min={type === 'number' ? 0 : undefined}
                    step={type === 'number' && name !== 'qty' ? "0.01" : undefined}
                    className={`block w-full border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2`}
                    placeholder={placeholder}
                />
                {children}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">

                <h2 className="text-3xl font-extrabold text-green-700 mb-8 text-center flex items-center justify-center space-x-2">
                    <Package className="w-8 h-8"/> <span>Add New Product</span>
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <InputField 
                        name="name" 
                        label="Product Name" 
                        placeholder="e.g., Pepperoni Pizza"
                        icon={Package}
                    />

                    <div className="flex space-x-4">
                        <InputField 
                            name="price" 
                            label="Price (Rs.)" 
                            type="number"
                            placeholder="9.99"
                            icon={DollarSign}
                            className="w-1/3"
                        />
                        <InputField 
                            name="type" 
                            label="Type" 
                            placeholder="Veg/Non-Veg/Dessert"
                            className="w-1/3"
                        />
                        <InputField 
                            name="category" 
                            label="Category" 
                            placeholder="Pizza, Burger, Drinks, etc."
                            className="w-1/3"
                        />
                    </div>
                    
                    <div className="flex space-x-4">
                         <InputField 
                            name="qty" 
                            label="Quantity (Stock)" 
                            type="number"
                            placeholder="100"
                            className="w-1/2"
                        />
                         <InputField 
                            name="id" 
                            label="Custom ID (Optional)" 
                            placeholder="SKU-001"
                            required={false}
                            className="w-1/2"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>

                        <div className="flex items-center space-x-4 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">

                            <div className="w-20 h-20 border border-gray-300 rounded-lg overflow-hidden flex-shrink-0 bg-white shadow-md">
                                {imagePreviewUrl ? (
                                    <img src={imagePreviewUrl} alt="Product Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs p-1 text-center">
                                        No Image
                                    </div>
                                )}
                            </div>

                            <div className="flex-grow">
                                <input
                                    id="file-upload"
                                    name="image" // CRITICAL: Name must be 'image' to match the backend
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    ref={fileInputRef}
                                    className="sr-only"
                                    required
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer transition duration-150"
                                >
                                    <CloudUpload className="w-5 h-5 mr-2" />
                                    {imageFile ? "Change Image" : "Select Image"}
                                </label>
                                {imageFile && (
                                    <button
                                        type="button"
                                        onClick={clearImage}
                                        className="ml-3 inline-flex items-center text-sm text-red-600 hover:text-red-800"
                                    >
                                        <XCircle className="w-4 h-4 mr-1" />
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                        {imageFile && (
                            <p className="mt-2 text-xs text-gray-500">Selected File: **{imageFile.name}**</p>
                        )}
                    </div>

                    {successMessage && (
                        <div className="text-green-700 text-sm p-3 bg-green-100 rounded-lg border border-green-300 animate-pulse">{successMessage}</div>
                    )}

                    {error && (
                        <div className="text-red-600 text-sm p-3 bg-red-100 rounded-lg border border-red-300">{error}</div>
                    )}
                    
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-semibold text-white transition duration-150 ${
                                loading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                            }`}
                        >
                            {loading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                '🚀 Save Product Details'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;