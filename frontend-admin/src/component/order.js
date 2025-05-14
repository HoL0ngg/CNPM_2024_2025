import React, { useEffect, useState } from 'react';
import {
  Typography, Paper, Box, TextField, InputAdornment, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogActions, DialogContent, DialogTitle, 
  FormControl, InputLabel, Select, MenuItem, Chip, Grid,
  Tabs, Tab, Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  LocalShipping as ShippingIcon
} from '@mui/icons-material';

const Order = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  // Sample orders data
  const orders = [
    { id: '#ORD001', customer: 'Nguyễn Văn A', date: '14/05/2025', status: 'completed', total: '120.000đ', phone: '0901234567', address: '123 Nguyễn Huệ, Q.1, TP.HCM', items: [
      { id: 1, name: 'Mỳ ý', quantity: 2, price: '30.000đ' },
      { id: 4, name: 'Nước ngọt', quantity: 2, price: '15.000đ' }
    ] },
    { id: '#ORD002', customer: 'Trần Thị B', date: '14/05/2025', status: 'shipping', total: '85.000đ', phone: '0912345678', address: '456 Lê Lợi, Q.1, TP.HCM', items: [
      { id: 2, name: 'Burger', quantity: 2, price: '25.000đ' },
      { id: 4, name: 'Nước ngọt', quantity: 1, price: '15.000đ' }
    ] },
    { id: '#ORD003', customer: 'Lê Văn C', date: '13/05/2025', status: 'completed', total: '210.000đ', phone: '0923456789', address: '789 Hai Bà Trưng, Q.3, TP.HCM', items: [
      { id: 5, name: 'Mỳ xào', quantity: 3, price: '20.000đ' },
      { id: 6, name: 'Cơm chiên', quantity: 2, price: '22.000đ' },
      { id: 7, name: 'Trà sữa', quantity: 3, price: '18.000đ' }
    ] },
    { id: '#ORD004', customer: 'Phạm Thị D', date: '13/05/2025', status: 'cancelled', total: '150.000đ', phone: '0934567890', address: '101 Võ Văn Tần, Q.3, TP.HCM', items: [
      { id: 8, name: 'Salad', quantity: 3, price: '35.000đ' },
      { id: 7, name: 'Trà sữa', quantity: 1, price: '18.000đ' }
    ] },
    { id: '#ORD005', customer: 'Hoàng Văn E', date: '12/05/2025', status: 'completed', total: '95.000đ', phone: '0945678901', address: '202 Điện Biên Phủ, Q.Bình Thạnh, TP.HCM', items: [
      { id: 3, name: 'Bánh tráng trộn', quantity: 3, price: '10.000đ' },
      { id: 4, name: 'Nước ngọt', quantity: 2, price: '15.000đ' },
      { id: 7, name: 'Trà sữa', quantity: 1, price: '18.000đ' }
    ] },
    { id: '#ORD006', customer: 'Tạ Văn F', date: '12/05/2025', status: 'pending', total: '88.000đ', phone: '0956789012', address: '303 Cách Mạng Tháng Tám, Q.10, TP.HCM', items: [
      { id: 6, name: 'Cơm chiên', quantity: 4, price: '22.000đ' }
    ] },
  ];

  useEffect(() => {
    
  }, []);

  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return { color: 'success', text: 'Đã giao' };
      case 'shipping': return { color: 'info', text: 'Đang giao' };
      case 'pending': return { color: 'warning', text: 'Chờ xử lý' };
      case 'cancelled': return { color: 'error', text: 'Đã hủy' };
      default: return { color: 'default', text: status };
    }
  };

  const filteredOrders = orders.filter(order => {
    return (
      (status === 'all' || order.status === status) &&
      (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
       order.customer.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="#333">
        Quản lý đơn hàng
      </Typography>

      <Paper sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            indicatorColor="primary"
            textColor="inherit"
            sx={{
              '& .MuiTab-root.Mui-selected': {
                color: '#ff5a5f',
              },
            }}
          >
            <Tab label="Tất cả đơn hàng" onClick={() => setStatus('all')} />
            <Tab label="Chờ xử lý" onClick={() => setStatus('pending')} />
            <Tab label="Đang giao" onClick={() => setStatus('shipping')} />
            <Tab label="Đã giao" onClick={() => setStatus('completed')} />
            <Tab label="Đã hủy" onClick={() => setStatus('cancelled')} />
          </Tabs>
        </Box>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <TextField
            placeholder="Tìm kiếm đơn hàng..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: '300px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã đơn hàng</TableCell>
                <TableCell>Khách hàng</TableCell>
                <TableCell>Ngày đặt</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Tổng tiền</TableCell>
                <TableCell align="right">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Chip 
                      label={getStatusColor(order.status).text}
                      color={getStatusColor(order.status).color}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell align="right">
                    <Button 
                      size="small" 
                      variant="outlined" 
                      sx={{ mr: 1 }}
                      onClick={() => handleOpenDialog(order)}
                      startIcon={<VisibilityIcon />}
                    >
                      Chi tiết
                    </Button>
                    
                    {order.status === 'pending' && (
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="primary"
                        startIcon={<ShippingIcon />}
                        sx={{ mr: 1 }}
                      >
                        Giao hàng
                      </Button>
                    )}
                    
                    {(order.status === 'pending' || order.status === 'shipping') && (
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="error"
                        startIcon={<CancelIcon />}
                      >
                        Hủy
                      </Button>
                    )}
                    
                    {order.status === 'shipping' && (
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        sx={{ mr: 1 }}
                      >
                        Hoàn tất
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* Order Detail Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Chi tiết đơn hàng {selectedOrder?.id}
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle1" fontWeight="bold">Thông tin khách hàng</Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1"><strong>Tên:</strong> {selectedOrder.customer}</Typography>
                  <Typography variant="body1"><strong>Điện thoại:</strong> {selectedOrder.phone}</Typography>
                  <Typography variant="body1"><strong>Địa chỉ:</strong> {selectedOrder.address}</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="subtitle1" fontWeight="bold">Thông tin đơn hàng</Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1">
                    <strong>Trạng thái:</strong> 
                    <Chip 
                      label={getStatusColor(selectedOrder.status).text}
                      color={getStatusColor(selectedOrder.status).color}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                  <Typography variant="body1"><strong>Ngày đặt:</strong> {selectedOrder.date}</Typography>
                  <Typography variant="body1"><strong>Tổng tiền:</strong> {selectedOrder.total}</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" fontWeight="bold">Chi tiết sản phẩm</Typography>
                <TableContainer sx={{ mt: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Sản phẩm</TableCell>
                        <TableCell align="center">Số lượng</TableCell>
                        <TableCell align="right">Giá</TableCell>
                        <TableCell align="right">Thành tiền</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell align="center">{item.quantity}</TableCell>
                          <TableCell align="right">{item.price}</TableCell>
                          <TableCell align="right">
                            {parseFloat(item.price.replace('.', '').replace('đ', '')) * item.quantity + 'đ'}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} align="right"><strong>Tổng cộng</strong></TableCell>
                        <TableCell align="right"><strong>{selectedOrder.total}</strong></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">Đóng</Button>
          
          {selectedOrder?.status === 'pending' && (
            <>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<ShippingIcon />}
              >
                Giao hàng
              </Button>
              <Button 
                variant="contained" 
                color="error"
                startIcon={<CancelIcon />}
              >
                Hủy đơn
              </Button>
            </>
          )}
          
          {selectedOrder?.status === 'shipping' && (
            <Button 
              variant="contained" 
              color="success"
              startIcon={<CheckCircleIcon />}
            >
              Hoàn tất đơn hàng
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Order;