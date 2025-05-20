import React, { use, useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography, Paper, Box, TextField, InputAdornment, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogActions, DialogContent, DialogTitle,
  Avatar, Grid, Card, CardContent, Tabs, Tab, Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  ShoppingBag as ShoppingBagIcon
} from '@mui/icons-material';

const Customer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [customers, setCustomers] = useState([]);


  const getCustomers = async () => {
    const response = await axios.get('/customer');
    let result = response.data;
    setCustomers(result.data);
  }

  useEffect(() => {
    getCustomers();
  }, []);

  
  const handleOpenDialog = async (customer, type) => {
    
    setDialogType(type);
    setOpenDialog(true);
    let totalOrders = 0;
    let totalSpent = 0;

    let response = await axios.post('/customer/total-orders', customer, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    let result = response.data;
    totalOrders = result.data;

    response = await axios.post('/customer/total-spent', customer, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    result = response.data;
    totalSpent = result.data;

    response = await axios.post('/customer/orders', customer, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    result = response.data;
    customer.recentOrders = result.data;


    // console.log(totalOrders);
    // console.log(totalSpent);
    customer.totalOrders = totalOrders;
    customer.totalSpent = totalSpent;
    setSelectedCustomer(customer);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCustomer(null);
    setDialogType('');
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Đã hoàn thành': return { color: 'success.main', text: 'Đã giao' };
      case 'Đang nấu': return { color: 'info.main', text: 'Đang giao' };
      case 'Chờ xử lý': return { color: 'warning.main', text: 'Chờ xử lý' };
      case 'Đã hủy': return { color: 'error.main', text: 'Đã hủy' };
      default: return { color: 'text.secondary', text: status };
    }
  };

  console.log(customers);
  let filteredCustomers = [];
  if(customers.length !== 0) {
     filteredCustomers = customers.filter(customer => {
      return (
        customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }

  return (
    <>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="#333">
        Quản lý khách hàng
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <TextField
            placeholder="Tìm kiếm khách hàng theo số điện thoại"
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
            
                <TableCell>Khách hàng</TableCell>
             
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Số đơn hàng</TableCell>
                <TableCell>Tổng chi tiêu</TableCell>
                <TableCell align="right">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.phone}>
                  <TableCell>{customer.name}</TableCell>
                
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell>{customer.total}</TableCell>
                  <TableCell align="right">
                    <Button 
                      size="small" 
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      sx={{ mr: 1 }}
                      onClick={() => handleOpenDialog(customer, 'view')}
                    >
                      Chi tiết
                    </Button>
                 
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* Customer Detail/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedCustomer && dialogType === 'view' && (
          <>
            <DialogTitle>
              Chi tiết khách hàng
            </DialogTitle>
            <DialogContent>
                    
              <Grid item xs={12} md={8}>
               
                
                {tabValue === 0 && (
                  <Box>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Card sx={{ bgcolor: '#f8f9fa', mb: 2 }}>
                          <CardContent>
                            <Typography variant="subtitle2" color="text.secondary">Tổng đơn hàng</Typography>
                            <Typography variant="h4" fontWeight="bold">{selectedCustomer.totalOrders}</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6}>
                        <Card sx={{ bgcolor: '#f8f9fa', mb: 2 }}>
                          <CardContent>
                            <Typography variant="subtitle2" color="text.secondary">Tổng chi tiêu</Typography>
                            <Typography variant="h4" fontWeight="bold">{selectedCustomer.totalSpent}</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                    
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Thông tin khách hàng
                    </Typography>
                    <Box sx={{ my: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2"><strong>Tên:</strong> {selectedCustomer.name}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2"><strong>Điện thoại:</strong> {selectedCustomer.phone}</Typography>
                        </Grid>
                      </Grid>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <ShoppingBagIcon sx={{ mr: 1 }} fontSize="small" />
                      Tất cả đơn hàng
                    </Typography>
                    
                    <TableContainer sx={{ mt: 2 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Mã đơn</TableCell>
                            <TableCell>Ngày</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell align="right">Tổng tiền</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedCustomer.recentOrders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell>{order.id}</TableCell>
                              <TableCell>{order.created_at}</TableCell>
                              <TableCell>
                                <Typography variant="body2" fontWeight="medium" color={getStatusColor(order.status).color}>
                                  {getStatusColor(order.status).text}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">{order.totalPrice}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
              </Grid>
             
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="inherit">Đóng</Button>
             
            </DialogActions>
          </>
        )}
        
        {selectedCustomer && dialogType === 'edit' && (
          <>
            <DialogTitle>
              Chỉnh sửa khách hàng
            </DialogTitle>
            <DialogContent>
              <Box component="form" sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Tên khách hàng"
                      defaultValue={selectedCustomer.name}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      defaultValue={selectedCustomer.email}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      defaultValue={selectedCustomer.phone}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Ngày đăng ký"
                      defaultValue={selectedCustomer.registerDate}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Địa chỉ"
                      multiline
                      rows={2}
                      defaultValue={selectedCustomer.address}
                    />
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="inherit">Hủy</Button>
              <Button 
                variant="contained" 
                sx={{ 
                  bgcolor: '#ff5a5f', 
                  '&:hover': { bgcolor: '#e0484d' } 
                }}
              >
                Lưu thay đổi
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default Customer;