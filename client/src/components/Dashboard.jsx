import React, { useEffect, useMemo, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';
import SweetCard from './SweetCard';

export default function Dashboard() {
  const { token, user } = useAuth();
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ q: '', category: '', minPrice: '', maxPrice: '' });
  const [newSweet, setNewSweet] = useState({ name: '', category: '', price: '', quantity: '' });

  const inputClass = 'rounded-[10px] border border-[#cbd5e1] bg-white py-[0.75rem] px-3';
  const buttonClass = 'rounded-[10px] border border-[#cbd5e1] bg-[#e2e8f0] py-[0.7rem] px-4 cursor-pointer transition duration-200 ease-linear disabled:opacity-60 disabled:cursor-not-allowed';

  const authHeaders = useMemo(() => ({ headers: { Authorization: `Bearer ${token}` } }), [token]);

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

  return (
    <div className="flex flex-col gap-5">
      <header className="flex justify-between items-end max-sm:flex-col max-sm:items-start max-sm:gap-2">
        <div>
          <p className="text-slate-500">Welcome, {user?.name || user?.email}</p>
          <h1 className="text-[2rem] font-bold">Sweets Dashboard</h1>
        </div>
      </header>

      <section className="bg-white border border-[#e2e8f0] rounded-[14px] p-4">
        <form onSubmit={onSearch} className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
          <input name="q" placeholder="Search name" value={filters.q} onChange={onFilterChange} className={inputClass} />
          <input name="category" placeholder="Category" value={filters.category} onChange={onFilterChange} className={inputClass} />
          <input name="minPrice" type="number" placeholder="Min price" value={filters.minPrice} onChange={onFilterChange} className={inputClass} />
          <input name="maxPrice" type="number" placeholder="Max price" value={filters.maxPrice} onChange={onFilterChange} className={inputClass} />
          <button type="submit" className={buttonClass}>Search</button>
        </form>
      </section>

      {user?.role === 'admin' && (
        <section className="bg-white border border-[#e2e8f0] rounded-[14px] p-4">
          <h2 className="text-[1.5rem] font-semibold">Admin: Add Sweet</h2>
          <form onSubmit={onCreate} className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-2 mt-2">
            <input name="name" placeholder="Name" value={newSweet.name} onChange={(e) => setNewSweet({ ...newSweet, name: e.target.value })} className={inputClass} required />
            <input name="category" placeholder="Category" value={newSweet.category} onChange={(e) => setNewSweet({ ...newSweet, category: e.target.value })} className={inputClass} required />
            <input name="price" type="number" placeholder="Price" value={newSweet.price} onChange={(e) => setNewSweet({ ...newSweet, price: e.target.value })} className={inputClass} required />
            <input name="quantity" type="number" placeholder="Quantity" value={newSweet.quantity} onChange={(e) => setNewSweet({ ...newSweet, quantity: e.target.value })} className={inputClass} required />
            <button type="submit" className={buttonClass}>Create</button>
          </form>
        </section>
      )}

      <section className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
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
