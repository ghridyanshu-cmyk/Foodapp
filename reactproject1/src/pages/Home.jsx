import React, { useContext, useState, useEffect } from 'react';
import Nav from '../component/Nav';
import Categories from '../Category';
import Card from '../component/Card';
import { dataContext } from '../context/UserContext';
import { RxCross1 } from "react-icons/rx";
import Card2 from '../component/Card2';
import { useSelector, useDispatch } from 'react-redux';
import { AuthContext } from '../context/AuthContext'; 
import { setCartItems } from '../redux/cartSlice'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    let { cate, setCate, input, showCart, setShowCart } = useContext(dataContext);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const { token } = useContext(AuthContext); 
    const dispatch = useDispatch();

    // 1. Fetch ALL products (Display Logic)
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/product/`);
                setProducts(res.data.products || []);
                setFilteredProducts(res.data.products || []);
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };
        fetchProducts();
    }, []);

    // 2. Fetch USER'S CART (Persistence Logic)
    useEffect(() => {
        const fetchUserCart = async () => {
            if (!token) {
                dispatch(setCartItems([])); 
                return;
            }

            try {
             const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v2/cart/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                // Normalize and dispatch server data to Redux
                const normalizedCartItems = res.data.cartItems.map(item => ({
                    id: item.productId._id, 
                    name: item.productId.name,
                    price: item.productId.price,
                    image: item.productId.image,
                    type: item.productId.type,
                    qty: item.qty
                }));

                dispatch(setCartItems(normalizedCartItems));

            } catch (err) {
                console.error("Error fetching user cart:", err);
                // Clear local cart if fetch fails (e.g., token expired)
               dispatch( setCartItems([]));
            }
        };

        fetchUserCart();
    }, [token, dispatch]); 


    // Combined filter: by search input and selected category
    useEffect(() => {
        let filtered = products;
        if (selectedCategory && selectedCategory !== 'All') {
            filtered = filtered.filter(item => item.category === selectedCategory);
        }
        if (input) {
            const search = input.toLowerCase();
            filtered = filtered.filter(
                (item) =>
                    item.name.toLowerCase().includes(search) ||
                    (item.category && item.category.toLowerCase().includes(search))
            );
        }
        setFilteredProducts(filtered);
    }, [input, products, selectedCategory]);

    // Category click handler
    function handleCategoryClick(category) {
        setSelectedCategory(category);
    }

    let items = useSelector(state => state.cart);
    let subTotal = items.reduce((total, item) => total + item.qty * item.price, 0);
    let deliveryFee = 20;
    let taxes = subTotal * 0.5 / 100;
    let total = Math.floor(subTotal + deliveryFee + taxes);

    return (
        <div className=' bg-slate-200 w-full min-h-[100vh]'>
            <Nav />

            {/* Categories */}
            <div className='flex flex-wrap justify-center items-center gap-5 w-[100%] '>
                {Categories.map((item) => (
                    <div key={item.name}
                        className={`w-[140px] h-[150px] bg-white flex flex-col items-start gap-5 p-5 justify-start text-[20px] font-semibold text-gray-600 rounded-lg shadow-xl hover:bg-green-200 cursor-pointer transition-all duration-200 ${selectedCategory === item.name ? 'border-2 border-green-500' : ''}`}
                        onClick={() => handleCategoryClick(item.name)} >
                        {item.icon}
                        {item.name}
                    </div>
                ))}
            </div>

            {/* Products */}
            <div className='w-full flex flex-wrap gap-5 px-5 justify-center items-center pt-8 pb-8'>
                {filteredProducts.length > 0 ? filteredProducts.map((item) => (
                    <Card key={item._id} name={item.name} image={item.image} price={item.price} id={item._id} type={item.type} /> 
                )) : <div className='text-8xl text-green-300 flex justify-center items-center pt-[200px]'>Not Found...</div>}
            </div>
            
            {/* Cart Sidebar */}
            <div className={`w-[100%] md:w-[40vw] h-[100%] fixed top-0 right-0 bg-white shadow-xl p-6 ${showCart ? "translate-x-0" : "translate-x-full"} transition-all duration-500 flex flex-col items-center overflow-auto`}>
                <header className='w-[100%] flex justify-between items-center '>
                    <span className='text-green-400 text-[18px] font-semibold'>Order items</span>
                    <RxCross1 className=' w-[30px] h-[20px] text-green-400 text-[18px] font-semibold cursor-pointer hover:text-gray-600' onClick={() => setShowCart(false)} />
                </header>
                {items.length > 0 ? <>
                    <div className='w-full mt-9 flex flex-col gap-8'>
                        {items.map((item) => (
                            <Card2 key={item.id} name={item.name} price={item.price} image={item.image} id={item.id} qty={item.qty} />
                        ))}
                    </div>
                    
                    <div className='w-full border-t-2 border-b-2 border-gray-400 mt-7 flex flex-col gap-2 p-8'>
                        <div className='w-full flex justify-between items-center'>
                            <span className='text-lg text-gray-600 font-semibold'>SubTotal</span>
                            <span className='text-green-400 font-semibold text-lg'>Rs {subTotal}/-</span>
                        </div>
                        <div className='w-full flex justify-between items-center'>
                            <span className='text-lg text-gray-600 font-semibold'>Delivery Fee</span>
                            <span className='text-green-400 font-semibold text-lg'>Rs {deliveryFee}/-</span>
                        </div>
                        <div className='w-full flex justify-between items-center'>
                            <span className='text-lg text-gray-600 font-semibold'>Taxes</span>
                            <span className='text-green-400 font-semibold text-lg'>Rs {taxes}/-</span>
                        </div>
                    </div>
                    <div className='w-full flex justify-between items-center p-9'>
                        <span className='text-2xl text-gray-600 font-semibold'>Total</span>
                        <span className='text-green-400 font-semibold text-2xl'>Rs {total}/-</span>
                    </div>
                    <button className='w-[80%] p-3 bg-green-500 hover:bg-green-400 rounded-lg text-white transition-all cursor-pointer'onClick={()=>navigate("/payment")}>Place Order</button>
                </> : <div className='text-center text-2xl text-green-500 font-semibold pt-5'>Empty Cart</div>}

            </div>
        </div>
    );
};

export default Home;
