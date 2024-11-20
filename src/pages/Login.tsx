import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import Logo from '../components/Logo';
import api from '../lib/axios';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner'; // Importação corrigida

export default function Login() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', formData);
      const { token } = response.data;

      localStorage.setItem('token', token);

      const userResponse = await api.get('/user/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = userResponse.data;
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);

      toast.success('Login successful!');
      navigate('/');
    } catch (err: any) {
      if (err.response) {
        switch (err.response.status) {
          case 401:
            toast.error('Incorrect password');
            break;
          case 403:
            toast.error('Access forbidden');
            break;
          case 404:
            toast.error('User not found');
            break;
          default:
            toast.error('An unexpected error occurred');
            break;
        }
      } else {
        toast.error('Network error, please try again later');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Username"
            type="text"
            required
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            autoComplete="username"
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
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

          <Button type="submit">Sign In</Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 hover:text-indigo-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
