import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  FastfoodOutlined as BrandIcon
} from '@mui/icons-material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Kiểm tra nếu đã đăng nhập thì chuyển hướng
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Gọi API đăng nhập
    //   console.log('Đang gọi API đăng nhập...');
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });
      console.log(response.data);

      if (response.data && response.data.access_token) {
        if(response.data.user.status !== 'Đang hoạt động'){
            setError('Tài khoản bị khóa');
            return;
        }
        localStorage.setItem('adminUser', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.access_token);
        
        // Thêm token vào header mặc định
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
        
        // Chuyển hướng đến trang admin
        navigate('/admin');
      } else {
        setError('Đăng nhập không thành công');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: '100%',
          maxWidth: 400,
          borderRadius: 2
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 3
          }}
        >
          <BrandIcon sx={{ color: '#ff5a5f', fontSize: 40, mb: 1 }} />
          <Typography variant="h5" component="h1" fontWeight="bold">
            OrderFood Admin
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Đăng nhập để truy cập trang quản trị
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Mật khẩu"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              py: 1.2,
              bgcolor: '#ff5a5f',
              '&:hover': { bgcolor: '#e0484d' }
            }}
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;