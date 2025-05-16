// src/components/PrivateRoute.jsx (trong fe-admin)
import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/auth';

const PrivateRoute = ({ children }) => {
  // Kiểm tra xem người dùng đã đăng nhập chưa
  const isLoggedIn = authService.isLoggedIn();

  if (!isLoggedIn) {
    // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
    return <Navigate to="/admin/login" />;
  }

  // Nếu đã đăng nhập, hiển thị component con
  return children;
};

export default PrivateRoute;