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
    'flex flex-col gap-1 text-[0.9rem] font-semibold text-[#0f172a]';

  const inputClass =
    'rounded-[12px] border border-[#e2e8f0] bg-white/80 px-3.5 py-3 text-[#0f172a] shadow-[0_8px_24px_rgba(15,23,42,0.04)] ' +
    'placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/30 focus:border-[#7c3aed] backdrop-blur';

  const toggleButton =
    'rounded-[12px] py-2.5 text-sm font-semibold transition-all duration-200';

  const activeToggle =
    'bg-gradient-to-r from-[#7c3aed] via-[#6366f1] to-[#22d3ee] text-white shadow-[0_12px_30px_rgba(124,58,237,0.32)]';

  const primaryButton =
    'mt-3 rounded-[14px] bg-gradient-to-r from-[#7c3aed] via-[#6366f1] to-[#22d3ee] ' +
    'py-3.5 text-white font-semibold tracking-wide ' +
    'shadow-[0_16px_40px_rgba(124,58,237,0.35)] ' +
    'hover:brightness-110 transition-transform duration-200 hover:-translate-y-[1px]';

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
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#0b1223] to-[#0f172a]">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,_#6366f1,_transparent_35%),radial-gradient(circle_at_80%_10%,_#22d3ee,_transparent_30%),radial-gradient(circle_at_50%_80%,_#a855f7,_transparent_28%)]" />
      <div className="relative min-h-screen w-full flex items-center justify-center px-3 sm:px-6 md:px-10 py-6 md:py-12">
        <div className="relative flex flex-col md:flex-row items-center md:items-stretch h-auto md:h-full w-full max-w-[1280px] gap-8 lg:gap-14">

          {/* LEFT VISUAL */}
          <div className="relative hidden md:flex flex-[1.05] flex-col justify-center px-6 lg:px-10 xl:px-14 overflow-hidden text-white md:min-h-[520px]">
            <span className="inline-flex items-center gap-2 bg-white/15 text-white px-4 py-1.5 rounded-full font-semibold w-fit backdrop-blur">
              🍬 Sweet Shop Suite
            </span>

            <h1 className="mt-6 text-[3rem] lg:text-[3.6rem] xl:text-[3.9rem] font-black leading-[1.05] tracking-[-0.03em] max-w-[580px] drop-shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
              Manage <br />
              confections <br />
              with{' '}
              <span className="bg-gradient-to-r from-[#4f46e5] to-[#ec4899] bg-clip-text text-transparent">
                style
              </span>.
            </h1>

            <div className="relative z-10">
              <p className="mt-4 max-w-[460px] text-[1.05rem] text-white/80 leading-relaxed">
                Modern dashboards, instant inventory, and smooth authentication
                flows tailored to your sweet shop.
              </p>

              <ul className="mt-4 space-y-2 text-white/85 text-[0.98rem]">
                <li className="flex items-start gap-2">
                  <span className="mt-[3px] text-[#22d3ee]">●</span>
                  <span>Batch-wise shelf-life alerts so laddus and pedas move while fresh.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-[3px] text-[#a855f7]">●</span>
                  <span>Festival mode pricing: flip Diwali/Christmas rate cards in seconds.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-[3px] text-[#f472b6]">●</span>
                  <span>Staff shifts and cash counter summaries on one calming dashboard.</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 max-w-[360px] text-sm text-white/80">
              <div className="rounded-2xl bg-white/10 backdrop-blur px-4 py-3 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                <p className="font-semibold text-white">Fresh stock</p>
                <p>Move best-sellers before shelf-life dips.</p>
              </div>
              <div className="rounded-2xl bg-white/10 backdrop-blur px-4 py-3 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                <p className="font-semibold text-white">Festival mode</p>
                <p>Swap rate cards instantly for peak days.</p>
              </div>
            </div>

            {/* doodles */}
            <span className="pointer-events-none absolute top-[10%] right-[18%] text-[2.6rem] opacity-70 drop-shadow-[0_12px_24px_rgba(0,0,0,0.25)] z-0">🍭</span>
            <span className="pointer-events-none absolute bottom-[12%] right-[16%] text-[3rem] opacity-70 drop-shadow-[0_12px_24px_rgba(0,0,0,0.25)] z-0">🍩</span>
            <span className="pointer-events-none absolute top-[58%] left-[10%] text-[2.6rem] opacity-70 drop-shadow-[0_12px_24px_rgba(0,0,0,0.25)] z-0">🍬</span>

            {/* glow */}
            <div className="absolute -z-10 top-[10%] left-[30%] w-[420px] h-[420px] rounded-full bg-[#6366f1] opacity-40 blur-[160px]" />
            <div className="absolute -z-10 bottom-[8%] left-[12%] w-[360px] h-[360px] rounded-full bg-[#22d3ee] opacity-35 blur-[160px]" />
          </div>

          {/* RIGHT AUTH CARD */}
          <div className="flex flex-1 items-center justify-center px-2 sm:px-4 md:px-6 pb-4 md:pb-0 w-full">
            <div className="relative w-full max-w-[480px] bg-white/85 backdrop-blur-xl rounded-[28px] p-7 sm:p-8 md:p-9 border border-white/70 shadow-[0_34px_90px_rgba(15,23,42,0.28)]">

              <div className="absolute -top-8 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-[#22d3ee] to-[#6366f1] opacity-80 blur-[18px]" />
              <div className="absolute -bottom-10 left-4 w-24 h-24 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#ec4899] opacity-50 blur-[28px]" />
              <div className="absolute -left-6 top-24 w-16 h-16 rounded-full bg-gradient-to-br from-[#22d3ee] to-transparent opacity-60 blur-[20px]" />

              {/* Toggle */}
              <div className="relative grid grid-cols-2 gap-2 mb-6 rounded-[14px] bg-white/80 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
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
              <form onSubmit={onSubmit} className="flex flex-col gap-3 relative z-10">
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
