import axios from 'axios';

const api = axios.create({
  baseURL: '/auth',  // Apenas o caminho, já que o Vite vai redirecionar isso para o back-end
  withCredentials: true,  // Se estiver usando cookies para autenticação
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});


// Adicionando o token no cabeçalho da requisição, se disponível
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Adiciona o token no header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
