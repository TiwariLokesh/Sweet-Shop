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
    <div className="dashboard">
      <header className="dash-header">
        <div>
          <p className="muted">Welcome, {user?.name || user?.email}</p>
          <h1>Sweets Dashboard</h1>
        </div>
      </header>

      <section className="filters">
        <form onSubmit={onSearch} className="filter-grid">
          <input name="q" placeholder="Search name" value={filters.q} onChange={onFilterChange} />
          <input name="category" placeholder="Category" value={filters.category} onChange={onFilterChange} />
          <input name="minPrice" type="number" placeholder="Min price" value={filters.minPrice} onChange={onFilterChange} />
          <input name="maxPrice" type="number" placeholder="Max price" value={filters.maxPrice} onChange={onFilterChange} />
          <button type="submit">Search</button>
        </form>
      </section>

      {user?.role === 'admin' && (
        <section className="card">
          <h2>Admin: Add Sweet</h2>
          <form onSubmit={onCreate} className="new-sweet-form">
            <input name="name" placeholder="Name" value={newSweet.name} onChange={(e) => setNewSweet({ ...newSweet, name: e.target.value })} required />
            <input name="category" placeholder="Category" value={newSweet.category} onChange={(e) => setNewSweet({ ...newSweet, category: e.target.value })} required />
            <input name="price" type="number" placeholder="Price" value={newSweet.price} onChange={(e) => setNewSweet({ ...newSweet, price: e.target.value })} required />
            <input name="quantity" type="number" placeholder="Quantity" value={newSweet.quantity} onChange={(e) => setNewSweet({ ...newSweet, quantity: e.target.value })} required />
            <button type="submit">Create</button>
          </form>
        </section>
      )}

      <section className="grid">
        {loading ? (
          <p>Loading sweets...</p>
        ) : sweets.length === 0 ? (
          <p className="muted">No sweets found.</p>
        ) : (
          sweets.map((sweet) => (
            <SweetCard key={sweet.id} sweet={sweet} onUpdated={updateSweet} onDeleted={deleteSweet} />
          ))
        )}
      </section>
    </div>
  );
}
