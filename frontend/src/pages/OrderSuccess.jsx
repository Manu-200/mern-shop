import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { fmt, fmtDate } from '../utils/format';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then(r => setOrder(r.data.order)).catch(console.error);
  }, [id]);

  return (
    <div style={{ padding: '80px 0 96px' }}>
      <div className="container" style={{ maxWidth: 640, margin: '0 auto' }}>
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 28 }}>
            ✓
          </div>
          <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: 12 }}>Order Confirmed</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 300, marginBottom: 12 }}>Thank you</h1>
          <p style={{ color: 'var(--ink-faint)', lineHeight: 1.7 }}>
            Your order has been placed and is being processed.<br />
            You'll receive a confirmation shortly.
          </p>
        </div>

        {order && (
          <div className="fade-up" style={{ background: 'var(--warm-white)', padding: 36, marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--stone)' }}>
              <div>
                <p style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: 6 }}>Order ID</p>
                <p style={{ fontSize: 13, fontFamily: 'monospace' }}>#{order._id.slice(-8).toUpperCase()}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: 6 }}>Date</p>
                <p style={{ fontSize: 13 }}>{fmtDate(order.createdAt)}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: 6 }}>Total</p>
                <p style={{ fontSize: 18, fontFamily: 'var(--font-display)' }}>{fmt(order.total)}</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
              {order.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span>{item.name} {item.size ? `(${item.size})` : ''} × {item.quantity}</span>
                  <span>{fmt(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--stone)', paddingTop: 16 }}>
              <p style={{ fontSize: 13, color: 'var(--ink-faint)' }}>
                Shipping to: {order.shippingAddress.fullName}, {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
              </p>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <Link to="/orders" className="btn btn-outline">View All Orders</Link>
          <Link to="/shop" className="btn btn-dark">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
