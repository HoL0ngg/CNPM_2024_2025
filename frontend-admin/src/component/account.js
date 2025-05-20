import React, { useState, useEffect, useReducer } from 'react';
import {  Password, Security as SecurityIcon } from '@mui/icons-material';
import {
  LockOpen as LockOpenIcon,
} from '@mui/icons-material';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Snackbar,
  Alert,
  Tab,
  Tabs,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Save as SaveIcon,
  PersonAdd as PersonAddIcon,
  Delete as DeleteIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Key as KeyIcon
} from '@mui/icons-material';
import '../css/account.css';
import { toast, ToastContainer } from 'react-toastify';

// Định nghĩa initialState
const initialState = {
  confirmDialog: {
    open: false,
    account: null,
    accountId: null,
    accountStatus: null,
    message: ''
  },
  accounts: [],
  currentAccount: null,
  loading: false,
  error: null,
  success: null,
  openDialog: false,
  passwordDialog: {
    open: false,
    accountId: null,
  },
  editMode: false,
  tabValue: 0,
  passwordFields: {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  },
  showPasswords: {
    current: false,
    new: false,
    confirm: false
  }
};

// Reducer function
function reducer(state, action) {
  switch (action.type) {
    case 'OPEN_CONFIRM_DIALOG':
    return { 
      ...state, 
      confirmDialog: { 
        open: true, 
        account: action.payload.account,
        accountId: action.payload.account.id,
        accountStatus: action.payload.account.status,
        message: action.payload.message
      } 
    };
  
    case 'CLOSE_CONFIRM_DIALOG':
      return { 
        ...state, 
        confirmDialog: { 
          open: false, 
          accountId: null,
          accountStatus: null,
          message: '',
          account: null
        } 
    };
    case 'FETCH_ACCOUNTS_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_ACCOUNTS_SUCCESS':
      return { ...state, loading: false, accounts: action.payload };
    case 'FETCH_ACCOUNTS_FAILURE':
      return { ...state, loading: false, error: action.payload };
      
    case 'SET_CURRENT_ACCOUNT':
      return { ...state, currentAccount: action.payload, editMode: false };
    case 'TOGGLE_EDIT_MODE':
      return { ...state, editMode: !state.editMode };
      
    case 'OPEN_DIALOG':
      return { ...state, openDialog: true, currentAccount: action.payload || null };
    case 'CLOSE_DIALOG':
      return { ...state, openDialog: false, currentAccount: null };
      
    case 'OPEN_PASSWORD_DIALOG':
      return { 
        ...state, 
        passwordDialog: { 
          open: true, 
          accountId: action.payload 
        }
      };
    case 'CLOSE_PASSWORD_DIALOG':
      return { 
        ...state, 
        passwordDialog: { 
          open: false, 
          accountId: null 
        },
        passwordFields: {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        },
        showPasswords: {
          current: false,
          new: false,
          confirm: false
        }
      };
      
    case 'SET_SUCCESS':
      return { ...state, success: action.payload };
    case 'CLEAR_SUCCESS':
      return { ...state, success: null };
      
    case 'SET_PASSWORD_FIELD':
      return { 
        ...state, 
        passwordFields: {
          ...state.passwordFields,
          [action.field]: action.payload
        }
      };
      
    case 'TOGGLE_PASSWORD_VISIBILITY':
      return {
        ...state,
        showPasswords: {
          ...state.showPasswords,
          [action.field]: !state.showPasswords[action.field]
        }
      };
      
    case 'SET_TAB_VALUE':
      return { ...state, tabValue: action.payload };
      
    default:
      return state;
  }
}


