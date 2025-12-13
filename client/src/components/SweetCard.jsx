import React, { useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

export default function SweetCard({ sweet, onUpdated, onDeleted }) {
  const { user, token } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [editPrice, setEditPrice] = useState(sweet.price);
  const [editQuantity, setEditQuantity] = useState(sweet.quantity);
  const [busy, setBusy] = useState(false);

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
    <div className="sweet-card">
      <div>
        <h3>{sweet.name}</h3>
        <p className="muted">{sweet.category}</p>
        <p>${sweet.price.toFixed(2)}</p>
        <p data-testid="quantity">Qty: {sweet.quantity}</p>
      </div>
      <div className="actions">
        <button onClick={purchase} disabled={canPurchase} aria-label={`purchase-${sweet.name}`}>
          Purchase
        </button>
        {user?.role === 'admin' && (
          <>
            <button onClick={restock} disabled={busy} aria-label={`restock-${sweet.name}`}>
              Restock
            </button>
            <button onClick={() => setIsUpdating((v) => !v)} disabled={busy} aria-label={`edit-${sweet.name}`}>
              {isUpdating ? 'Cancel' : 'Edit'}
            </button>
            <button onClick={remove} disabled={busy} aria-label={`delete-${sweet.name}`}>
              Delete
            </button>
          </>
        )}
      </div>
      {isUpdating && user?.role === 'admin' && (
        <div className="edit-form">
          <label>
            Price
            <input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
          </label>
          <label>
            Quantity
            <input type="number" value={editQuantity} onChange={(e) => setEditQuantity(e.target.value)} />
          </label>
          <button onClick={update} disabled={busy} aria-label={`save-${sweet.name}`}>
            Save
          </button>
        </div>
      )}
    </div>
  );
}
