import React, { useContext } from 'react';
import { MdAutoDelete } from "react-icons/md";
import { useDispatch } from 'react-redux';
import { DecreamentQty, IncreamentQty, RemoveItem } from '../redux/cartSlice';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Card2 = ({ id, name, price, image, qty }) => {
  const dispatch = useDispatch();
  const { token } = useContext(AuthContext);

  const updateBackendCart = async (qtyDiff) => {
    if (!token) return false;
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/cart/add`, { productId: id, qty: qtyDiff }, { headers: { Authorization: `Bearer ${token}` }});
      return true;
    } catch { return false; }
  };

  const handleQuantityChange = async (action) => {
    let newQty = qty + (action === 'increment' ? 1 : -1);
    if (newQty < 1) return;
    const qtyDiff = newQty - qty;
    const success = await updateBackendCart(qtyDiff);
    if (!success) return;

    if (action === 'increment') dispatch(IncreamentQty(id));
    else dispatch(DecreamentQty(id));

    const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const index = localCart.findIndex(item => item.id === id);
    if (index !== -1) localCart[index].qty = newQty;
    localStorage.setItem('cart', JSON.stringify(localCart));
  };

  const handleRemoveItem = async () => {
    if (!token) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/cart/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      dispatch(RemoveItem(id));
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      localStorage.setItem('cart', JSON.stringify(localCart.filter(item => item.id !== id)));
    } catch {}
  };

  return (
    <div className='flex justify-between p-2 shadow-lg'>
      <div className='flex gap-5'>
        <img src={image} alt={name} className='w-24 h-24 object-cover rounded' />
        <div className='flex flex-col justify-between'>
          <div>{name}</div>
          <div className='flex'>
            <button onClick={() => handleQuantityChange('decrement')}>-</button>
            <span>{qty}</span>
            <button onClick={() => handleQuantityChange('increment')}>+</button>
          </div>
        </div>
      </div>
      <div className='flex flex-col justify-between items-end'>
        <span>Rs {price}/-</span>
        <MdAutoDelete onClick={handleRemoveItem} className='cursor-pointer text-red-500' />
      </div>
    </div>
  );
};

export default Card2;