const Account = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  let idCurrentUser = JSON.parse(localStorage.getItem('adminUser'))?.id;

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    dispatch({ type: 'FETCH_ACCOUNTS_START' });
    try {
      const response = await axios.get('/api/users');
      // console.log(response.data);
      let arrAccounts = response.data.filter(account => account.id !== idCurrentUser);
      dispatch({ 
        type: 'FETCH_ACCOUNTS_SUCCESS', 
        payload: arrAccounts 
      });
    } catch (error) {
      dispatch({
        type: 'FETCH_ACCOUNTS_FAILURE',
        payload: error.response?.data?.message || 'Không thể tải danh sách tài khoản'
      });
    }
  };

  const handleSaveAccount = async (e) => {
    let roleString = e.target.role.value;
    e.preventDefault();
    try {
      let response;
      if (state.currentAccount?.id) {
        // Cập nhật tài khoản
        state.currentAccount.role = roleString;
        // console.log(state.currentAccount);
        response = await axios.put(`/api/users`, state.currentAccount);
       
      } else {
        // Tạo tài khoản mới
        const newAccount = {
          username: e.target.username.value,
          name: e.target.name.value,
          password: e.target.password.value,
          role: roleString,
        }
        response = await axios.post('/api/users/username', newAccount);
        if(response.data.status){
          toast.error(response.data.message, {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          return;
        }
        response = await axios.post('/api/users', newAccount);
      }
      
      // Refresh danh sách tài khoản
      fetchAccounts();
      dispatch({ type: 'CLOSE_DIALOG' });
      if(response.data.status){
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      else{
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

    } catch (error) {
      toast.error(error.response?.data?.message, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleResetPassword = async () => {
 
    const response = await axios.post(`/api/users/reset-password`, {
      id: state.currentAccount.id,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = response.data;
    if(result.status){
      toast.success(result.message, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    else{
      toast.error(result.message, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    fetchAccounts();
  };

 
  const handleToggleStatus = (account) => {
    const message = account.status === "Đang hoạt động" 
      ? 'Bạn có chắc chắn muốn khóa tài khoản này?' 
      : 'Bạn có chắc chắn muốn mở khóa tài khoản này?';
      
    dispatch({ 
      type: 'OPEN_CONFIRM_DIALOG', 
      payload: {
        account: account,
        message: message
      } 
    });
  };

  const confirmStatusChange = async () => {
    const selectedAccount = state.confirmDialog.account;
    const newStatus = selectedAccount.status === "Đang hoạt động" ? "Đã khóa" : "Đang hoạt động";
    selectedAccount.status = newStatus;

    const response = await axios.put(`/api/users`, selectedAccount , {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = response.data;
    if(result.status){
      toast.success(result.message, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    else{
      toast.error(result.message, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    dispatch({ type: 'CLOSE_CONFIRM_DIALOG' });
    fetchAccounts();

  };

  return (
    <>
      <div className="account-container">
        <Typography variant="h4" className="page-title">
          Quản lý Tài khoản
        </Typography>
        
      
        
        {/* Quản lý tài khoản Admin */}
        <Paper className="account-section">
            <Box className="section-header">
                <Typography variant="h6">Danh sách tài khoản</Typography>
                <Button 
                variant="contained" 
                startIcon={<PersonAddIcon />}
                onClick={() => dispatch({ type: 'OPEN_DIALOG' })}
                className="add-button"
                >
                Thêm tài khoản
                </Button>
            </Box>
            
            <Table aria-label="simple table" className="accounts-table">
                <TableHead>
                <TableRow>
                    <TableCell>Tài khoản</TableCell>
                    <TableCell>Quyền</TableCell>
                    <TableCell>Thời gian tạo</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell align="right">Thao tác</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {state.accounts
                    .map(account => (
                    <TableRow key={account.id}>
                        <TableCell component="th" scope="row">
                        {account.username}
                        </TableCell>
                        <TableCell>
                          {account.role === 'admin' ? 'Quản trị viên' : 
                          account.role === 'chef' ? 'Bếp' : 
                          account.role === 'clerk' ? 'Nhân viên' : ''}
                        </TableCell>
                        <TableCell>{new Date(account.created_at).toLocaleDateString('vi-VN')}</TableCell>
                        <TableCell>
                          <Chip 
                              label={account.status === "Đang hoạt động" ? "Hoạt động" : "Tạm khóa"} 
                              color={account.status === "Đang hoạt động" ? "success" : "error"} 
                              size="small" 
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Box className="table-actions">
                              <IconButton 
                              color="primary" 
                              onClick={() => dispatch({ type: 'OPEN_DIALOG', payload: account })}
                              >
                              <EditIcon />
                              </IconButton>
                              <IconButton
                                  color={account.status === "Đang hoạt động" ? "error" : "success"}
                                  onClick={() => handleToggleStatus(account)}
                                  title={account.status === "Đang hoạt động" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                              >
                                  {account.status === "Đang hoạt động" ? <LockIcon /> : <LockOpenIcon />}
                              </IconButton>
                          </Box>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
            
            {state.accounts.filter(account => account.role === 'admin').length === 0 && (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography className="no-data-message">
                    Chưa có tài khoản nào.
                </Typography>
                </Box>
            )}
        </Paper>

      </div>
      
      {/* Dialog Thêm/Sửa tài khoản */}
      <Dialog open={state.openDialog} onClose={() => dispatch({ type: 'CLOSE_DIALOG' })}>
        <DialogTitle className="dialog-title">
          {state.currentAccount?.id ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản mới'}
        </DialogTitle>
        <form onSubmit={handleSaveAccount}>
          <DialogContent className="dialog-content">
            <Grid container spacing={2}>
    {!state.currentAccount?.id && (
        <Grid item xs={12}>
            <TextField
              fullWidth
              name="username"
              label="Tên đăng nhập"
              defaultValue={state.currentAccount?.username || ''}
              required
            />
        </Grid>
    )}
    {!state.currentAccount?.id && (
        <Grid item xs={12}>
            <TextField
              fullWidth
              name="name"
              label="Họ và tên"
              defaultValue={state.currentAccount?.name || ''}
              required
            />
        </Grid>
    )}
    
    {!state.currentAccount?.id && (
        <Grid item xs={12}>
            <TextField
              fullWidth
              name="password"
              label="Mật khẩu"
              type="password"
              required
            />
        </Grid>
    )}
    
    {state.currentAccount?.id && (
        <Grid item xs={12}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<LockIcon />}
              onClick={(e) => {
                e.preventDefault();
                handleResetPassword(state.currentAccount.id);
              }}
            >
              Khôi phục mật khẩu
            </Button>
        </Grid>
    )}
    
    <Grid item xs={12}>
        <FormControl fullWidth variant="outlined">
            <InputLabel id="role-select-label">Vai trò</InputLabel>
            <Select
                labelId="role-select-label"
                name="role"
                
                value={state.currentAccount?.role === 'admin' ? "admin" : 
                state.currentAccount?.role === 'chef' ? "chef" :
                state.currentAccount?.role === 'clerk' ? "clerk" : 'clerk'}
                
                onChange={(e) => {
                // Tùy chọn: Cập nhật state nếu cần
                dispatch({ 
                  type: 'SET_CURRENT_ACCOUNT', 
                  payload: {...state.currentAccount, role: e.target.value}
                });
                }}
                label="Quyền"
                required
            >
                <MenuItem value="admin">Chủ nhà hàng</MenuItem>
                <MenuItem value="chef">Bếp</MenuItem>
                <MenuItem value="clerk">Nhân viên</MenuItem>
            </Select>
          </FormControl>
        </Grid>
    </Grid> 
          </DialogContent>
          <DialogActions className="dialog-actions">
            <Button onClick={() => dispatch({ type: 'CLOSE_DIALOG' })} className="cancel-button">
              Hủy
            </Button>
            <Button type="submit" variant="contained" className="save-button">
              {state.currentAccount?.id ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      
      {/* Snackbar thông báo */}
      <Snackbar 
        open={!!state.success} 
        autoHideDuration={3000} 
        onClose={() => dispatch({ type: 'CLEAR_SUCCESS' })}
      >
        <Alert onClose={() => dispatch({ type: 'CLEAR_SUCCESS' })} severity="success">
          {state.success}
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={!!state.error} 
        autoHideDuration={3000} 
        onClose={() => dispatch({ type: 'FETCH_ACCOUNTS_FAILURE', payload: null })}
      >
        <Alert onClose={() => dispatch({ type: 'FETCH_ACCOUNTS_FAILURE', payload: null })} severity="error">
          {state.error}
        </Alert>
      </Snackbar>

      <Dialog
        open={state.confirmDialog.open}
        onClose={() => dispatch({ type: 'CLOSE_CONFIRM_DIALOG' })}
      >
        <DialogTitle>
          {state.confirmDialog.accountStatus === "Đang hoạt động" 
            ? 'Xác nhận khóa tài khoản' 
            : 'Xác nhận mở khóa tài khoản'}
        </DialogTitle>
        <DialogContent>
          <Typography>{state.confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch({ type: 'CLOSE_CONFIRM_DIALOG' })}>
            Hủy
          </Button>
          <Button 
            onClick={confirmStatusChange} 
            color={state.confirmDialog.accountStatus === "Đang hoạt động" ? "error" : "success"} 
            variant="contained"
            startIcon={state.confirmDialog.accountStatus === "Đang hoạt động" ? <LockIcon /> : <LockOpenIcon />}
          >
            {state.confirmDialog.accountStatus === "Đang hoạt động" ? 'Khóa' : 'Mở khóa'}
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
      
    </>
  );
};

export default Account;