import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { realizaLogin } from './services/userServices';
import type { Authlog } from './types/user/authlog';
import './index.css';
import './login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
    
      if (!email || !password) {
        setError('Email e senha são obrigatórios');
        setLoading(false);
        return;
      }

     
      const authlog: Authlog = {
        email,
        password,
      };

      
      const user = await realizaLogin(authlog);

     
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userEmail', email);

    
      navigate('/');
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setError('Email ou senha inválidos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Bem-vindo ao TodoList</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="login-footer">
          <p>Não tem conta? <a href="/register">Crie uma agora</a></p>
        </div>
      </div>
    </div>
  );
}
