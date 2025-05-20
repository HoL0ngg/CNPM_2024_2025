import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Account from './account';
import PersonIcon from '@mui/icons-material/Person';


import { 
  Box, Typography, Drawer, List, ListItem, 
  ListItemIcon, ListItemText, IconButton, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Alert
} from '@mui/material';
import {
  ShoppingCart as OrderIcon,
  People as CustomerIcon,
  BarChart as StatisticIcon,
  Restaurant as FoodIcon,
  ExitToApp as LogoutIcon,
  FastfoodOutlined as BrandIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  VpnKey as PasswordIcon
} from '@mui/icons-material';
import '../css/admin.css';

// Import modules
import Orders from './order';
import Customers from './user';
import Products from './product';
import { toast, ToastContainer } from 'react-toastify';

const Admin = () => {
  const [currentTab, setCurrentTab] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [changePasswordDialog, setChangePasswordDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  const navigate = useNavigate();
  
  // Role-based access configuration
  const roleConfig = useMemo(() => ({
    admin: {
      allowedTabs: ['orders', 'customers', 'products', 'accounts'],
      defaultTab: 'orders'
    },
    clerk: {
      allowedTabs: ['orders', 'customers', 'products'],
      defaultTab: 'orders'
    },
    chef: {
      allowedTabs: ['products', 'orders'],
      defaultTab: 'products'
    }
  }), []);
  
  // Get user info once on component mount
  useEffect(() => {
    const userInfo = localStorage.getItem('adminUser');
    
    if (userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        setUser(parsedUser);
        
        // Set default tab based on role
        const userRole = parsedUser.role || 'admin';
        const config = roleConfig[userRole] || roleConfig.admin;
        setCurrentTab(config.defaultTab);
      } catch (error) {
        // Handle JSON parse error
        console.error("Failed to parse user info", error);
        navigate('/admin/login');
      }
    } else {
      navigate('/admin/login');
    }
  }, [navigate, roleConfig]);

  // Check if tab is allowed for current user role
  const isTabAllowed = useCallback((tab) => {
    if (!user?.role) return false;
    return roleConfig[user.role]?.allowedTabs.includes(tab) || false;
  }, [user, roleConfig]);

  // Password change handlers
  const handlePasswordChange = useCallback((e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleChangePasswordSubmit = useCallback(async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    
    // Validate password match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Mật khẩu mới và xác nhận không khớp');
      return;
    }
    
    // Validate password length
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    
    try {
      const response = await axios.post('/api/users/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      if (response.data.status) {
        // Reset form
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        toast.success(response.data.message,{
          position: 'top-right',
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        
        // Close dialog after success
        
      } else {
        setPasswordError(response.data.message || 'Không thể đổi mật khẩu');
      }
    } catch (error) {
      setPasswordError(error.response?.data?.message || 'Lỗi kết nối, vui lòng thử lại sau');
    }
  }, [passwordForm]);
  
  const closePasswordDialog = useCallback(() => {
    setChangePasswordDialog(false);
    setPasswordError('');
    setPasswordSuccess('');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  }, []);

  // Logout handler
  const handleLogout = useCallback(() => {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/admin/login');
  }, [navigate]);

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(prev => !prev);
  }, []);
  
  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);
  
  const handleTabChange = useCallback((tab) => {
    if (isTabAllowed(tab)) {
      setCurrentTab(tab);
    }
  }, [isTabAllowed]);
  
  // Render content based on selected tab
  const renderContent = useCallback(() => {
    // if (!user) return <div>Loading...</div>;

    // If current tab is not allowed, use default tab for role
    if (!isTabAllowed(currentTab)) {
      const defaultTab = roleConfig[user.role]?.defaultTab || 'orders';
      setCurrentTab(defaultTab);
      return <div>Loading...</div>;
    }

    switch (currentTab) {
      case 'orders': return <Orders />;
      case 'customers': return <Customers />;
      case 'products': return <Products />;
      case 'accounts': return <Account />;
      default: return <Orders />;
    }
  }, [currentTab, user, isTabAllowed, roleConfig]);

  // Drawer content with menu items based on role
  const drawerContent = useMemo(() => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        py: 2,
        flexDirection: sidebarCollapsed ? 'column' : 'row' 
      }}>
        <BrandIcon sx={{ color: '#ff5a5f', fontSize: 28, mr: sidebarCollapsed ? 0 : 1 }} />
        {!sidebarCollapsed && (
          <Typography variant="h6" sx={{ color: '#ff5a5f', fontWeight: 700 }}>
            OrderFood
          </Typography>
        )}
      </Box>
      
      {/* Menu Items */}
      <List sx={{ flexGrow: 1 }}>
        {/* Orders Tab */}
        {isTabAllowed('orders') && (
          <ListItem
            button
            onClick={() => handleTabChange('orders')}
            className={`drawer-list-item ${currentTab === 'orders' ? 'active' : ''}`}
          >
            <ListItemIcon className="drawer-list-icon">
              <OrderIcon />
            </ListItemIcon>
            {!sidebarCollapsed && (
              <ListItemText primary="Đơn hàng" className="drawer-list-text" />
            )}
          </ListItem>
        )}
        
        {/* Customers Tab */}
        {isTabAllowed('customers') && (
          <ListItem
            button
            onClick={() => handleTabChange('customers')}
            className={`drawer-list-item ${currentTab === 'customers' ? 'active' : ''}`}
          >
            <ListItemIcon className="drawer-list-icon">
              <CustomerIcon />
            </ListItemIcon>
            {!sidebarCollapsed && (
              <ListItemText primary="Khách hàng" className="drawer-list-text" />
            )}
          </ListItem>
        )}
        
        {/* Products Tab */}
        {isTabAllowed('products') && (
          <ListItem
            button
            onClick={() => handleTabChange('products')}
            className={`drawer-list-item ${currentTab === 'products' ? 'active' : ''}`}
          >
            <ListItemIcon className="drawer-list-icon">
              <FoodIcon />
            </ListItemIcon>
            {!sidebarCollapsed && (
              <ListItemText primary="Món ăn" className="drawer-list-text" />
            )}
          </ListItem>
        )}
        
        {/* Accounts Tab */}
        {isTabAllowed('accounts') && (
          <ListItem
            button
            onClick={() => handleTabChange('accounts')}
            className={`drawer-list-item ${currentTab === 'accounts' ? 'active' : ''}`}
          >
            <ListItemIcon className="drawer-list-icon">
              <PersonIcon />
            </ListItemIcon>
            {!sidebarCollapsed && (
              <ListItemText primary="Tài khoản" className="drawer-list-text" />
            )}
          </ListItem>
        )}
      </List>
      
      <Divider className="drawer-divider" />
      
      {/* User actions */}
      <List>
        {/* Change Password Button */}
        <ListItem button className="drawer-list-item" onClick={() => setChangePasswordDialog(true)}>
          <ListItemIcon className="drawer-list-icon">
            <PasswordIcon />
          </ListItemIcon>
          {!sidebarCollapsed && (
            <ListItemText primary="Đổi mật khẩu" className="drawer-list-text" />
          )}
        </ListItem>
        
        {/* Logout Button */}
        <ListItem button className="drawer-list-item" onClick={handleLogout}>
          <ListItemIcon className="drawer-list-icon">
            <LogoutIcon />
          </ListItemIcon>
          {!sidebarCollapsed && (
            <ListItemText primary="Đăng xuất" className="drawer-list-text" />
          )}
        </ListItem>
      </List>
      
      {/* Sidebar collapse toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
        <IconButton 
          onClick={toggleSidebar}
          className="collapse-button"
        >
          {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>
    </Box>
  ), [sidebarCollapsed, currentTab, isTabAllowed, handleTabChange, handleLogout, toggleSidebar]);

  // Show loading until user data is available
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <Box className="main-container">
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        className={`drawer ${sidebarCollapsed ? 'collapsed' : ''}`}
        classes={{
          paper: `drawer-paper ${sidebarCollapsed ? 'collapsed' : ''}`
        }}
        sx={{
          display: { xs: 'none', sm: 'block' }
        }}
      >
        {drawerContent}
      </Drawer>
      
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        className="drawer"
        classes={{
          paper: "drawer-paper"
        }}
        sx={{
          display: { xs: 'block', sm: 'none' }
        }}
      >
        {drawerContent}
      </Drawer>
      
      {/* Main Content */}
      <Box className={`content-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {renderContent()}
      </Box>

      {/* Change Password Dialog */}
      <Dialog 
        open={changePasswordDialog}
        onClose={closePasswordDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Đổi mật khẩu</DialogTitle>
        <form onSubmit={handleChangePasswordSubmit}>
          <DialogContent>
            <TextField
              margin="dense"
              name="currentPassword"
              label="Mật khẩu hiện tại"
              type="password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              fullWidth
              required
              autoComplete="current-password"
            />
            <TextField
              margin="dense"
              name="newPassword"
              label="Mật khẩu mới"
              type="password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              fullWidth
              required
              autoComplete="new-password"
            />
            <TextField
              margin="dense"
              name="confirmPassword"
              label="Xác nhận mật khẩu mới"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              fullWidth
              required
              autoComplete="new-password"
            />
            
            {passwordError && (
              <Alert severity="error" sx={{ mt: 2 }}>{passwordError}</Alert>
            )}
            
            {passwordSuccess && (
              <Alert severity="success" sx={{ mt: 2 }}>{passwordSuccess}</Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={closePasswordDialog}>Hủy</Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
            >
              Xác nhận
            </Button>
          </DialogActions>
        </form>
      </Dialog>

    </Box>
    <ToastContainer />
    </>

   
  );
};

export default Admin;