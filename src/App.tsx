import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import QuestCreation from './pages/QuestCreation';
import Calendar from './pages/Calendar';
import Ranking from './pages/Ranking';
import Notes from './pages/Notes';
import About from './pages/About';
import Spreadsheet from './pages/Spreadsheet';
import { useEffect } from 'react';

// Componente para rotas privadas
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated === undefined) {
    return <div>Carregando...</div>; // Pode ser um spinner ou outro componente
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Hook para sincronizar o estado global com o localStorage
const useAuthSync = () => {
  const { setUser } = useAuthStore();

  useEffect(() => {
    const syncUserFromLocalStorage = () => {
      try {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('user');

        if (token && user) {
          const parsedUser = JSON.parse(user);
          setUser({ ...parsedUser, token }); // Atualiza o estado global com os dados do usuário
          fetchUser(); // Chama a função para buscar dados adicionais do usuário, se necessário
        } else {
          setUser(null); // Limpa o estado se não houver dados
        }
      } catch (error) {
        console.error('Erro ao sincronizar dados do localStorage:', error);
        setUser(null);
      }
    };

    syncUserFromLocalStorage();

    const handleStorageChange = (event: StorageEvent) => {
      if ((event.key === 'user' || event.key === 'authToken') && event.oldValue !== event.newValue) {
        syncUserFromLocalStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [setUser]);

  const fetchUser = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await fetch('/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUser(data); // Atualiza o estado com os dados do usuário
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        setUser(null); // Limpar os dados do usuário em caso de erro
      }
    }
  };
};

function App() {
  // Sincroniza o estado global com o localStorage
  useAuthSync();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" /> : <Login />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/" /> : <Register />
          }
        />
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
        <Route
          path="/calendar"
          element={
            <PrivateRoute>
              <Calendar />
            </PrivateRoute>
          }
        />
        <Route
          path="/spreadsheet"
          element={
            <PrivateRoute>
              <Spreadsheet />
            </PrivateRoute>
          }
        />
        <Route
          path="/ranking"
          element={
            <PrivateRoute>
              <Ranking />
            </PrivateRoute>
          }
        />
        <Route
          path="/notes"
          element={
            <PrivateRoute>
              <Notes />
            </PrivateRoute>
          }
        />
        <Route
          path="/about"
          element={
            <PrivateRoute>
              <About />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
