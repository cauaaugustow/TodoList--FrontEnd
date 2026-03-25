import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { criaUsuario } from './services/userServices';
import type { createUser } from './types/user/usercreate';
import './index.css';
import './register.css';

export default function Register() {
  const [formData, setFormData] = useState<createUser>({
    name: '',
    lastname: '',
    cpf: '',
    email: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Nome é obrigatório');
      return false;
    }

    if (!formData.email.trim()) {
      setError('Email é obrigatório');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email inválido');
      return false;
    }

    if (!formData.password) {
      setError('Senha é obrigatória');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return false;
    }

    if (formData.password !== confirmPassword) {
      setError('As senhas não coincidem');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!validateForm()) {
        setLoading(false);
        return;
      }

      
      const newUser = await criaUsuario(formData);

    
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('userEmail', formData.email);

    
      navigate('/');
    } catch (err) {
      console.error('Erro ao registrar:', err);
      setError('Erro ao registrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1>Criar Conta</h1>
        <p className="register-subtitle">Bem-vindo ao TodoList</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nome *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Seu nome"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastname">Sobrenome</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname || ''}
              onChange={handleChange}
              placeholder="Seu sobrenome"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cpf">CPF</label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={formData.cpf || ''}
              onChange={handleChange}
              placeholder="000.000.000-00"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Digite sua senha"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Senha *</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua senha"
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="register-button">
            {loading ? 'Registrando...' : 'Criar Conta'}
          </button>
        </form>

        <div className="register-footer">
          <p>Já tem conta? <a href="/login">Faça login</a></p>
        </div>
      </div>
    </div>
  );
}
