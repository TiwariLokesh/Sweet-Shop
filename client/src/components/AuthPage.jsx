import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../AuthContext';

export default function AuthPage() {
  const { setToken, setUser } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const isLogin = mode === 'login';

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const { data } = await api.post(endpoint, form);
      setToken(data.token);
      setUser(data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="auth-page">
      {/* LEFT SIDE */}
      <div className="auth-visual">
  <span className="badge">🍬 Sweet Shop Suite</span>

  <h1 className="hero-title">
    Manage <br />
    confections <br />
    with <span>style</span>.
  </h1>

  <p className="hero-text">
    Modern dashboards, instant inventory, and smooth authentication
    flows designed for your sweet business.
  </p>

  {/* doodles */}
  <div className="candy candy-1">🍭</div>
  <div className="candy candy-2">🍩</div>
  <div className="candy candy-3">🍬</div>

  {/* glow layers */}
  <div className="glow glow-purple" />
  <div className="glow glow-pink" />
</div>


      {/* RIGHT SIDE */}
      <div className="auth-panel">
        <div className="auth-card">
          <div className="auth-toggle">
            <button
              className={isLogin ? 'active' : ''}
              onClick={() => setMode('login')}
            >
              Login
            </button>
            <button
              className={!isLogin ? 'active' : ''}
              onClick={() => setMode('register')}
            >
              Register
            </button>
          </div>

          <form onSubmit={onSubmit} className="auth-form">
            {!isLogin && (
              <label>
                <span>Name</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Your name"
                  required
                />
              </label>
            )}

            <label>
              <span>Email</span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              <span>Password</span>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                placeholder="••••••••"
                required
              />
            </label>

            {error && (
              <p className="error-text" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="primary-btn">
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
