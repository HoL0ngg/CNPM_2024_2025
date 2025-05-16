import React, { useEffect, useReducer, useRef } from 'react';
import { 
  Typography, Paper, Box, TextField, InputAdornment, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogActions, DialogContent, DialogTitle, FormControl,
  InputLabel, Select, MenuItem, Grid
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import '../css/product.css';

// 1. Định nghĩa initialState - tất cả state của component
const initialState = {
  // Dialog states
  openDialog: false,
  openToppingDialog: false,
  openToppingListDialog: false,
  
  // Data states
  products: [],
  toppings: [],
  categories: [],
  
  // Selection states
  selectedProduct: null,
  selectedTopping: null,
  selectedCategory: 'Tất cả',
  selectedToppingsCheckbox: [],
  
  // Search states
  searchTerm: '',
  toppingSearchTerm: '',
  
  // Image states
  imageFile: null,
  imagePreview: '',
  toppingImageFile: null
};

// 2. Định nghĩa reducer function
function reducer(state, action) {
  switch (action.type) {
    // Dialog actions
    case 'OPEN_PRODUCT_DIALOG':
      // console.log(action.payload.productToppings.map(obj => obj.topping.id));
      return { 
        ...state, 
        openDialog: true, 
        selectedProduct: action.payload || null,
        imagePreview: action.payload?.image ? `http://localhost:3001/images/${action.payload.image}` : '',
        imageFile: action.payload?.image || null,
        selectedToppingsCheckbox: action.payload?.productToppings?.map(obj => obj.topping.id) || []
      };
      
    case 'TOGGLE_TOPPING_SELECTION':
      return {
        ...state,
        selectedToppingsCheckbox: state.selectedToppingsCheckbox.includes(action.payload)
          ? state.selectedToppingsCheckbox.filter(id => id !== action.payload)
          : [...state.selectedToppingsCheckbox, action.payload]
      };
    case 'CLOSE_PRODUCT_DIALOG':
      return { 
        ...state, 
        openDialog: false, 
        selectedProduct: null,
        imageFile: null,
        imagePreview: ''
      };
    case 'OPEN_TOPPING_DIALOG':
      return { 
        ...state, 
        openToppingDialog: true, 
        selectedTopping: action.payload || null,
        toppingImageFile: null 
      };
    case 'CLOSE_TOPPING_DIALOG':
      return { 
        ...state, 
        openToppingDialog: false, 
        selectedTopping: null,
        toppingImageFile: null 
      };
    case 'OPEN_TOPPING_LIST_DIALOG':
      return { 
        ...state, 
        openToppingListDialog: true 
      };
    case 'CLOSE_TOPPING_LIST_DIALOG':
      return { 
        ...state, 
        openToppingListDialog: false,
        toppingSearchTerm: ''
      };
      
    // Data actions
    case 'SET_PRODUCTS':
      return { 
        ...state, 
        products: action.payload,
        categories: [...new Set(action.payload.map(product => product.categoryId))]
      };
    case 'SET_TOPPINGS':
      return { 
        ...state, 
        toppings: action.payload 
      };
    case 'DELETE_PRODUCT':
      return { 
        ...state, 
        products: state.products.filter(product => product.id !== action.payload) 
      };
    case 'DELETE_TOPPING':
      return { 
        ...state, 
        toppings: state.toppings.filter(topping => topping.id !== action.payload) 
      };
      
    // Selection actions
    case 'SET_SELECTED_CATEGORY':
      return { 
        ...state, 
        selectedCategory: action.payload 
      };
      
    // Search actions
    case 'SET_SEARCH_TERM':
      return { 
        ...state, 
        searchTerm: action.payload 
      };
    case 'SET_TOPPING_SEARCH_TERM':
      return { 
        ...state, 
        toppingSearchTerm: action.payload 
      };
      
    // Image actions
    case 'SET_IMAGE_FILE':
      return { 
        ...state, 
        imageFile: action.payload.file,
        imagePreview: action.payload.preview
      };
    case 'SET_TOPPING_IMAGE_FILE':
      return { 
        ...state, 
        toppingImageFile: action.payload 
      };
      
    default:
      return state;
  }
}

const Product = () => {
  // 3. Sử dụng useReducer thay cho nhiều useState
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // 4. Tách refs ra vì chúng không phải là state
  const fileInputRef = useRef(null);
  const toppingFileInputRef = useRef(null);
  
  // Lấy dữ liệu products khi component mount
  useEffect(() => {
    getProducts();
    getToppings();
  }, []);

  // API calls
  const getProducts = async () => {
    try {
      const response = await axios.get('/product');
      const result = response.data;
      // Dispatch action để cập nhật state
      dispatch({ type: 'SET_PRODUCTS', payload: result.data });
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const getToppings = async () => {
    try {
      const response = await axios.get('/topping');
      const result = response.data;
      dispatch({ type: 'SET_TOPPINGS', payload: result.data });
    } catch (error) {
      console.error('Error fetching toppings:', error);
    }
  };

  // Event handlers
  const handleToppingToggle = (toppingId) => {
    dispatch({ type: 'TOGGLE_TOPPING_SELECTION', payload: toppingId });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        dispatch({ 
          type: 'SET_IMAGE_FILE', 
          payload: {
            file: file,
            preview: reader.result
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToppingImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      dispatch({ type: 'SET_TOPPING_IMAGE_FILE', payload: file });
    }
  };

  const handleDeleteProduct = (id) => {
    dispatch({ type: 'DELETE_PRODUCT', payload: id });
    // API call để xóa sản phẩm
    // axios.delete(`/product/${id}`);
  };

  const handleDeleteTopping = async (id) => {
    try {
      await axios.post(`/topping/delete`, { id }, {
        headers: { 'Content-Type': 'application/json' }
      });
      dispatch({ type: 'DELETE_TOPPING', payload: id });
    } catch (error) {
      console.error('Error deleting topping:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const buttonText = event.nativeEvent.submitter.innerText;
    console.log(buttonText);
    const data = {
        product: {
          name: event.target.name.value,
          categoryId: event.target.category.value,
          price: event.target.price.value,
          quantity: event.target.quantity.value,
          description: event.target.description.value,
        },
        productTopping: {
          toppings: state.selectedToppingsCheckbox
        }
      };
      // console.log(data);
    if (state.imageFile) {
      const formData = new FormData();
      formData.append('file', state.imageFile);
      try {
        let response = await axios.post('/product/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        const imageName = response.data.filename;
        data.product.image = imageName;
      } catch (error) {
        console.error('Error saving product:', error);
      }
    }
    else{
      if(buttonText === 'THÊM SẢN PHẨM'){
        alert('Vui lòng chọn hình ảnh sản phẩm');
        return;
      }
    }
    
    if (!state.selectedProduct) {
      await axios.post('/product', data);
    }
    else {
      data.product.id = state.selectedProduct.id;
      data.image = state.selectedProduct.image;
      await axios.put('/product', data);
    }
    console.log(data);
    getProducts(); // Refresh products list
    dispatch({ type: 'CLOSE_PRODUCT_DIALOG' });
  };

  const handleSubmitTopping = async (event) => {
    event.preventDefault();
    
    try {
      let imageName = null;
      if (state.toppingImageFile) {
        const formData = new FormData();
        formData.append('file', state.toppingImageFile);
        
        let response = await axios.post('/topping/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageName = response.data.filename;
      }
      
      const data = {
        name: event.target.name.value,
        price: event.target.price.value,
        image: imageName || (state.selectedTopping ? state.selectedTopping.image : null),
        quantity: event.target.quantity.value,
      };
      
      if (state.selectedTopping) {
        await axios.put(`/topping`, data);
      } else {
        await axios.post('/topping', data);
      }
      
      dispatch({ type: 'CLOSE_TOPPING_DIALOG' });
      getToppings(); // Refresh toppings
    } catch (error) {
      console.error('Error saving topping:', error);
    }
  };

  // Tính toán filtered products
  const filteredProducts = state.products.filter(product => {
    return (
      (state.selectedCategory === 'Tất cả' || product.categoryId === state.selectedCategory) &&
      product.name.toLowerCase().includes(state.searchTerm.toLowerCase())
    );
  });

  // Tính toán filtered toppings
  const filteredToppings = state.toppings.filter(topping => 
    topping.name.toLowerCase().includes(state.toppingSearchTerm.toLowerCase())
  );

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
              value={state.searchTerm}
              onChange={(e) => dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value })}
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
                value={state.selectedCategory}
                onChange={(e) => dispatch({ type: 'SET_SELECTED_CATEGORY', payload: e.target.value })}
                label="Danh mục"
              >
                <MenuItem value="Tất cả">Tất cả</MenuItem>
                {state.categories.map((category) => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => {
              dispatch({ type: 'OPEN_TOPPING_LIST_DIALOG' });
              getToppings();
            }}
            sx={{ 
              bgcolor: '#ff5a5f', 
              '&:hover': { bgcolor: '#e0484d' }
            }}
          >
            Danh sách món ăn phụ
          </Button>

          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => dispatch({ type: 'OPEN_PRODUCT_DIALOG' })}
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
                        src={`http://localhost:3001/images/${product.image}`}
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
                      onClick={() => dispatch({ type: 'OPEN_PRODUCT_DIALOG', payload: product })}
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
      <Dialog open={state.openDialog} onClose={() => dispatch({ type: 'CLOSE_PRODUCT_DIALOG' })} maxWidth="sm" fullWidth>
        <DialogTitle className="dialog-title">
          {state.selectedProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên sản phẩm"
                  name="name"
                  required
                  defaultValue={state.selectedProduct?.name || ''}
                  className="input-field"
                />
              </Grid>
              <Grid item xs={5}>
                <FormControl fullWidth required>
                  <InputLabel>Danh mục</InputLabel>
                  <Select
                    name="category"
                    label="Danh mục"
                    defaultValue={state.selectedProduct?.categoryId || 'Mỳ'}
                  >
      
                    {state.categories.map((category) => (
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
                  defaultValue={state.selectedProduct?.price || ''}
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
                  defaultValue={state.selectedProduct?.quantity || ''}
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
                {/* Thêm phần preview ảnh */}
                {(state.imagePreview || (state.selectedProduct && state.selectedProduct.image)) && (
                  <Box 
                    sx={{ 
                      mt: 2,
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: '120px',
                      border: '1px solid #e0e0e0', 
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}
                  >
                    <img 
                      src={ state.imagePreview || `http://localhost:3001/images/${state.selectedProduct.image}`}
                      alt="Hình ảnh xem trước" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '100%', 
                        objectFit: 'contain' 
                      }}
                    />
                  </Box>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="description"
                  label="Mô tả"
                  multiline
                  rows={4}
                  defaultValue={state.selectedProduct?.description || ''}
                  className="multiline-input"
                />
              </Grid>
              {/* Thêm phần hiển thị danh sách topping */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Món ăn phụ kèm theo
                </Typography>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                  gap: 1, 
                  maxHeight: '200px', 
                  overflowY: 'auto',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  p: 1
                }}>
                  {state.toppings.map(topping => (
                    <Box 
                      key={topping.id} 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        p: 1,
                        borderRadius: '4px',
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.04)'
                        } 
                      }}
                    >
                      <input
                        type="checkbox"
                        id={`topping-${topping.id}`}
                        
                        checked={state.selectedToppingsCheckbox.includes(topping.id)}
                        
                        onChange={() => handleToppingToggle(topping.id)}
                        style={{ marginRight: '8px' }}
                      />
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        {topping.image && (
                          <Box sx={{ width: 30, height: 30, mr: 1 }}>
                            <img 
                              src={`http://localhost:3001/images/${topping.image}`}
                              alt={topping.name} 
                              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                            />
                          </Box>
                        )}
                        <Box>
                          <Typography variant="body2">{topping.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {topping.price.toLocaleString('vi-VN')} đ
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                  {state.toppings.length === 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                      Chưa có món ăn phụ nào. Vui lòng thêm món ăn phụ trước.
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions className="dialog-actions">
            <Button onClick={() => dispatch({ type: 'CLOSE_PRODUCT_DIALOG' })} className="cancel-button">Hủy</Button>
            <Button 
              type="submit"
              variant="contained" 
              className="save-button"
              name="button"
            >
              {state.selectedProduct ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Add/Edit Topping Dialog */}
      <Dialog 
        open={state.openToppingDialog} 
        onClose={() => dispatch({ type: 'CLOSE_TOPPING_DIALOG' })} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle className="dialog-title">
          {state.selectedTopping ? 'Chỉnh sửa món ăn phụ' : 'Thêm món ăn phụ'}
        </DialogTitle>
        <form onSubmit={handleSubmitTopping}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên món ăn phụ"
                  name="name"
                  required
                  defaultValue={state.selectedTopping?.name || ''}
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
                  defaultValue={state.selectedTopping?.price || ''}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">đ</InputAdornment>,
                  }}
                />
              </Grid>
                <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="quantity"
                  label="Số lượng"
                  required
                  type="number"
                  defaultValue={state.selectedTopping?.quantity || 1}
                  inputProps={{ min: 1 }}
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
              
              {state.selectedTopping && state.selectedTopping.image && !state.toppingImageFile && (
              <Grid item xs={12}>
                <Box 
                  sx={{ 
                    mt: 1,
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 1
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Hình ảnh hiện tại:
                  </Typography>
                  <Box
                    sx={{
                      width: '100%',
                      height: '120px',
                      border: '1px solid #e0e0e0', 
                      borderRadius: '4px',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <img 
                      src={`http://localhost:3001/images/${state.selectedTopping.image}`}
                      alt={state.selectedTopping.name}
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '100%', 
                        objectFit: 'contain' 
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            )}
            </Grid>
          </DialogContent>
          <DialogActions className="dialog-actions">
            <Button onClick={() => dispatch({ type: 'CLOSE_TOPPING_DIALOG' })} className="cancel-button">Hủy</Button>
            <Button 
              type="submit"
              variant="contained" 
              className="save-button"
            >
              {state.selectedTopping ? 'Lưu thay đổi' : 'Thêm món ăn phụ'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Topping List Dialog */}
      <Dialog 
        open={state.openToppingListDialog} 
        onClose={() => dispatch({ type: 'CLOSE_TOPPING_LIST_DIALOG' })} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle className="dialog-title">
          Danh sách món ăn phụ
          <Box position="absolute" right={16} top={12}>
            <Button 
              variant="contained" 
              size="small"
              startIcon={<AddIcon />}
              onClick={() => {
                dispatch({ type: 'CLOSE_TOPPING_LIST_DIALOG' });
                dispatch({ type: 'OPEN_TOPPING_DIALOG' });
              }}
              sx={{ 
                bgcolor: '#ff5a5f', 
                '&:hover': { bgcolor: '#e0484d' }
              }}
            >
              Thêm mới
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box mb={3} mt={1}>
            <TextField
              placeholder="Tìm kiếm món ăn phụ..."
              variant="outlined"
              size="small"
              fullWidth
              value={state.toppingSearchTerm}
              onChange={(e) => dispatch({ type: 'SET_TOPPING_SEARCH_TERM', payload: e.target.value })}
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
                  <TableCell>ID</TableCell>
                  <TableCell>Hình ảnh</TableCell>
                  <TableCell>Tên món ăn phụ</TableCell>
                  <TableCell>Giá</TableCell>
                  <TableCell align="right">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredToppings.map((topping) => (
                  <TableRow key={topping.id}>
                    <TableCell>{topping.id}</TableCell>
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
                        {topping.image && (
                          <img 
                            src={`http://localhost:3001/images/${topping.image}`}
                            alt={topping.name} 
                            style={{ maxWidth: '100%', maxHeight: '100%' }}
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{topping.name}</TableCell>
                    <TableCell>{topping.price.toLocaleString('vi-VN')} đ</TableCell>
                    <TableCell align="right">
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="primary" 
                        sx={{ mr: 1 }}
                        onClick={() => {
                          dispatch({ type: 'CLOSE_TOPPING_LIST_DIALOG' });
                          dispatch({ type: 'OPEN_TOPPING_DIALOG', payload: topping });
                        }}
                        startIcon={<EditIcon />}
                      >
                        Sửa
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="error"
                        onClick={() => handleDeleteTopping(topping.id)}
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
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={() => dispatch({ type: 'CLOSE_TOPPING_LIST_DIALOG' })} className="cancel-button">Đóng</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Product;