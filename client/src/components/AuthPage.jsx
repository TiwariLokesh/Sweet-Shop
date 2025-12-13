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

  /* =====================
     TAILWIND STYLE TOKENS
     ===================== */

  const labelClass =
    'flex flex-col gap-1 text-[0.85rem] font-medium text-[#475569]';

  const inputClass =
    'rounded-[10px] border border-[#cbd5e1] bg-[#f8fafc] px-3 py-3 text-[#0f172a] ' +
    'placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 ' +
    'focus:ring-[#6366f1]/30 focus:border-[#6366f1]';

  const toggleButton =
    'rounded-[10px] py-2.5 text-sm font-semibold transition-all duration-200';

  const activeToggle =
    'bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white shadow-sm';

  const primaryButton =
    'mt-3 rounded-[12px] bg-gradient-to-r from-[#4f46e5] to-[#6366f1] ' +
    'py-3 text-white font-semibold tracking-wide ' +
    'shadow-[0_12px_30px_rgba(79,70,229,0.35)] ' +
    'hover:brightness-110 transition';

  /* =====================
     HANDLERS (UNCHANGED)
     ===================== */

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

  /* =====================
     UI
     ===================== */

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-[#eef2ff] via-[#f8fafc] to-[#eef2ff]">
      <div className="h-full w-full flex items-center justify-center">
        <div className="relative flex h-full w-full max-w-[1440px]">

          {/* LEFT VISUAL */}
          <div className="relative hidden md:flex flex-1 flex-col justify-center px-20 overflow-hidden">
            <span className="inline-flex items-center gap-2 bg-[#e0e7ff] text-[#4338ca] px-4 py-1.5 rounded-full font-semibold w-fit">
              🍬 Sweet Shop Suite
            </span>

            <h1 className="mt-6 text-[3.1rem] font-extrabold leading-[1.05] tracking-[-0.02em] text-slate-900 max-w-[520px]">
              Manage <br />
              confections <br />
              with{' '}
              <span className="bg-gradient-to-r from-[#4f46e5] to-[#ec4899] bg-clip-text text-transparent">
                style
              </span>.
            </h1>

            <p className="mt-4 max-w-[420px] text-[1.05rem] text-[#475569]">
              Modern dashboards, instant inventory, and smooth authentication
              flows designed for your sweet business.
            </p>

            {/* doodles */}
            <span className="absolute top-[14%] right-[22%] text-[2.2rem] opacity-80">🍭</span>
            <span className="absolute bottom-[20%] right-[18%] text-[2.6rem] opacity-80">🍩</span>
            <span className="absolute top-[58%] left-[12%] text-[2.2rem] opacity-80">🍬</span>

            {/* glow */}
            <div className="absolute -z-10 top-[10%] left-[30%] w-[380px] h-[380px] rounded-full bg-[#c7d2fe] opacity-40 blur-[140px]" />
            <div className="absolute -z-10 bottom-[10%] left-[10%] w-[320px] h-[320px] rounded-full bg-[#fbcfe8] opacity-40 blur-[140px]" />
          </div>

          {/* RIGHT AUTH CARD */}
          <div className="flex flex-1 items-center justify-center px-6">
            <div className="w-full max-w-[420px] bg-[#fbfcff] rounded-[22px] p-8 border border-[#e2e8f0]
              shadow-[0_30px_80px_rgba(15,23,42,0.15)]">

              {/* Toggle */}
              <div className="grid grid-cols-2 gap-1 mb-6 rounded-[12px] bg-[#f1f5f9] p-1">
                <button
                  className={`${toggleButton} ${isLogin ? activeToggle : 'text-[#64748b]'}`}
                  onClick={() => setMode('login')}
                >
                  Login
                </button>
                <button
                  className={`${toggleButton} ${!isLogin ? activeToggle : 'text-[#64748b]'}`}
                  onClick={() => setMode('register')}
                >
                  Register
                </button>
              </div>

              {/* Form */}
              <form onSubmit={onSubmit} className="flex flex-col gap-3">
                {!isLogin && (
                  <label className={labelClass}>
                    <span>Name</span>
                    <input
                      name="name"
                      value={form.name}
                      onChange={onChange}
                      className={inputClass}
                      placeholder="Your name"
                      required
                    />
                  </label>
                )}

                <label className={labelClass}>
                  <span>Email</span>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    className={inputClass}
                    placeholder="you@example.com"
                    required
                  />
                </label>

                <label className={labelClass}>
                  <span>Password</span>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={onChange}
                    className={inputClass}
                    placeholder="••••••••"
                    required
                  />
                </label>

                {error && (
                  <p className="text-[#dc2626] text-sm" role="alert">
                    {error}
                  </p>
                )}

                <button type="submit" className={primaryButton}>
                  {isLogin ? 'Login' : 'Create Account'}
                </button>
              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
