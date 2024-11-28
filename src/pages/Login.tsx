import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import Logo from '../components/Logo';
import api from '../lib/axios';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner'; // Biblioteca para notificações
import { Spinner } from '../components/Spinner'; // Componente de carregamento (opcional)

export default function Login() {
  // Navegação entre páginas
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  // Função para lidar com o envio do formulário de login
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Requisição para autenticar o usuário
      const response = await api.post('/auth/login', formData);
      const { token } = response.data;

      // Armazenamento seguro do token - considere usar HttpOnly Cookies em produção
      localStorage.setItem('token', token);

      // Requisição para buscar as informações do usuário com o token
      const userResponse = await api.get('/user/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = userResponse.data;

      // Armazenamento do usuário no localStorage
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);

      // Notificação de sucesso
      toast.success('Login realizado com sucesso!');
      navigate('/');
    } catch (err: any) {
      // Tratamento de erros com mensagens detalhadas
      if (err.response) {
        switch (err.response.status) {
          case 401:
            toast.error('Usuário ou senha incorreta');
            break;
          case 403:
            toast.error('Acesso proibido');
            break;
          case 404:
            toast.error('Usuário não encontrado');
            break;
          default:
            toast.error('Ocorreu um erro inesperado. Tente novamente mais tarde');
            break;
        }
      } else {
        toast.error('Erro de rede. Verifique sua conexão');
      }
    } finally {
      setLoading(false);
    }
  }, [formData, setUser, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo de username */}
          <Input
            label="Usuário"
            type="text"
            required
            value={formData.username}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, username: e.target.value }))
            }
            autoComplete="username"
          />

          {/* Campo de password */}
          <div className="relative">
            <Input
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute right-3 top-8 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Botão de login com indicador de carregamento */}
          <Button type="submit" disabled={loading}>
            {loading ? <Spinner /> : 'Entrar'}
          </Button>
        </form>

        {/* Link para a página de cadastro */}
        <p className="mt-6 text-center text-sm text-gray-800">
          Novo aventureiro?{' '}
          <Link
            to="/register"
            className="text-indigo-300 hover:text-indigo-200 transition-colors font-medium"
          >
            Crie sua conta!
          </Link>
        </p>
      </div>
    </div>
  );
}
