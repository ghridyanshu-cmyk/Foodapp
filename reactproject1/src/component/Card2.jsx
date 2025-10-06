import React, { useContext } from 'react'
import { MdAutoDelete } from "react-icons/md";
import { useDispatch } from 'react-redux';
import { DecreamentQty, IncreamentQty, RemoveItem } from '../redux/cartSlice';

import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // 🔑 Import AuthContext

const Card2 = ({ name, id, price, image, qty }) => {
    let dispatch = useDispatch();
    const { token } = useContext(AuthContext);

    const updateBackendCart = async (newQty) => {
        if (!token) {
            return false;
        }

        try {
            await axios.post('http://localhost:8000/api/v2/cart/add', {
                productId: id,
                qty: newQty - qty, // Calculate the difference to add or subtract
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return true;
        } catch (error) {
            console.error("Cart update failed on server:", error);
            return false;
        }
    };

    const handleQuantityChange = async (actionType) => {
        let newQty = qty;

        if (actionType === 'increment') {
            newQty = qty + 1;
        } else if (actionType === 'decrement' && qty > 1) {
            newQty = qty - 1;
        } else {
            return; // Block decreasing below 1
        }

        // 1. Sync with backend (send the new desired quantity change)
        // NOTE: Since the backend only accepts 'qty' for addition, we send the difference (1 or -1)
        const qtyDifference = newQty - qty; 
        
        try {
            await axios.post('http://localhost:8000/api/v2/cart/add', {
                productId: id,
                qty: qtyDifference,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // 2. If backend sync is successful, update Redux store
            if (actionType === 'increment') {
                dispatch(IncreamentQty(id));
            } else if (actionType === 'decrement' && qty > 1) {
                dispatch(DecreamentQty(id));
            }
        } catch (error) {
        }
    };

    const handleRemoveItem = async () => {
        if (!token) {
            return;
        }

        try {
            // API call to remove item
            await axios.delete(`http://localhost:8000/api/v2/cart/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // If backend removal is successful, update Redux
            dispatch(RemoveItem(id));

        } catch (error) {
            console.error("Item removal failed on server:", error);
        }
    };

    return (
        <div className='w-full h-[120px] p-2 shadow-lg flex justify-between'>
            <div className='w-[70%] h-full flex gap-5'>
                <div className='w-[60%] h-full overflow-hidden rounded-lg'>
                    <img src={image} alt={name} className='object-cover'/>
                </div>
                <div className='w-[40%] h-full flex flex-col gap-3'>
                    <div className='text-lg text-gray-500 font-semibold'>{ name}</div>
                    <div className='w-[110px] h-[50px] bg-slate-400 flex  rounded-lg overflow-hidden shadow-lg font-semibold border-2 border-green-400 text-xl'>
                        <button 
                            className='w-[30%] h-full bg-white flex justify-center items-center text-green-400 hover:bg-gray-200' 
                            onClick={() => handleQuantityChange('decrement')}
                        >
                            -
                        </button>
                        <span className='w-[40%] h-full bg-slate-200 flex justify-center items-center text-green-400'>{qty}</span>
                        <button 
                            className='w-[30%] h-full text-green-400 bg-white flex justify-center items-center hover:bg-gray-200' 
                            onClick={() => handleQuantityChange('increment')}
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>
            <div className='flex flex-col justify-start items-end gap-6'>
                <span className='text-xl text-green-400 font-semibold'>Rs { price}/-</span>
                <MdAutoDelete 
                    className='w-[30px] h-[30px] text-red-400 cursor-pointer' 
                    onClick={handleRemoveItem} 
                />
            </div>
        </div>
    )
}

export default Card2;