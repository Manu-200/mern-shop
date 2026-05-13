import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { fmt } from '../utils/format';
import toast from 'react-hot-toast';

const TAX_RATE = 0.18; // Updated for GST
const FREE_SHIP = 8000;
const SHIP_COST = 150;

const Field = ({ label, children }) => (
  <div>
    <label className="input-label">{label}</label>
    {children}
  </div>
);

export default function Checkout() {
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || '', street: '', city: '', state: '', zip: '', country: 'IN',
    paymentMethod: 'card', notes: ''
  });
  const [placing, setPlacing] = useState(false);

  const shippingCost = subtotal >= FREE_SHIP ? 0 : SHIP_COST;
  const tax   = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + shippingCost + tax) * 100) / 100;

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.street || !form.city || !form.state || !form.zip) { toast.error('Please fill in all address fields'); return; }
    setPlacing(true);
    try {
      const r = await api.post('/orders', {
        shippingAddress: { fullName: form.fullName, street: form.street, city: form.city, state: form.state, zip: form.zip, country: form.country },
        paymentMethod: form.paymentMethod,
        notes: form.notes
      });
      await clearCart();
      toast.success('Order placed!');
      navigate(`/order-success/${r.data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not place order');
    } finally { setPlacing(false); }
  };

  const items = cart?.items || [];

  return (
    <div style={{ padding: '48px 0 96px' }}>
      <div className="container">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 300, marginBottom: 48 }}>Checkout</h1>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 64 }}>
          {/* Left — shipping + payment */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {/* Shipping */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 300, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--stone)' }}>Shipping Address</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Full Name">
                  <input className="input" value={form.fullName} onChange={e => set('fullName', e.target.value)} required />
                </Field>
                <Field label="Country">
                  <select className="input" value={form.country} onChange={e => set('country', e.target.value)}>
                    <option value="IN">India</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                  </select>
                </Field>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                <Field label="Street Address">
                  <input className="input" placeholder="123 Main Street" value={form.street} onChange={e => set('street', e.target.value)} required />
                </Field>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  <Field label="City">
                    <input className="input" value={form.city} onChange={e => set('city', e.target.value)} required />
                  </Field>
                  <Field label="State">
                    <input className="input" placeholder="NY" value={form.state} onChange={e => set('state', e.target.value)} required />
                  </Field>
                  <Field label="ZIP Code">
                    <input className="input" placeholder="10001" value={form.zip} onChange={e => set('zip', e.target.value)} required />
                  </Field>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 300, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--stone)' }}>Payment</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['card', 'paypal', 'bank'].map(m => (
                  <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', border: `1px solid ${form.paymentMethod === m ? 'var(--ink)' : 'var(--stone)'}`, cursor: 'pointer', transition: 'border-color 0.2s' }}>
                    <input type="radio" value={m} checked={form.paymentMethod === m} onChange={() => set('paymentMethod', m)} style={{ accentColor: 'var(--ink)' }} />
                    <span style={{ fontSize: 14, textTransform: 'capitalize' }}>{m === 'card' ? 'Credit / Debit Card' : m === 'paypal' ? 'PayPal' : 'Bank Transfer'}</span>
                  </label>
                ))}
              </div>
              {form.paymentMethod === 'card' && (
                <div style={{ marginTop: 16, padding: 16, background: 'var(--warm-white)', fontSize: 13, color: 'var(--ink-faint)', fontStyle: 'italic' }}>
                  Demo mode — no real payment processed. Order will be placed immediately.
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <Field label="Order Notes (optional)">
                <textarea className="input" rows={3} placeholder="Any special instructions…" value={form.notes} onChange={e => set('notes', e.target.value)} />
              </Field>
            </div>
          </div>

          {/* Right — order summary */}
          <div>
            <div style={{ background: 'var(--warm-white)', padding: 32, position: 'sticky', top: 90 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 300, marginBottom: 24 }}>Your Order</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                {items.map(item => (
                  <div key={item._id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <img src={item.product?.images?.[0]} alt="" style={{ width: 56, height: 68, objectFit: 'cover', background: 'var(--stone)' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product?.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--taupe)' }}>Qty {item.quantity} {item.size ? `· ${item.size}` : ''}</p>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{fmt((item.product?.price || 0) * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <hr className="divider" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                {[['Subtotal', fmt(subtotal)], ['Shipping', subtotal >= FREE_SHIP ? 'Free' : fmt(shippingCost)], ['GST', fmt(tax)]].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15 }}>
                    <span style={{ color: 'var(--ink-faint)' }}>{l}</span><span>{v}</span>
                  </div>
                ))}
              </div>
              <hr className="divider" />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 28 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>Total</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>{fmt(total)}</span>
              </div>
              <button type="submit" className="btn btn-dark btn-full" disabled={placing || items.length === 0}>
                {placing ? 'Placing Order…' : 'Place Order'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
