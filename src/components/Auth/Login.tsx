import React, { useState } from 'react';
import { login } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await login(formData);
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (error) {
      setError('Erro ao fazer login');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="username" placeholder="Username" onChange={handleInputChange} required />
        <input type="password" name="password" placeholder="Senha" onChange={handleInputChange} required />
        <button type="submit">Entrar</button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
