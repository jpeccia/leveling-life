import api from './api';

export const register = (userData: { username: string; email: string; password: string }) => 
  api.post('/auth/register', userData);

export const login = (credentials: { username: string; password: string }) => 
  api.post('/auth/login', credentials);

export const logout = () => {
  localStorage.removeItem('token');
};
