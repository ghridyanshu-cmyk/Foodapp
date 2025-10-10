import React, { useContext } from 'react';
import { MdAutoDelete } from "react-icons/md";
import { useDispatch } from 'react-redux';
import { DecreamentQty, IncreamentQty, RemoveItem } from '../redux/cartSlice';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Card2 = ({ product }) => {
    const { id, name, price, image, qty } = product;
    const dispatch = useDispatch();
    const { token } = useContext(AuthContext);

    const handleQuantityChange = async (type) => {
        if (!token) return;
        let newQty = type === 'increment' ? qty + 1 : qty > 1 ? qty - 1 : qty;
        if (newQty === qty) return;

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/v2/cart/add`, { productId: id, qty: newQty - qty }, { headers: { Authorization: `Bearer ${token}` } });
            type === 'increment' ? dispatch(IncreamentQty(id)) : dispatch(DecreamentQty(id));
        } catch (error) {
            console.error("Failed to update cart:", error);
        }
    };

    const handleRemoveItem = async () => {
        if (!token) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/v2/cart/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            dispatch(RemoveItem(id));
        } catch (error) {
            console.error("Failed to remove item:", error);
        }
    };

    return (
        <div className='w-full h-[120px] p-2 shadow-lg flex justify-between'>
            <div className='w-[70%] h-full flex gap-5'>
                <div className='w-[60%] h-full overflow-hidden rounded-lg'>
                    <img src={image} alt={name} className='object-cover w-full h-full'/>
                </div>
                <div className='w-[40%] h-full flex flex-col gap-3'>
                    <div className='text-lg text-gray-500 font-semibold'>{name}</div>
                    <div className='w-[110px] h-[50px] bg-slate-400 flex rounded-lg overflow-hidden shadow-lg font-semibold border-2 border-green-400 text-xl'>
                        <button className='w-[30%] h-full bg-white flex justify-center items-center text-green-400 hover:bg-gray-200' onClick={() => handleQuantityChange('decrement')}>-</button>
                        <span className='w-[40%] h-full bg-slate-200 flex justify-center items-center text-green-400'>{qty}</span>
                        <button className='w-[30%] h-full text-green-400 bg-white flex justify-center items-center hover:bg-gray-200' onClick={() => handleQuantityChange('increment')}>+</button>
                    </div>
                </div>
            </div>
            <div className='flex flex-col justify-start items-end gap-6'>
                <span className='text-xl text-green-400 font-semibold'>Rs {price}/-</span>
                <MdAutoDelete className='w-[30px] h-[30px] text-red-400 cursor-pointer' onClick={handleRemoveItem} />
            </div>
        </div>
    );
};

export default Card2;
