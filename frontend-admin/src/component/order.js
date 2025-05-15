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
import axios from 'axios';
import '../css/detailOrder.css';

const Order = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [orders, setOrders] = useState([]);

  const getData = async () => {
    const reponse = await axios.get('/order');
    const result = reponse.data;
    console.log(result.data);
    setOrders(result.data);
  }

  useEffect(() => {
    getData();
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
      case 'Đã hoàn thành': return { color: 'success', text: 'Đã hoàn thành' };
      case 'Đang nấu': return { color: 'info', text: 'Đang nấu' };
      case 'Chờ xử lý': return { color: 'warning', text: 'Chờ xử lý' };
      case 'Đã hủy': return { color: 'error', text: 'Đã hủy' };
      default: return { color: 'default', text: status };
    }
  };

  const filteredOrders = orders.filter(order => {
  
    const statusMatch = status === '' ? true : order.status === status;

    const searchTermMatch = searchTerm === '' ? true : (
      order.id.toString().includes(searchTerm) ||
      order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.phone?.includes(searchTerm)
    );
    
    return statusMatch && searchTermMatch;
  });

  const processOrderDetails = (detailOrders) => {
    // Tạo một object để nhóm các chi tiết theo productId
    const groupedItems = {};
    
    // Nhóm các chi tiết theo productId
    detailOrders.forEach(item => {
      const key = item.productId;
      
      if (!groupedItems[key]) {
        // Nếu sản phẩm chưa tồn tại trong nhóm, tạo mới
        groupedItems[key] = {
          productId: item.productId,
          productName: item.product.name,
          quantity: item.quantityProduct,
          price: item.priceProduct,
          baseTotal: item.priceProduct * item.quantityProduct,
          toppings: []
        };
      }
      
      // Nếu không phải dummy topping (toppingId = 0)
      if (item.toppingId !== 0) {
        // Thêm topping vào sản phẩm
        groupedItems[key].toppings.push({
          id: item.toppingId,
          name: item.topping.name,
          price: item.priceTopping
        });
      }
    });
    
    // Chuyển đổi object thành mảng để render
    return Object.values(groupedItems);
  };

  const handleUpdate = async (order) => {
    const response = await axios.put(`/order`, order, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response.data);
    getData();
    
  }

  const handleCancel = async (order) => {
   const response = await axios.put(`/order/cancel`, order, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response.data);
    getData();
  }

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
            <Tab label="Tất cả đơn hàng" onClick={() => setStatus('')} />
            <Tab label="Chờ xử lý" onClick={() => setStatus('Chờ xử lý')} />
            <Tab label="Đang nấu" onClick={() => setStatus('Đang nấu')} />
            <Tab label="Đã hoàn thành" onClick={() => setStatus('Đã hoàn thành')} />
            <Tab label="Đã hủy" onClick={() => setStatus('Đã hủy')} />
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
                  <TableCell>{order.customer.name}</TableCell>
                  <TableCell>{order.created_at}</TableCell>
                  <TableCell>
                    <Chip 
                      label={getStatusColor(order.status).text}
                      color={getStatusColor(order.status).color}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{order.totalPrice}</TableCell>
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
                    
                    {order.status === 'Chờ xử lý' && (
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="primary"
                        startIcon={<ShippingIcon />}
                        sx={{ mr: 1 }}
                        onClick = {() => handleUpdate(order)}
                      >
                        Chấp nhận
                      </Button>
                    )}
                    
                    {(order.status === 'Chờ xử lý' || order.status === 'Đang nấu') && (
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick ={() => handleCancel(order)}
                      >
                        Hủy
                      </Button>
                    )}
                    
                    {order.status === 'Đang nấu' && (
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        sx={{ mr: 1 }}
                        onClick = {() => handleUpdate(order)}
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
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        className="order-detail-dialog"
        sx={{
          '& .MuiDialog-paper': {
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '85vh',
          }
        }}
      >
        <DialogTitle>
          Chi tiết đơn hàng {selectedOrder?.id}
        </DialogTitle>
        <DialogContent sx={{ 
          overflow: 'auto', 
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: 0,
          flex: 1
        }}>
          {selectedOrder && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box className="customer-info-section">
                  <Typography variant="subtitle1" className="info-title">Thông tin khách hàng</Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" className="info-row">
                      <span className="info-label">Tên:</span> {selectedOrder.customer.name}
                    </Typography>
                    <Typography variant="body1" className="info-row">
                      <span className="info-label">Điện thoại:</span> {selectedOrder.customer.phone}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={6}>
                <Box className="order-info-section">
                  <Typography variant="subtitle1" className="info-title">Thông tin đơn hàng</Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" className="info-row">
                      <span className="info-label">Trạng thái:</span> 
                      <Chip 
                        label={getStatusColor(selectedOrder.status).text}
                        color={getStatusColor(selectedOrder.status).color}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                    <Typography variant="body1" className="info-row">
                      <span className="info-label">Ngày đặt:</span> {selectedOrder.created_at}
                    </Typography>
                    <Typography variant="body1" className="info-row">
                      <span className="info-label">Ngày cập nhật:</span> {selectedOrder.updated_at}
                    </Typography>
                    <Typography variant="body1" className="info-row">
                      <span className="info-label">Tổng tiền:</span> {selectedOrder.totalPrice}đ
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} className="product-details-section">
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" className="product-details-title">Chi tiết sản phẩm</Typography>
                <TableContainer sx={{ mt: 2 }} className="product-table">
                  <Table size="small">
                    <TableHead className="table-header">
                      <TableRow>
                        <TableCell className="table-header-cell">Sản phẩm</TableCell>
                        <TableCell align="center" className="table-header-cell">Số lượng</TableCell>
                        <TableCell align="right" className="table-header-cell">Giá</TableCell>
                        <TableCell align="right" className="table-header-cell">Thành tiền</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {processOrderDetails(selectedOrder.detailOrders).map((item, index) => {
                        // Tính tổng giá topping
                        const toppingTotal = item.toppings.reduce((sum, topping) => sum + topping.price, 0);
                        // Tính tổng tiền cho mỗi sản phẩm (bao gồm topping)
                        const itemTotal = item.price * item.quantity + toppingTotal * item.quantity;
                        
                        return (
                          <TableRow key={`${item.productId}-${index}`}>
                            <TableCell className="product-cell">
                              <div className="product-name">{item.productName}</div>
                              {item.toppings.length > 0 && (
                                <div className="topping-list">
                                  {item.toppings.map((topping, idx) => (
                                    <div key={`${topping.id}-${idx}`} className="topping-item">
                                      {topping.name}: {topping.price}đ
                                    </div>
                                  ))}
                                </div>
                              )}
                            </TableCell>
                            <TableCell align="center" className="quantity-cell">{item.quantity}</TableCell>
                            <TableCell align="right" className="price-cell">{item.price}đ</TableCell>
                            <TableCell align="right" className="total-cell">{itemTotal}đ</TableCell>
                          </TableRow>
                        );
                      })}
                      <TableRow className="order-total-row">
                        <TableCell colSpan={3} align="right" className="order-total-cell">Tổng cộng</TableCell>
                        <TableCell align="right" className="order-total-amount">{selectedOrder.totalPrice}đ</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={handleCloseDialog} color="inherit" className="action-button">Đóng</Button>
          
          {selectedOrder?.status === 'pending' && (
            <>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<ShippingIcon />}
                className="action-button"
              >
                Giao hàng
              </Button>
              <Button 
                variant="contained" 
                color="error"
                startIcon={<CancelIcon />}
                className="action-button"
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
              className="action-button"
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