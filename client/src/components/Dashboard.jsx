import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../AuthContext';
import SweetCard from './SweetCard';

export default function Dashboard() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ q: '', category: '', minPrice: '', maxPrice: '' });
  const [newSweet, setNewSweet] = useState({ name: '', category: '', price: '', quantity: '' });

  const inputClass = 'rounded-xl border border-[#e2e8f0] bg-white/80 py-[0.85rem] px-3.5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/25 focus:border-[#7c3aed] placeholder:text-slate-400';
  const buttonClass = 'rounded-xl border border-transparent bg-gradient-to-r from-[#7c3aed] via-[#6366f1] to-[#22d3ee] text-white py-[0.85rem] px-4 font-semibold shadow-[0_12px_30px_rgba(124,58,237,0.28)] transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed';

  const authHeaders = useMemo(() => ({ headers: { Authorization: `Bearer ${token}` } }), [token]);

  const stats = useMemo(() => {
    const total = sweets.length;
    const categories = new Set(sweets.map((s) => s.category || 'Uncategorized')).size;
    return { total, categories };
  }, [sweets]);

  const fetchSweets = async (params = {}) => {
    setLoading(true);
    try {
      const endpoint = Object.keys(params).length ? '/sweets/search' : '/sweets';
      const { data } = await api.get(endpoint, { ...authHeaders, params });
      setSweets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateSweet = (updated) => {
    setSweets((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const deleteSweet = (id) => {
    setSweets((prev) => prev.filter((s) => s.id !== id));
  };

  const onFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const onSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (filters.q) params.q = filters.q;
    if (filters.category) params.category = filters.category;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    fetchSweets(params);
  };

  const onCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: newSweet.name,
        category: newSweet.category,
        price: Number(newSweet.price),
        quantity: Number(newSweet.quantity),
      };
      const { data } = await api.post('/sweets', payload, authHeaders);
      setSweets((prev) => [data, ...prev]);
      setNewSweet({ name: '', category: '', price: '', quantity: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Create failed');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col gap-5 relative px-3 sm:px-4 md:px-6 pb-8">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#f9fafb] via-[#f5f7fb] to-[#eef2ff]" />
      <div className="absolute -top-10 right-6 w-48 h-48 bg-[#c7d2fe] opacity-18 blur-[140px]" />
      <div className="absolute top-20 left-2 w-56 h-56 bg-[#a5f3fc] opacity-16 blur-[160px]" />

      <header className="flex justify-between items-start gap-3 max-sm:flex-col max-sm:items-start px-1 pt-3">
        <div className="flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 text-[#4338ca] text-xs font-semibold uppercase tracking-[0.14em] w-fit border border-[#e2e8f0] shadow-[0_8px_26px_rgba(15,23,42,0.06)]">
            Sweet suite
          </div>
          <div className="space-y-1">
            <h1 className="text-[2.15rem] sm:text-[2.35rem] font-semibold text-slate-900 leading-tight">Sweets Dashboard</h1>
            <p className="text-slate-500">Welcome, {user?.name || user?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 max-sm:w-full max-sm:justify-between">
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-[#e2e8f0] bg-white/90 px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-[0_10px_26px_rgba(15,23,42,0.08)] transition hover:-translate-y-[1px] hover:shadow-[0_12px_30px_rgba(15,23,42,0.12)]"
          >
            Logout
          </button>
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 bg-white/90 backdrop-blur px-3 py-2 rounded-full border border-[#e2e8f0] shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            Live inventory synced
          </div>
        </div>
      </header>

      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {[{ title: 'Total sweets', value: stats.total, accent: 'from-[#16a34a] to-[#15803d]', pill: 'Increased from last week' }, { title: 'Categories', value: stats.categories, accent: 'from-[#22d3ee] to-[#0284c7]', pill: 'Growing assortment' }].map((card, idx) => (
          <div
            key={card.title}
            className={`rounded-[14px] p-4 shadow-[0_14px_30px_rgba(15,23,42,0.08)] border border-[#e5e7eb] flex flex-col gap-2 min-h-[150px] ${
              idx === 0 ? 'bg-gradient-to-br from-[#047857] via-[#0f766e] to-[#16a34a] text-white' : 'bg-white/95 backdrop-blur text-slate-900'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className={`text-xs uppercase tracking-[0.14em] ${idx === 0 ? 'text-white/80' : 'text-slate-500'}`}>{card.title}</div>
              <span className={`h-7 w-7 rounded-full border ${idx === 0 ? 'border-white/30' : 'border-[#e2e8f0]'} inline-flex items-center justify-center text-[12px] font-semibold ${idx === 0 ? 'text-white' : 'text-slate-600'}`}>
                ↗
              </span>
            </div>
            <div className="text-[2.1rem] leading-none font-semibold">{card.value}</div>
            <div className="mt-auto flex items-center gap-2 text-xs font-medium">
              <span className={`h-5 w-5 rounded-full bg-gradient-to-br ${card.accent} inline-flex items-center justify-center text-[11px] text-white`}>↑</span>
              <span className={idx === 0 ? 'text-white/85' : 'text-slate-600'}>{card.pill}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="bg-white/90 backdrop-blur border border-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] rounded-[18px] p-4 sm:p-5">
        <form onSubmit={onSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <input name="q" placeholder="Search name" value={filters.q} onChange={onFilterChange} className={inputClass} />
          <input name="category" placeholder="Category" value={filters.category} onChange={onFilterChange} className={inputClass} />
          <input name="minPrice" type="number" placeholder="Min price" value={filters.minPrice} onChange={onFilterChange} className={inputClass} />
          <input name="maxPrice" type="number" placeholder="Max price" value={filters.maxPrice} onChange={onFilterChange} className={inputClass} />
          <button type="submit" className={buttonClass}>Search</button>
        </form>
        <p className="text-xs text-slate-500 mt-2">Tip: combine name + category for tighter results.</p>
      </section>

      {user?.role === 'admin' && (
        <section className="bg-white/90 backdrop-blur border border-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] rounded-[18px] p-4 sm:p-5">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
            <h2 className="text-[1.4rem] sm:text-[1.5rem] font-semibold text-slate-900">Admin: Add Sweet</h2>
            <span className="text-xs uppercase tracking-[0.15em] text-[#7c3aed] bg-[#f3e8ff] px-3 py-1 rounded-full">manage</span>
          </div>
          <form onSubmit={onCreate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 mt-2">
            <input name="name" placeholder="Name" value={newSweet.name} onChange={(e) => setNewSweet({ ...newSweet, name: e.target.value })} className={inputClass} required />
            <input name="category" placeholder="Category" value={newSweet.category} onChange={(e) => setNewSweet({ ...newSweet, category: e.target.value })} className={inputClass} required />
            <input name="price" type="number" placeholder="Price" value={newSweet.price} onChange={(e) => setNewSweet({ ...newSweet, price: e.target.value })} className={inputClass} required />
            <input name="quantity" type="number" placeholder="Quantity" value={newSweet.quantity} onChange={(e) => setNewSweet({ ...newSweet, quantity: e.target.value })} className={inputClass} required />
            <button type="submit" className={buttonClass}>Create</button>
          </form>
        </section>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 pb-4">
        {loading ? (
          <p>Loading sweets...</p>
        ) : sweets.length === 0 ? (
          <p className="text-slate-500">No sweets found.</p>
        ) : (
          sweets.map((sweet) => (
            <SweetCard key={sweet.id} sweet={sweet} onUpdated={updateSweet} onDeleted={deleteSweet} />
          ))
        )}
      </section>
    </div>
  );
}
