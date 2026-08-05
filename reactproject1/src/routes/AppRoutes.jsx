import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import OwnerRegister from '../pages/OwnerRegister';
import OwnerLogin from '../pages/OwnerLogin';
import AdminLogin from '../pages/AdminLogin';
import Payment from '../pages/Payment';
import Home from '../pages/Home';
import AddProduct from '../pages/AddProduct';
import Profile from '../pages/Profile';
import VideoReel from '../pages/VideoReel';
import OwnerProfile from '../pages/OwnerProfile';
import DashboardSelector from '../pages/Dashboard';
import OwnerProductList from '../pages/OwnerProductList';
import OwnerVideoList from '../pages/OwnerVideoList';
import AdminMasterDashboard from '../pages/AdminMasterDashboard';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/owner/register" element={<OwnerRegister />} />
      <Route path="/owner/login" element={<OwnerLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/addproduct" element={<AddProduct />} />
      <Route path="/userprofilepage" element={<Profile />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/vedioreel" element={<VideoReel />} />
      <Route path="/owner/profile" element={<OwnerProfile />} />
      <Route path="/dashboard" element={<DashboardSelector />} />
      <Route path="/owner/products" element={<OwnerProductList />} />
      <Route path="/owner/videos" element={<OwnerVideoList />} />
      <Route path="/admin/dashboard" element={<AdminMasterDashboard />} />
    </Routes>
  </Router>
);

export default AppRoutes;
