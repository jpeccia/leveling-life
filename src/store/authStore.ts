import { create } from 'zustand';
import api from '../lib/axios';

// Tipo do usuário com validação de campos necessários
type User = {
  id: string;
  name: string;
  email: string;
  username: string;
  title: string;
  level: number;
  profilePicture: string;
  xp: number;
  token: string; // Token agora faz parte do tipo User
};

// Estado da autenticação com Zustand
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
  fetchUser: () => Promise<void>; // Adicione a função fetchUser
}

// Função utilitária para recuperar o usuário e o token do localStorage
const getInitialAuthState = (): { user: User | null; isAuthenticated: boolean } => {
  try {
    const userString = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');

    if (userString && token) {
      const parsedUser: User = JSON.parse(userString);

      // Verifica se o token e o usuário têm os campos necessários
      if (parsedUser?.id && parsedUser?.name && parsedUser?.token === token) {
        return { user: parsedUser, isAuthenticated: true };
      }
    }
  } catch (error) {
    console.error("Erro ao recuperar estado de autenticação:", error);
  }
  return { user: null, isAuthenticated: false };
};

// Criação do Zustand store
export const useAuthStore = create<AuthState>((set) => {
  // Inicializa o estado com dados armazenados, se disponíveis
  const initialAuthState = getInitialAuthState();

  return {
    isAuthenticated: initialAuthState.isAuthenticated,
    user: initialAuthState.user,

    setUser: (user) => {
      try {
        // Armazena os dados do usuário e o token no localStorage
        localStorage.setItem('authToken', user.token);
        localStorage.setItem('user', JSON.stringify(user));

        // Atualiza o estado global
        set({ isAuthenticated: true, user });
      } catch (error) {
        console.error("Erro ao salvar usuário no localStorage:", error);
      }
    },

    logout: () => {
      try {
        // Remove os dados do localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');

        // Atualiza o estado global
        set({ isAuthenticated: false, user: null });
      } catch (error) {
        console.error("Erro ao remover dados no logout:", error);
      }
    },
    fetchUser: async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.error('Token não encontrado no localStorage');
          return;
        }
    
        const response = await api.get('/user/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        console.log('Resposta do servidor:', response);  // Verifique o conteúdo da resposta
    
        if (response.status === 200) {
          const userData = response.data;
          set((state) => ({
            isAuthenticated: true,
            user: { ...userData, token: state.user?.token || token },
          }));
          localStorage.setItem('user', JSON.stringify({ ...userData, token }));
        } else {
          console.error('Erro ao buscar perfil do usuário:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar informações do usuário:', error);
      }
    },
  };
  
});
