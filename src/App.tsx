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

  // Se a autenticação ainda está sendo verificada, exibe um loading
  if (isAuthenticated === undefined) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {

  const { setUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Função que verifica se os dados do usuário ou token mudaram
    const syncUserFromLocalStorage = () => {
      try {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('user');

        if (token && user) {
          const parsedUser = JSON.parse(user);
          setUser({ ...parsedUser, token }); // Passa o token junto
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Erro ao sincronizar dados do localStorage:', error);
        setUser(null); // Limpa os dados em caso de falha
      }
    };

    // Sincroniza a cada renderização, garantindo que a sessão esteja correta
    syncUserFromLocalStorage();

    // Adiciona um listener para monitorar mudanças no localStorage
    const handleStorageChange = (event: StorageEvent) => {
      if ((event.key === 'user' || event.key === 'authToken') && event.oldValue !== event.newValue) {
        syncUserFromLocalStorage();  // Atualiza os dados no estado global sempre que houver mudanças
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      // Limpa o listener quando o componente for desmontado
      window.removeEventListener('storage', handleStorageChange);
    };
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
