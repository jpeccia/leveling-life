import api from './api'; // Certifique-se de que o arquivo api.ts está configurado corretamente.

export const register = async (userData: { username: string; name: string; email: string; password: string }) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;  // Certifique-se de que está retornando os dados corretos
  } catch (error) {
    console.error('Erro no registro:', error);
    throw error; // Lança o erro para ser tratado no componente
  }
};

export const login = async (credentials: { username: string; password: string }) => {
  try {
    const response = await api.post('/auth/login', credentials);
    const token = response.data.token;

    if (token) {
      // Armazenar o token no localStorage
      localStorage.setItem('token', token);
    }
    return response.data; // Retorna os dados do login (se necessário)
  } catch (error) {
    console.error('Erro no login:', error);
    throw error; // Lança o erro para ser tratado no componente
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};
