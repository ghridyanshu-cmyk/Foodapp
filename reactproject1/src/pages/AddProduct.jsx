import React, { useState, useRef } from 'react';
import axios from 'axios';

const AddProduct = () => {
    const [productData, setProductData] = useState({
        name: '',
        price: '',
        qty: 1,
        type: '',
        category: '',
        id: ''
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
        } else {
            clearImage();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('name', productData.name);
        formData.append('price', productData.price);
        formData.append('qty', productData.qty);
        formData.append('type', productData.type);
        formData.append('id', productData.id);
        formData.append('category', productData.category);
        
        if (imageFile) {
            formData.append('image', imageFile); 
        } else {
             setError('Please select an image file.');
             setLoading(false);
             return;
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/product/addproduct`,
                formData,
                {withCredentials: true,}
            );
            
            console.log('Success:', response.data);
            alert('Product added successfully!');
            
            setProductData({ name: '', price: '', qty: 1, type: '', category: '', id: '' });
            clearImage();

        } catch (error) {
            console.error('Submission Error:', error);
            setError(error.response?.data?.message || 'Failed to add product. Check server logs.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-xl border border-gray-200">

                <h2 className="text-3xl font-extrabold text-[#00A63E] mb-8 text-center">
                    🛒 Add New Product
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="relative">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={productData.name}
                            onChange={handleTextChange}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                            placeholder="Product Name"
                        />
                    </div>

                    <div className="flex space-x-4">
                        <div className="w-1/3">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (Rs.)</label>
                            <input
                                type="number"
                                name="price"
                                id="price"
                                value={productData.price}
                                onChange={handleTextChange}
                                required
                                min="0.01"
                                step="0.01"
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                                placeholder="Price"
                            />
                        </div>
                        <div className="w-1/3">
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                            <input
                                type="text"
                                name="type"
                                id="type"
                                value={productData.type}
                                onChange={handleTextChange}
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                                placeholder="Veg/Non-Veg/Dessert"
                            />
                        </div>
                        <div className="w-1/3">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                            <input
                                type="text"
                                name="category"
                                id="category"
                                value={productData.category}
                                onChange={handleTextChange}
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                                placeholder="Pizza, Burger, Drinks, etc."
                            />
                        </div>
                    </div>
                    
                    <div className="relative">
                        <label htmlFor="qty" className="block text-sm font-medium text-gray-700">Quantity (Qty)</label>
                        <input
                            type="number"
                            name="qty"
                            id="qty"
                            value={productData.qty}
                            onChange={handleTextChange}
                            required
                            min="1"
                            step="1"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                            placeholder="1"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>

                        <div className="flex items-center space-x-4">

                            <div className="w-20 h-20 border border-gray-300 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
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
                                    name="file-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    ref={fileInputRef}
                                    className="sr-only"
                                    required
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-500 hover:bg-green-600 cursor-pointer transition duration-150"
                                >
                                    {imageFile ? "Change Image" : "Upload Image"}
                                </label>
                                {imageFile && (
                                    <button
                                        type="button"
                                        onClick={clearImage}
                                        className="ml-3 text-sm text-red-600 hover:text-red-800"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                        {imageFile && (
                            <p className="mt-2 text-xs text-gray-500">Selected File: **{imageFile.name}**</p>
                        )}
                    </div>

                    {error && (
                         <div className="text-red-600 text-sm p-3 bg-red-100 rounded-lg">{error}</div>
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
                            {loading ? 'Adding Product...' : '🚀 Save Product Details'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;