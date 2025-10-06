import React, { useContext } from 'react';
import { LuLeafyGreen } from "react-icons/lu";
import { GiChickenOven } from "react-icons/gi";
import { AddItem } from '../redux/cartSlice';
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';


import axios from 'axios';


const Card = ({ name, image, id, price, type }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Access token and login status from context
    const {token, isLoggedIn} = useContext(AuthContext);
    
    // console.log is moved inside the logic flow for clarity
    
    const handleAddToCart = async () => {
        if (!token) {
            // toast removed
            
            // 🚨 FIX: Navigate directly without unnecessary setTimeout
            navigate('/login');
            
            return;
        }
        
        // Log token usage only when action is secure (user is logged in)
        console.log("Using token:", token ? token.substring(0, 15) + '...' : 'null');
        
        try {
            // 1. Send authenticated request to the backend
            await axios.post('http://localhost:8000/api/v2/cart/add', {
                productId: id,
                qty: 1,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            // 2. Update local state only after successful server response
            dispatch(AddItem({ id, name, price, image, type, qty: 1 }));
            // toast removed
            
        } catch (error) {
            console.error("Failed to add to server cart:", error);
            // Check for 401 Unauthorized errors from backend and redirect if needed
            if (error.response && error.response.status === 401) {
                 // toast removed
                 navigate('/login');
            } else {
                 // toast removed
            }
        }
    };

    return (
        <div className='w-[300px] h-[400px] bg-white p-3 rounded-lg flex flex-col gap-3 shadow-lg hover:border-2 border-green-200'>
            <div className='w-full h-[60%] overflow-hidden rounded-lg'>
                <img src={image} alt={name} className='object-cover ' />
            </div>
            <div className='text-2xl font-semibold'>
                {name}
            </div>
            <div className='w-full flex justify-between items-center'>
                <div className='text-lg font-bold text-green-500'>Rs {price }</div>
                <div className='flex justify-center items-center gap-2 text-green-500 text-bold text-lg'>{type === "veg" ? <LuLeafyGreen /> :<GiChickenOven />}<span>{type}</span></div>
            </div>
            <div>
                <button 
                    className='w-full p-3 bg-green-500 hover:bg-green-400 rounded-lg text-white transition-all cursor-pointer' 
                    onClick={handleAddToCart}>
                    Add to dish
                </button>
            </div>
        </div>
    );
}

export default Card
