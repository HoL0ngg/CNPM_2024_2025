import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Admin from './component/admin';
import Login from './component/login';
import './App.css';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

function App() {
  return (
   <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/admin/login" element={<Login />} />
        
        {/* Protected routes - chỉ truy cập được sau khi đăng nhập */}
        <Route path="/admin/*" element={
          <PrivateRoute>
            <Admin />
          </PrivateRoute>
        } />
        
        {/* Redirect từ / đến /admin */}
        <Route path="/" element={<Navigate to="/admin" />} />
      </Routes>
    </Router>
  );
}

export default App;