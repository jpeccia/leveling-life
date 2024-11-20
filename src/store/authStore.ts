import { create } from 'zustand';

// Defina o tipo do usuário de forma mais precisa
interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  level: number;
  xp: number;
  title: string;
  profilePicture: string;
}

// O tipo de AuthState agora é mais claro, com o token sendo parte do tipo 'User'
interface AuthState {
  isAuthenticated: boolean;
  user: User | null; // O usuário pode ser nulo antes do login
  setUser: (user: User & { token: string }) => void; // Garantindo que o 'user' inclui um 'token'
  logout: () => void;
}

// Função para buscar o usuário armazenado no localStorage de forma segura
const getStoredUser = (): User | null => {
  try {
    const user = localStorage.getItem('user');
    if (user && user !== 'undefined') {
      const parsedUser = JSON.parse(user);
      // Verifique se o usuário possui todos os campos necessários
      if (parsedUser && parsedUser.id && parsedUser.name) {
        return parsedUser;
      }
    }
    return null;
  } catch (error) {
    console.error("Erro ao carregar usuário do localStorage:", error);
    return null;
  }
};

// Criação do Zustand store
export const useAuthStore = create<AuthState>((set) => ({
  // Verifica se o token de autenticação está presente no localStorage
  isAuthenticated: !!localStorage.getItem('authToken'),
  user: getStoredUser(), // Recupera o usuário do localStorage, se houver

  setUser: (user) => {
    try {
      // Armazena o token e os dados do usuário no localStorage
      localStorage.setItem('authToken', user.token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Atualiza o estado com os dados do usuário e o status de autenticação
      set({ isAuthenticated: true, user: user });
    } catch (error) {
      console.error("Erro ao salvar usuário no localStorage:", error);
    }
  },

  logout: () => {
    try {
      // Remove os dados do usuário e o token ao realizar o logout
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Atualiza o estado para refletir que o usuário está deslogado
      set({ isAuthenticated: false, user: null });
    } catch (error) {
      console.error("Erro ao remover dados do localStorage durante logout:", error);
    }
  },
}));
