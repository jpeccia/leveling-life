import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/quests', // A URL do seu back-end
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getUserQuests = async () => {
  try {
    const response = await api.get('/');
    return response.data; // Retorna as quests do usuário
  } catch (error) {
    throw new Error('Erro ao carregar as quests');
  }
};
