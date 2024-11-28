import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Logo from '../components/Logo';
import api from '../lib/axios';
import { toast } from 'sonner';

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<string | null>(null);

  // Valida a força da senha em tempo real
  const validatePasswordStrength = (password: string) => {
    const strengthRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (strengthRegex.test(password)) {
      setPasswordStrength('Senha forte');
    } else {
      setPasswordStrength('A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.');
    }
  };

  // Manipula mudanças de input no formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'acceptTerms' ? checked : value,
    }));

    // Atualiza a força da senha em tempo real
    if (name === 'password') {
      validatePasswordStrength(value);
    }
  };

  // Valida os dados do formulário antes do envio
  const validateForm = useCallback(() => {
    if (!formData.name.trim()) return 'Nome é obrigatório';
    if (!formData.username.trim()) return 'Nome de usuário é obrigatório';
    if (!formData.email.trim() || !formData.email.includes('@'))
      return 'Email válido é obrigatório';
    if (formData.password.length < 6)
      return 'A senha deve ter pelo menos 6 caracteres';
    if (formData.password !== formData.confirmPassword)
      return 'As senhas não coincidem';
    if (!formData.acceptTerms)
      return 'Você deve aceitar os termos e condições';
    return null;
  }, [formData]);

  // Manipula o envio do formulário e validação
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errorMessage = validateForm();
    if (errorMessage) {
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post('/auth/register', {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      toast.success('Conta criada com sucesso!');
      navigate('/login');
    } catch (err: any) {
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError('Requisição inválida. Verifique seus dados.');
            toast.error('Requisição inválida. Verifique seus dados.');
            break;
          case 409:
            setError('Nome de usuário ou email já existe');
            toast.error('Nome de usuário ou email já existe');
            break;
          case 500:
            setError('Erro no servidor. Tente novamente mais tarde.');
            toast.error('Erro no servidor. Tente novamente mais tarde.');
            break;
          default:
            setError('Falha no registro. Tente novamente.');
            toast.error('Falha no registro. Tente novamente.');
            break;
        }
      } else {
        setError('Erro de rede. Verifique sua conexão.');
        toast.error('Erro de rede. Verifique sua conexão.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {['nome', 'usuário', 'email'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === 'email' ? 'email' : 'text'}
                name={field}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
              />
            </div>
          ))}

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute right-3 top-8 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
              title="Alternar visibilidade da senha"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
            {passwordStrength && (
              <p className={`mt-2 text-sm ${passwordStrength === 'Senha forte' ? 'text-green-500' : 'text-red-500'}`}>
                {passwordStrength}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute right-3 top-8 text-gray-400"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              title="Alternar visibilidade da senha"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="acceptTerms"
              id="terms"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={formData.acceptTerms}
              onChange={handleChange}
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              Aceito os termos e condições
            </label>
          </div>

          <button
            type="submit"
            className={`w-full ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white py-2 px-4 rounded-lg transition duration-200`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Criando...' : 'Criar Conta'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
