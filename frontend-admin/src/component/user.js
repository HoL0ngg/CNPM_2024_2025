import React, { useState } from 'react';
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

  // Sample customers data
  const customers = [
    { 
      id: 1, 
      name: 'Nguyễn Văn A', 
      email: 'nguyenvana@gmail.com', 
      phone: '0901234567', 
      address: '123 Nguyễn Huệ, Q.1, TP.HCM',
      orders: 15, 
      total: '1.500.000đ',
      registerDate: '10/01/2025',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      status: 'active',
      recentOrders: [
        { id: '#ORD001', date: '14/05/2025', status: 'completed', total: '120.000đ' },
        { id: '#ORD010', date: '07/05/2025', status: 'completed', total: '95.000đ' },
        { id: '#ORD020', date: '01/05/2025', status: 'completed', total: '150.000đ' },
      ]
    },
    { 
      id: 2, 
      name: 'Trần Thị B', 
      email: 'tranthib@gmail.com', 
      phone: '0912345678', 
      address: '456 Lê Lợi, Q.1, TP.HCM',
      orders: 10, 
      total: '1.200.000đ',
      registerDate: '15/01/2025',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      status: 'active',
      recentOrders: [
        { id: '#ORD002', date: '14/05/2025', status: 'shipping', total: '85.000đ' },
        { id: '#ORD015', date: '03/05/2025', status: 'completed', total: '120.000đ' },
      ]
    },
    { 
      id: 3, 
      name: 'Lê Văn C', 
      email: 'levanc@gmail.com', 
      phone: '0923456789', 
      address: '789 Hai Bà Trưng, Q.3, TP.HCM',
      orders: 8, 
      total: '950.000đ',
      registerDate: '20/01/2025',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      status: 'active',
      recentOrders: [
        { id: '#ORD003', date: '13/05/2025', status: 'completed', total: '210.000đ' },
        { id: '#ORD018', date: '02/05/2025', status: 'completed', total: '75.000đ' },
      ]
    },
    { 
      id: 4, 
      name: 'Phạm Thị D', 
      email: 'phamthid@gmail.com', 
      phone: '0934567890', 
      address: '101 Võ Văn Tần, Q.3, TP.HCM',
      orders: 5, 
      total: '450.000đ',
      registerDate: '05/02/2025',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      status: 'inactive',
      recentOrders: [
        { id: '#ORD004', date: '13/05/2025', status: 'cancelled', total: '150.000đ' },
      ]
    },
    { 
      id: 5, 
      name: 'Hoàng Văn E', 
      email: 'hoangvane@gmail.com', 
      phone: '0945678901', 
      address: '202 Điện Biên Phủ, Q.Bình Thạnh, TP.HCM',
      orders: 3, 
      total: '320.000đ',
      registerDate: '10/02/2025',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      status: 'active',
      recentOrders: [
        { id: '#ORD005', date: '12/05/2025', status: 'completed', total: '95.000đ' },
      ]
    },
  ];

  const handleOpenDialog = (customer, type) => {
    setSelectedCustomer(customer);
    setDialogType(type);
    setOpenDialog(true);
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
      case 'completed': return { color: 'success.main', text: 'Đã giao' };
      case 'shipping': return { color: 'info.main', text: 'Đang giao' };
      case 'pending': return { color: 'warning.main', text: 'Chờ xử lý' };
      case 'cancelled': return { color: 'error.main', text: 'Đã hủy' };
      default: return { color: 'text.secondary', text: status };
    }
  };

  const filteredCustomers = customers.filter(customer => {
    return (
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    );
  });

  return (
    <>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="#333">
        Quản lý khách hàng
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <TextField
            placeholder="Tìm kiếm khách hàng..."
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
          
          <Button 
            variant="contained" 
            startIcon={<PersonIcon />}
            sx={{ 
              bgcolor: '#ff5a5f', 
              '&:hover': { bgcolor: '#e0484d' } 
            }}
          >
            Thêm khách hàng
          </Button>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Khách hàng</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Số đơn hàng</TableCell>
                <TableCell>Tổng chi tiêu</TableCell>
                <TableCell align="right">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        src={customer.avatar} 
                        alt={customer.name}
                        sx={{ mr: 2, width: 32, height: 32 }}
                      />
                      {customer.name}
                    </Box>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
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
                    <Button 
                      size="small" 
                      variant="outlined" 
                      color="primary"
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenDialog(customer, 'edit')}
                    >
                      Sửa
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
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Avatar 
                        src={selectedCustomer.avatar} 
                        alt={selectedCustomer.name}
                        sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                      />
                      <Typography variant="h6" fontWeight="bold">
                        {selectedCustomer.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Khách hàng từ {selectedCustomer.registerDate}
                      </Typography>
                      
                      <Box sx={{ mt: 3, textAlign: 'left' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                          <Typography variant="body2">{selectedCustomer.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                          <Typography variant="body2">{selectedCustomer.phone}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                          <LocationIcon sx={{ mr: 1, color: 'text.secondary', mt: 0.3 }} fontSize="small" />
                          <Typography variant="body2">{selectedCustomer.address}</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={8}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    <Tabs value={tabValue} onChange={handleTabChange}>
                      <Tab label="Tổng quan" />
                      <Tab label="Đơn hàng" />
                    </Tabs>
                  </Box>
                  
                  {tabValue === 0 && (
                    <Box>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Card sx={{ bgcolor: '#f8f9fa', mb: 2 }}>
                            <CardContent>
                              <Typography variant="subtitle2" color="text.secondary">Tổng đơn hàng</Typography>
                              <Typography variant="h4" fontWeight="bold">{selectedCustomer.orders}</Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={6}>
                          <Card sx={{ bgcolor: '#f8f9fa', mb: 2 }}>
                            <CardContent>
                              <Typography variant="subtitle2" color="text.secondary">Tổng chi tiêu</Typography>
                              <Typography variant="h4" fontWeight="bold">{selectedCustomer.total}</Typography>
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
                            <Typography variant="body2"><strong>ID:</strong> {selectedCustomer.id}</Typography>
                            <Typography variant="body2"><strong>Tên:</strong> {selectedCustomer.name}</Typography>
                            <Typography variant="body2"><strong>Email:</strong> {selectedCustomer.email}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2"><strong>Điện thoại:</strong> {selectedCustomer.phone}</Typography>
                            <Typography variant="body2"><strong>Ngày đăng ký:</strong> {selectedCustomer.registerDate}</Typography>
                            <Typography variant="body2"><strong>Trạng thái:</strong> {selectedCustomer.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}</Typography>
                          </Grid>
                        </Grid>
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <ShoppingBagIcon sx={{ mr: 1 }} fontSize="small" />
                        Đơn hàng gần đây
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
                                <TableCell>{order.date}</TableCell>
                                <TableCell>
                                  <Typography variant="body2" fontWeight="medium" color={getStatusColor(order.status).color}>
                                    {getStatusColor(order.status).text}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">{order.total}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}
                  
                  {tabValue === 1 && (
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Tất cả đơn hàng
                      </Typography>
                      
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Mã đơn</TableCell>
                              <TableCell>Ngày</TableCell>
                              <TableCell>Trạng thái</TableCell>
                              <TableCell align="right">Tổng tiền</TableCell>
                              <TableCell align="right">Hành động</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {selectedCustomer.recentOrders.map((order) => (
                              <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.date}</TableCell>
                                <TableCell>
                                  <Typography variant="body2" fontWeight="medium" color={getStatusColor(order.status).color}>
                                    {getStatusColor(order.status).text}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">{order.total}</TableCell>
                                <TableCell align="right">
                                  <Button size="small" variant="outlined">Chi tiết</Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="inherit">Đóng</Button>
              <Button 
                variant="contained" 
                startIcon={<EditIcon />}
                onClick={() => {
                  handleCloseDialog();
                  handleOpenDialog(selectedCustomer, 'edit');
                }}
                sx={{ 
                  bgcolor: '#ff5a5f', 
                  '&:hover': { bgcolor: '#e0484d' } 
                }}
              >
                Sửa thông tin
              </Button>
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