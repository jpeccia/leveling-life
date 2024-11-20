import { create } from 'zustand';

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
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => {
    console.log('Setting user:', user);  // Verifique o valor do usuário
    set({ user, isAuthenticated: !!user });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },
}));