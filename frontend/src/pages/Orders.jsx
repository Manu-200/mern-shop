import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { fmt, fmtDate, statusColor, statusBg } from '../utils/format';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders').then(r => setOrders(r.data.orders)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div style={{ padding: '48px 0 96px' }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 300, marginBottom: 8 }}>My Orders</h1>
        <p style={{ color: 'var(--ink-faint)', marginBottom: 48 }}>{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 32, marginBottom: 16 }}>No orders yet</p>
            <Link to="/shop" className="btn btn-dark">Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {orders.map(order => (
              <div key={order._id} className="fade-up" style={{ border: '1px solid var(--stone)', padding: '28px 32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div>
                    <p style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: 6 }}>Order</p>
                    <p style={{ fontFamily: 'monospace', fontSize: 14 }}>#{order._id.slice(-8).toUpperCase()}</p>
                    <p style={{ fontSize: 12, color: 'var(--taupe)', marginTop: 4 }}>{fmtDate(order.createdAt)}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'inline-block', padding: '4px 12px', fontSize: 11, letterSpacing: 1, fontWeight: 500, textTransform: 'capitalize', background: statusBg(order.orderStatus), color: statusColor(order.orderStatus) }}>
                      {order.orderStatus}
                    </span>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginTop: 8 }}>{fmt(order.total)}</p>
                  </div>
                </div>

                {/* Items preview */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                  {order.items.slice(0, 4).map((item, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <img src={item.image} alt={item.name} style={{ width: 64, height: 78, objectFit: 'cover', background: 'var(--warm-white)' }} />
                      {i === 3 && order.items.length > 4 && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,21,18,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14 }}>
                          +{order.items.length - 4}
                        </div>
                      )}
                    </div>
                  ))}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: 8 }}>
                    <p style={{ fontSize: 14 }}>{order.items.map(i => i.name).join(', ')}</p>
                    <p style={{ fontSize: 12, color: 'var(--taupe)', marginTop: 4 }}>{order.items.reduce((s, i) => s + i.quantity, 0)} item{order.items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--stone)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: 13, color: 'var(--ink-faint)' }}>
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                    {order.trackingNumber && ` · Tracking: ${order.trackingNumber}`}
                  </p>
                  <Link to={`/order-success/${order._id}`} style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', borderBottom: '1px solid var(--ink)', paddingBottom: 2, fontWeight: 500 }}>
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
