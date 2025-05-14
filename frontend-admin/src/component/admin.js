import React, { useState } from 'react';
import { 
  Box, Typography, AppBar, Toolbar, 
  Drawer, List, ListItem, ListItemIcon, ListItemText,
  IconButton, Avatar, Divider, Badge, TextField, InputAdornment
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ShoppingCart as OrderIcon,
  People as CustomerIcon,
  BarChart as StatisticIcon,
  Restaurant as FoodIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationIcon,
  ExitToApp as LogoutIcon,
  FastfoodOutlined as BrandIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import '../css/admin.css';

// Import các component tách biệt
import Orders from './order';
import Customers from './user';
import Statistics from './statictis';
import Products from './product';

const Admin = () => {
  const [currentTab, setCurrentTab] = useState('statistics');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  // Function để render nội dung dựa theo tab
  const renderContent = () => {
    switch (currentTab) {
      case 'orders':
        return <Orders />;
      case 'customers':
        return <Customers />;
      case 'statistics':
        return <Statistics />;
      case 'products':
        return <Products />;
      default:
        return <Statistics />;
    }
  };

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
      
      <List sx={{ flexGrow: 1 }}>
        <ListItem
          button
          onClick={() => setCurrentTab('orders')}
          className={`drawer-list-item ${currentTab === 'orders' ? 'active' : ''}`}
        >
          <ListItemIcon className="drawer-list-icon">
            <OrderIcon />
          </ListItemIcon>
          {!sidebarCollapsed && (
            <ListItemText primary="Đơn hàng" className="drawer-list-text" />
          )}
        </ListItem>
        
        <ListItem
          button
          onClick={() => setCurrentTab('customers')}
          className={`drawer-list-item ${currentTab === 'customers' ? 'active' : ''}`}
        >
          <ListItemIcon className="drawer-list-icon">
            <CustomerIcon />
          </ListItemIcon>
          {!sidebarCollapsed && (
            <ListItemText primary="Khách hàng" className="drawer-list-text" />
          )}
        </ListItem>
        
        <ListItem
          button
          onClick={() => setCurrentTab('products')}
          className={`drawer-list-item ${currentTab === 'products' ? 'active' : ''}`}
        >
          <ListItemIcon className="drawer-list-icon">
            <FoodIcon />
          </ListItemIcon>
          {!sidebarCollapsed && (
            <ListItemText primary="Sản phẩm" className="drawer-list-text" />
          )}
        </ListItem>
        
        <ListItem
          button
          onClick={() => setCurrentTab('statistics')}
          className={`drawer-list-item ${currentTab === 'statistics' ? 'active' : ''}`}
        >
          <ListItemIcon className="drawer-list-icon">
            <StatisticIcon />
          </ListItemIcon>
          {!sidebarCollapsed && (
            <ListItemText primary="Thống kê" className="drawer-list-text" />
          )}
        </ListItem>
      </List>
      
      <Divider className="drawer-divider" />
      
      <List>
        <ListItem button className="drawer-list-item">
          <ListItemIcon className="drawer-list-icon">
            <LogoutIcon />
          </ListItemIcon>
          {!sidebarCollapsed && (
            <ListItemText primary="Đăng xuất" className="drawer-list-text" />
          )}
        </ListItem>
      </List>
      
      {/* Nút thu phóng sidebar */}
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
        <IconButton 
          onClick={toggleSidebar}
          className="collapse-button"
        >
          {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>
    </Box>
  );

  return (
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
        {drawer}
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
        {drawer}
      </Drawer>
      
      <Box className={`content-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default Admin;