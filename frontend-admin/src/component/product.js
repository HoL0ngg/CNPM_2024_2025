import React, { useEffect, useState } from 'react';
import { 
  Typography, Paper, Box, TextField, InputAdornment, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogActions, DialogContent, DialogTitle, FormControl,
  InputLabel, Select, MenuItem, Grid
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

const Product = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);

  // Sample product data
  // const [products, setProducts] = useState([
  //   { id: 1, name: 'Mỳ ý', category: 'Mỳ', price: '30.000đ', stock: 45, image: 'my_y.jpg' },
  //   { id: 2, name: 'Burger', category: 'Bánh mì', price: '25.000đ', stock: 36, image: 'burger.jpg' },
  //   { id: 3, name: 'Bánh tráng trộn', category: 'Bánh tráng', price: '10.000đ', stock: 60, image: 'banh_trang.jpg' },
  //   { id: 4, name: 'Nước ngọt', category: 'Đồ uống', price: '15.000đ', stock: 100, image: 'nuoc_ngot.jpg' },
  //   { id: 5, name: 'Mỳ xào', category: 'Mỳ', price: '20.000đ', stock: 40, image: 'my_xao.jpg' },
  //   { id: 6, name: 'Cơm chiên', category: 'Cơm', price: '22.000đ', stock: 30, image: 'com_chien.jpg' },
  //   { id: 7, name: 'Trà sữa', category: 'Đồ uống', price: '18.000đ', stock: 50, image: 'tra_sua.jpg' },
  //   { id: 8, name: 'Salad', category: 'Rau', price: '35.000đ', stock: 25, image: 'salad.jpg' },
  // ]);

  useEffect(() => {
    const fetchProducts = async () => {
      axios.get('http://localhost:3001/product')
        .then(response => {
          const result = response.data;
          setProducts(result.data);
          console.log('Products fetched successfully:', result.data);
        })
        .catch(error => {
          console.error('Error fetching products:', error);
        });
    };
    fetchProducts();
  }, []);

  const categories = ['Tất cả', 'Mỳ', 'Bánh mì', 'Bánh tráng', 'Đồ uống', 'Cơm', 'Rau'];
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  const handleOpenDialog = (product = null) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = (event) => {
    event.preventDefault();
    // Logic to save product
    handleCloseDialog();
  };

  const handleDeleteProduct = (id) => {
    // Logic to delete product
    setProducts(products.filter(product => product.id !== id));
  };

  const filteredProducts = products.filter(product => {
    return (
      (selectedCategory === 'Tất cả' || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="#333">
        Quản lý sản phẩm
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <TextField
              placeholder="Tìm kiếm sản phẩm..."
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
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Danh mục</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Danh mục"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ 
              bgcolor: '#ff5a5f', 
              '&:hover': { bgcolor: '#e0484d' }
            }}
          >
            Thêm sản phẩm
          </Button>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Hình ảnh</TableCell>
                <TableCell>Tên sản phẩm</TableCell>
                <TableCell>Danh mục</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Tồn kho</TableCell>
                <TableCell align="right">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>
                    <Box 
                      sx={{ 
                        width: 50, 
                        height: 50,
                        bgcolor: '#f5f5f5',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <img 
                        src={`/images/${product.image}`} 
                        alt={product.name} 
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                        onError={(e) => { e.target.src = '/images/placeholder.jpg' }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell align="right">
                    <Button 
                      size="small" 
                      variant="outlined" 
                      color="primary" 
                      sx={{ mr: 1 }}
                      onClick={() => handleOpenDialog(product)}
                      startIcon={<EditIcon />}
                    >
                      Sửa
                    </Button>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      color="error"
                      onClick={() => handleDeleteProduct(product.id)}
                      startIcon={<DeleteIcon />}
                    >
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* Add/Edit Product Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        </DialogTitle>
        <form onSubmit={handleSaveProduct}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên sản phẩm"
                  required
                  defaultValue={selectedProduct?.name || ''}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth required>
                  <InputLabel>Danh mục</InputLabel>
                  <Select
                    label="Danh mục"
                    defaultValue={selectedProduct?.category || ''}
                  >
                    {categories.filter(c => c !== 'Tất cả').map((category) => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Giá"
                  required
                  type="text"
                  defaultValue={selectedProduct?.price || ''}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Tồn kho"
                  type="number"
                  required
                  defaultValue={selectedProduct?.stock || ''}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Hình ảnh"
                  defaultValue={selectedProduct?.image || ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mô tả"
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="inherit">Hủy</Button>
            <Button 
              type="submit"
              variant="contained" 
              sx={{ bgcolor: '#ff5a5f', '&:hover': { bgcolor: '#e0484d' } }}
            >
              {selectedProduct ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default Product;