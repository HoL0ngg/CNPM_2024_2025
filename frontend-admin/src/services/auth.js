import axios from 'axios';

const API_URL = '/api/auth/';

const login = async (username, password) => {
  const response = await axios.post(API_URL + 'login', { username, password });
  if (response.data.access_token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('adminUser'));
};

const isLoggedIn = () => {
  const user = getCurrentUser();
  return !!user && !!user.access_token;
};

const authService = {
  login,
  logout,
  getCurrentUser,
  isLoggedIn,
};

export default authService;