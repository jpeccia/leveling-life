import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import QuestCreation from './pages/QuestCreation';
import { useEffect } from 'react';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  console.log('isAuthenticated:', isAuthenticated);  // Verifique se está 'true' após login
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const { setUser } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Simular a obtenção de dados do usuário (pode ser necessário fazer uma chamada à API)
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(user);  // Atualiza o estado com os dados do usuário
    }
  }, [setUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/quests/create"
          element={
            <PrivateRoute>
              <QuestCreation />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
