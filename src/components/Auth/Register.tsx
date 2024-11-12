// src/components/auth/Register.tsx
import React, { useState } from 'react';
import { register } from '../../services/authService';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Senhas não coincidem');
      return;
    }
    try {
      await register(formData);
      setSuccess(true);
    } catch (error) {
      setError('Erro ao registrar usuário');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center">Criar Conta</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="username" placeholder="Username" onChange={handleInputChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleInputChange} required />
        <input type="password" name="password" placeholder="Senha" onChange={handleInputChange} required />
        <input type="password" name="confirmPassword" placeholder="Confirmar Senha" onChange={handleInputChange} required />
        <button type="submit">Registrar</button>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">Cadastro realizado com sucesso!</p>}
      </form>
    </div>
  );
};

export default Register;
