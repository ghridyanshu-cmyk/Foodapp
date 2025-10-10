import React, { useContext } from 'react';
import { LuLeafyGreen } from "react-icons/lu";
import { GiChickenOven } from "react-icons/gi";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AddItem } from '../redux/cartSlice';
import axios from 'axios';

const Card = ({ name, image, id, price, type }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    const handleAddToCart = async () => {
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/cart/add`, {
                productId: id,
                qty: 1,
            }, { headers: { Authorization: `Bearer ${token}` }});

            const newItem = { id, name, price, image, type, qty: 1 };
            dispatch(AddItem(newItem));

            const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
            localCart.push(newItem);
            localStorage.setItem('cart', JSON.stringify(localCart));
        } catch (error) {
            console.error("Failed to add to cart:", error);
            if (error.response?.status === 401) navigate('/login');
        }
    };

    return (
        <div className='w-[300px] h-[400px] bg-white p-3 rounded-lg flex flex-col gap-3 shadow-lg hover:border-2 border-green-200'>
            <div className='w-full h-[60%] overflow-hidden rounded-lg'>
                <img src={image} alt={name} className='object-cover' />
            </div>
            <div className='text-2xl font-semibold'>{name}</div>
            <div className='w-full flex justify-between items-center'>
                <div className='text-lg font-bold text-green-500'>Rs {price}</div>
                <div className='flex justify-center items-center gap-2 text-green-500 text-bold text-lg'>
                    {type === "veg" ? <LuLeafyGreen /> : <GiChickenOven />}<span>{type}</span>
                </div>
            </div>
            <button className='w-full p-3 bg-green-500 hover:bg-green-400 rounded-lg text-white transition-all cursor-pointer' onClick={handleAddToCart}>
                Add to dish
            </button>
        </div>
    );
};

export default Card;
