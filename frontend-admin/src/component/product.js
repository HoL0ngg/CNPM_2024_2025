import React, { useEffect, useState, useRef } from 'react';
import { 
  Typography, Paper, Box, TextField, InputAdornment, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogActions, DialogContent, DialogTitle, FormControl,
  InputLabel, Select, MenuItem, Grid
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import '../css/product.css';

const Product = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const categories = [];

   // State và các hàm hiện tại
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);
  // Thêm state mới cho dialog món ăn phụ
  const [openToppingDialog, setOpenToppingDialog] = useState(false);
  const [selectedTopping, setSelectedTopping] = useState(null);
  const [toppingImageFile, setToppingImageFile] = useState(null);
  const toppingFileInputRef = useRef(null);
  
  // Xử lý khi chọn file
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Tạo URL preview cho hình ảnh đã chọn
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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

  const getProducts = async () => {
    const repsonse = await axios.get('/product');
    const result = repsonse.data;
    setProducts(result.data);
  }

  useEffect(() => {
    getProducts();  
  }, []);

  products.forEach(product => {
    if (!categories.includes(product.categoryId)) {
      categories.push(product.categoryId);
    }
  });

  const handleSubmit = async (event) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    //post ảnh lên api để lưu vào folder uploads của backend
    let response = await axios.post('/product/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    const imageName = response.data.filename;

    const data = {
      name: event.target.name.value,
      category: event.target.category.value,
      price: event.target.price.value,
      quantity: event.target.quantity.value,
      description: event.target.description.value,
      image: imageName,
    }
    console.log(data);
    let repsonse = await axios.post('/product', data);
    const result = repsonse.data;
  }

  // Hàm mở dialog topping
  const handleOpenDialogTopping = (topping = null) => {
    setSelectedTopping(topping);
    setOpenToppingDialog(true);
  };

  // Hàm đóng dialog topping
  const handleCloseToppingDialog = () => {
    setOpenToppingDialog(false);
    setSelectedTopping(null);
    setToppingImageFile(null);
    if (toppingFileInputRef.current) {
      toppingFileInputRef.current.value = '';
    }
  };

  // Xử lý khi chọn file hình ảnh topping
  const handleToppingImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setToppingImageFile(file);
    }
  };

  // Hàm submit form topping
  const handleSubmitTopping = async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('file', toppingImageFile);
    
    try {
      let imageName = null;
      if (toppingImageFile) {
        let response = await axios.post('/topping/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        imageName = response.data.filename;
      }
      
      const data = {
        name: event.target.name.value,
        price: event.target.price.value,
        image: imageName
      };
      
      // Gửi request API
      if (selectedTopping) {
        // Cập nhật topping
        await axios.put(`/topping/${selectedTopping.id}`, data);
      } else {
        // Thêm topping mới
        await axios.post('/topping', data);
      }
      
      // Đóng dialog và reset state
      handleCloseToppingDialog();
      
      // Có thể thêm thông báo thành công ở đây
      
    } catch (error) {
      console.error('Error saving topping:', error);
      // Có thể thêm thông báo lỗi ở đây
    }
  }


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
                <MenuItem value="Tất cả">Tất cả</MenuItem>
                {categories.map((category) => {
                  // console.log(category);
                  return <MenuItem key={category} value={category}>{category}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </Box>
          
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialogTopping()}
            sx={{ 
              bgcolor: '#ff5a5f', 
              '&:hover': { bgcolor: '#e0484d' }
            }}
          >
            Thêm món ăn phụ
          </Button>

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
                        src={`http://localhost:3001/uploads/images/${product.image}`}
                        alt={product.name} 
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
      
                      />
                    </Box>
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.categoryId}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
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
        <DialogTitle className="dialog-title">
          {selectedProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        </DialogTitle>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên sản phẩm"
                  name="name"
                  required
                  defaultValue={selectedProduct?.name || ''}
                  className="input-field"
                />
              </Grid>
              <Grid item xs={5}>
                <FormControl fullWidth required>
                  <InputLabel>Danh mục</InputLabel>
                  <Select
                    name="category"
                    label="Danh mục"
                    defaultValue={selectedProduct?.categoryId || 'Tất cả'}
                  >
                    <MenuItem value="Tất cả">Tất cả</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={7}>
                <TextField
                  fullWidth
                  name="price"
                  label="Giá"
                  required
                  type="text"
                  defaultValue={selectedProduct?.price || ''}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">đ</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  name="quantity"
                  label="Số lượng"
                  type="number"
                  required
                  defaultValue={selectedProduct?.quantity || ''}
                />
              </Grid>
              <Grid item xs={7}>
                <Button 
                  variant="outlined" 
                  component="label"
                  fullWidth
                  startIcon={<AddIcon />}
                  className="upload-button"
                >
                  Chọn hình ảnh
                  <input
                    accept="image/*"
                    type="file"
                    hidden
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="description"
                  label="Mô tả"
                  multiline
                  rows={4}
                  defaultValue={selectedProduct?.description || ''}
                  className="multiline-input"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions className="dialog-actions">
            <Button onClick={handleCloseDialog} className="cancel-button">Hủy</Button>
            <Button 
              type="submit"
              variant="contained" 
              className="save-button"
            >
              {selectedProduct ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Add/Edit Topping Dialog */}
      <Dialog open={openToppingDialog} onClose={handleCloseToppingDialog} maxWidth="sm" fullWidth>
        <DialogTitle className="dialog-title">
          {selectedTopping ? 'Chỉnh sửa món ăn phụ' : 'Thêm món ăn phụ'}
        </DialogTitle>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmitTopping(e);
        }}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên món ăn phụ"
                  name="name"
                  required
                  defaultValue={selectedTopping?.name || ''}
                  className="input-field"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="price"
                  label="Giá"
                  required
                  type="text"
                  defaultValue={selectedTopping?.price || ''}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">đ</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant="outlined" 
                  component="label"
                  fullWidth
                  startIcon={<AddIcon />}
                  className="upload-button"
                >
                  Chọn hình ảnh
                  <input
                    accept="image/*"
                    type="file"
                    hidden
                    ref={toppingFileInputRef}
                    onChange={handleToppingImageChange}
                    name="image"
                  />
                </Button>
              </Grid>
              
              {selectedTopping && selectedTopping.image && !toppingImageFile && (
                <Grid item xs={12}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 1,
                    fontSize: '0.875rem',
                    color: 'text.secondary' 
                  }}>
                    <span>Hình ảnh hiện tại:</span>
                    <span>{selectedTopping.image}</span>
                  </Box>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions className="dialog-actions">
            <Button onClick={handleCloseToppingDialog} className="cancel-button">Hủy</Button>
            <Button 
              type="submit"
              variant="contained" 
              className="save-button"
            >
              {selectedTopping ? 'Lưu thay đổi' : 'Thêm món ăn phụ'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

    </>
  );
};

export default Product;