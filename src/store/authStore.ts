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

interface AuthState {
  isAuthenticated: boolean;
  user: User | null; // O usuário pode ser nulo antes do login
  setUser: (user: User & { token: string }) => void; // Garantindo que o 'user' inclui um 'token'
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem('authToken'), // Verifica se o token está presente
  user: JSON.parse(localStorage.getItem('user') || 'null'), // Garante que a inicialização seja nula se não houver usuário
  setUser: (user) => {
    localStorage.setItem('authToken', user.token); // Armazenando o token
    localStorage.setItem('user', JSON.stringify(user)); // Armazenando os dados do usuário
    set({ isAuthenticated: true, user: user }); // Define o estado com os dados do usuário
  },
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    set({ isAuthenticated: false, user: null }); // Limpa o estado ao deslogar
  },
}));
