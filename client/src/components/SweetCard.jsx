import React, { useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

export default function SweetCard({ sweet, onUpdated, onDeleted }) {
  const { user, token } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [editPrice, setEditPrice] = useState(sweet.price);
  const [editQuantity, setEditQuantity] = useState(sweet.quantity);
  const [busy, setBusy] = useState(false);

  const inStock = sweet.quantity > 0;
  const stockClass = inStock
    ? 'bg-emerald-50 text-emerald-700'
    : 'bg-rose-50 text-rose-700';
  const stockLabel = inStock ? 'In stock' : 'Out of stock';

  const inputClass = 'rounded-xl border border-[#e2e8f0] bg-white/80 py-[0.75rem] px-3 shadow-[0_8px_22px_rgba(15,23,42,0.05)] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/25 focus:border-[#6366f1] placeholder:text-slate-400';
  const primaryButton = 'rounded-xl border border-transparent bg-gradient-to-r from-[#6366f1] to-[#4f46e5] text-white py-[0.65rem] px-4 font-semibold shadow-[0_12px_24px_rgba(79,70,229,0.22)] transition hover:brightness-105 disabled:opacity-60 disabled:cursor-not-allowed';
  const subtleButton = 'rounded-xl border border-[#e2e8f0] bg-white text-slate-700 py-[0.65rem] px-4 font-semibold shadow-[0_6px_16px_rgba(15,23,42,0.06)] transition hover:-translate-y-[1px] hover:shadow-[0_10px_20px_rgba(15,23,42,0.08)] disabled:opacity-60 disabled:cursor-not-allowed';

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const purchase = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const { data } = await api.post(`/sweets/${sweet.id}/purchase`, { quantity: 1 }, authHeaders);
      onUpdated(data);
    } catch (err) {
      // surface minimal feedback
      alert(err.response?.data?.message || 'Purchase failed');
    } finally {
      setBusy(false);
    }
  };

  const restock = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const { data } = await api.post(`/sweets/${sweet.id}/restock`, { quantity: 1 }, authHeaders);
      onUpdated(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Restock failed');
    } finally {
      setBusy(false);
    }
  };

  const update = async () => {
    setBusy(true);
    try {
      const { data } = await api.put(`/sweets/${sweet.id}`, { price: Number(editPrice), quantity: Number(editQuantity) }, authHeaders);
      onUpdated(data);
      setIsUpdating(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await api.delete(`/sweets/${sweet.id}`, authHeaders);
      onDeleted(sweet.id);
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    } finally {
      setBusy(false);
    }
  };

  const canPurchase = sweet.quantity <= 0 || busy;

  return (
    <div className="bg-white/90 backdrop-blur border border-white rounded-[18px] p-5 flex flex-col gap-3 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-[1.17rem] font-semibold text-slate-900">{sweet.name}</h3>
            <p className="text-slate-500 text-sm">Qty: {sweet.quantity}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-[#f3e8ff] text-[#7c3aed] font-semibold">{sweet.category}</span>
            <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-[0.12em] ${stockClass}`}>{stockLabel}</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-slate-700 font-semibold text-lg">${sweet.price.toFixed(2)}</p>
          <span className="text-[11px] uppercase tracking-[0.14em] text-slate-400">sweet</span>
        </div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-2">
        {user?.role !== 'admin' && (
          <button className={primaryButton} onClick={purchase} disabled={canPurchase} aria-label={`purchase-${sweet.name}`}>
            Purchase
          </button>
        )}
        {user?.role === 'admin' && (
          <>
            <button className={primaryButton} onClick={restock} disabled={busy} aria-label={`restock-${sweet.name}`}>
              Restock
            </button>
            <button className={subtleButton} onClick={() => setIsUpdating((v) => !v)} disabled={busy} aria-label={`edit-${sweet.name}`}>
              {isUpdating ? 'Cancel' : 'Edit'}
            </button>
            <button className={subtleButton} onClick={remove} disabled={busy} aria-label={`delete-${sweet.name}`}>
              Delete
            </button>
          </>
        )}
      </div>
      {isUpdating && user?.role === 'admin' && (
        <div className="grid grid-cols-2 gap-2 items-center pt-2 border-t border-[#e2e8f0]">
          <label className="flex flex-col gap-1 text-sm">
            Price
            <input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className={inputClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Quantity
            <input type="number" value={editQuantity} onChange={(e) => setEditQuantity(e.target.value)} className={inputClass} />
          </label>
          <button className={buttonClass} onClick={update} disabled={busy} aria-label={`save-${sweet.name}`}>
            Save
          </button>
        </div>
      )}
    </div>
  );
}
