import React, { useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

export default function SweetCard({ sweet, onUpdated, onDeleted }) {
  const { user, token } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [editPrice, setEditPrice] = useState(sweet.price);
  const [editQuantity, setEditQuantity] = useState(sweet.quantity);
  const [busy, setBusy] = useState(false);

  const inputClass = 'rounded-[10px] border border-[#cbd5e1] bg-white py-[0.75rem] px-3';
  const buttonClass = 'rounded-[10px] border border-[#cbd5e1] bg-[#e2e8f0] py-[0.7rem] px-4 cursor-pointer transition duration-200 ease-linear disabled:opacity-60 disabled:cursor-not-allowed';

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
    <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-4 flex flex-col gap-3 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
      <div className="space-y-1">
        <h3 className="text-[1.17rem] font-semibold">{sweet.name}</h3>
        <p className="text-slate-500">{sweet.category}</p>
        <p>${sweet.price.toFixed(2)}</p>
        <p data-testid="quantity">Qty: {sweet.quantity}</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        <button className={buttonClass} onClick={purchase} disabled={canPurchase} aria-label={`purchase-${sweet.name}`}>
          Purchase
        </button>
        {user?.role === 'admin' && (
          <>
            <button className={buttonClass} onClick={restock} disabled={busy} aria-label={`restock-${sweet.name}`}>
              Restock
            </button>
            <button className={buttonClass} onClick={() => setIsUpdating((v) => !v)} disabled={busy} aria-label={`edit-${sweet.name}`}>
              {isUpdating ? 'Cancel' : 'Edit'}
            </button>
            <button className={buttonClass} onClick={remove} disabled={busy} aria-label={`delete-${sweet.name}`}>
              Delete
            </button>
          </>
        )}
      </div>
      {isUpdating && user?.role === 'admin' && (
        <div className="grid grid-cols-2 gap-2 items-center">
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
