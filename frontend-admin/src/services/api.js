import axios from 'axios';

const instance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm JWT token vào header của mỗi request
instance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.access_token) {
      config.headers['Authorization'] = 'Bearer ' + user.access_token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Xử lý khi token hết hạn
instance.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export default instance;