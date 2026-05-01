import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { fmt, fmtDate, statusColor, statusBg } from '../../utils/format';
import toast from 'react-hot-toast';

const STATUSES = ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'];

function OrderDetailModal({ order, onClose, onUpdated }) {
  const [status, setStatus]     = useState(order.orderStatus);
  const [tracking, setTracking] = useState(order.trackingNumber || '');
  const [saving, setSaving]     = useState(false);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const r = await api.put(`/orders/admin/${order._id}/status`, { orderStatus: status, trackingNumber: tracking });
      onUpdated(r.data.order);
      toast.success('Order updated');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,21,18,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: 'var(--cream)', width: '100%', maxWidth: 640, maxHeight: '90vh', overflowY: 'auto', padding: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: 6 }}>Order</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 300 }}>#{order._id.slice(-8).toUpperCase()}</h2>
            <p style={{ color: 'var(--ink-faint)', fontSize: 13, marginTop: 4 }}>{fmtDate(order.createdAt)}</p>
          </div>
          <button onClick={onClose} style={{ fontSize: 22, color: 'var(--taupe)' }}>✕</button>
        </div>

        {/* Customer */}
        <div style={{ background: 'var(--warm-white)', padding: '20px 24px', marginBottom: 24 }}>
          <p style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: 10 }}>Customer</p>
          <p style={{ fontSize: 14, fontWeight: 500 }}>{order.user?.name || order.shippingAddress.fullName}</p>
          <p style={{ fontSize: 13, color: 'var(--ink-faint)', marginTop: 4 }}>{order.user?.email}</p>
        </div>

        {/* Shipping address */}
        <div style={{ background: 'var(--warm-white)', padding: '20px 24px', marginBottom: 24 }}>
          <p style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: 10 }}>Ship To</p>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>
            {order.shippingAddress.fullName}<br />
            {order.shippingAddress.street}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
            {order.shippingAddress.country}
          </p>
        </div>

        {/* Items */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: 14 }}>Items</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <img src={item.image} alt={item.name} style={{ width: 52, height: 64, objectFit: 'cover', background: 'var(--stone)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--taupe)', marginTop: 2 }}>
                    {[item.size && `Size: ${item.size}`, item.color && item.color, `× ${item.quantity}`].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <p style={{ fontSize: 14, fontWeight: 500 }}>{fmt(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div style={{ background: 'var(--warm-white)', padding: '20px 24px', marginBottom: 28 }}>
          {[
            ['Subtotal', fmt(order.subtotal)],
            ['Shipping', order.shippingCost === 0 ? 'Free' : fmt(order.shippingCost)],
            ['Tax', fmt(order.tax)],
          ].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
              <span style={{ color: 'var(--ink-faint)' }}>{l}</span><span>{v}</span>
            </div>
          ))}
          <hr style={{ border: 'none', borderTop: '1px solid var(--stone)', margin: '12px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>Total</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>{fmt(order.total)}</span>
          </div>
        </div>

        {/* Update status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="input-label">Update Status</label>
            <select className="input" value={status} onChange={e => setStatus(e.target.value)} style={{ cursor: 'pointer' }}>
              {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          {(status === 'shipped' || order.trackingNumber) && (
            <div>
              <label className="input-label">Tracking Number</label>
              <input className="input" placeholder="e.g. 1Z999AA10123456784" value={tracking} onChange={e => setTracking(e.target.value)} />
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8 }}>
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-dark" onClick={handleUpdate} disabled={saving}>
              {saving ? 'Saving…' : 'Update Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrders() {
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [statusFilter, setFilter]   = useState('');
  const [selected, setSelected]     = useState(null);
  const [page, setPage]             = useState(1);
  const [total, setTotal]           = useState(0);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (statusFilter) params.set('status', statusFilter);
      const r = await api.get(`/orders/admin/all?${params}`);
      setOrders(r.data.orders);
      setTotal(r.data.total);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [page, statusFilter]);

  const handleUpdated = (updated) => {
    setOrders(o => o.map(x => x._id === updated._id ? updated : x));
  };

  const thStyle = {
    fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--taupe)',
    padding: '12px 16px', textAlign: 'left', fontWeight: 500,
    borderBottom: '1px solid var(--stone)', background: 'var(--warm-white)'
  };
  const tdStyle = { padding: '14px 16px', borderBottom: '1px solid var(--stone)', fontSize: 13, verticalAlign: 'middle' };

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div style={{ padding: '48px 0 96px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: 8 }}>Admin</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 300 }}>Orders</h1>
          <p style={{ color: 'var(--ink-faint)', marginTop: 4 }}>{total} orders total</p>
        </div>

        {/* Quick stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 36 }}>
          {['all', ...STATUSES].map(s => {
            const count = s === 'all' ? orders.length : orders.filter(o => o.orderStatus === s).length;
            const isActive = (s === 'all' && !statusFilter) || s === statusFilter;
            return (
              <button key={s} onClick={() => { setFilter(s === 'all' ? '' : s); setPage(1); }}
                style={{
                  padding: '14px 16px', textAlign: 'left', border: `1px solid ${isActive ? 'var(--ink)' : 'var(--stone)'}`,
                  background: isActive ? 'var(--ink)' : 'transparent', cursor: 'pointer', transition: 'all 0.2s'
                }}>
                <p style={{ fontSize: 18, fontFamily: 'var(--font-display)', fontWeight: 300, color: isActive ? 'var(--cream)' : 'var(--ink)' }}>{count}</p>
                <p style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'capitalize', color: isActive ? 'rgba(250,248,245,0.6)' : 'var(--taupe)', marginTop: 4 }}>{s}</p>
              </button>
            );
          })}
        </div>

        {/* Revenue banner */}
        <div style={{ background: 'var(--ink)', color: 'var(--cream)', padding: '20px 28px', marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: 13, color: 'rgba(250,248,245,0.6)', letterSpacing: 1 }}>Revenue from {statusFilter || 'all'} orders</p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 300 }}>{fmt(totalRevenue)}</p>
        </div>

        {/* Table */}
        <div style={{ border: '1px solid var(--stone)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Order ID', 'Customer', 'Date', 'Items', 'Total', 'Payment', 'Status', 'Actions'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 56 }}><div className="spinner" style={{ margin: '0 auto' }} /></td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 56, color: 'var(--ink-faint)', fontStyle: 'italic' }}>No orders found</td></tr>
              ) : orders.map(order => (
                <tr key={order._id}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--warm-white)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  style={{ transition: 'background 0.15s', cursor: 'pointer' }}
                  onClick={() => setSelected(order)}>
                  <td style={tdStyle}>
                    <p style={{ fontFamily: 'monospace', fontSize: 12 }}>#{order._id.slice(-8).toUpperCase()}</p>
                  </td>
                  <td style={tdStyle}>
                    <p style={{ fontWeight: 500 }}>{order.user?.name || '—'}</p>
                    <p style={{ fontSize: 11, color: 'var(--taupe)', marginTop: 2 }}>{order.user?.email}</p>
                  </td>
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap', color: 'var(--ink-faint)' }}>
                    {fmtDate(order.createdAt)}
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: -8 }}>
                      {order.items.slice(0, 3).map((item, i) => (
                        <img key={i} src={item.image} alt="" style={{ width: 32, height: 40, objectFit: 'cover', background: 'var(--stone)', marginLeft: i > 0 ? -8 : 0, border: '1px solid var(--cream)' }} />
                      ))}
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--taupe)', marginTop: 4 }}>
                      {order.items.reduce((s, i) => s + i.quantity, 0)} item{order.items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''}
                    </p>
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 500 }}>{fmt(order.total)}</td>
                  <td style={tdStyle}>
                    <span style={{
                      fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', padding: '3px 8px',
                      background: order.paymentStatus === 'paid' ? 'rgba(45,106,79,0.1)' : 'rgba(192,57,43,0.1)',
                      color: order.paymentStatus === 'paid' ? 'var(--green)' : 'var(--red)'
                    }}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{
                      fontSize: 11, letterSpacing: 1, textTransform: 'capitalize', padding: '4px 10px',
                      background: statusBg(order.orderStatus), color: statusColor(order.orderStatus)
                    }}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td style={tdStyle} onClick={e => e.stopPropagation()}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setSelected(order)}>
                      Manage →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {Math.ceil(total / 20) > 1 && (
          <div style={{ display: 'flex', gap: 8, marginTop: 24, justifyContent: 'center' }}>
            {Array.from({ length: Math.ceil(total / 20) }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)} style={{
                width: 36, height: 36, border: `1px solid ${n === page ? 'var(--ink)' : 'var(--stone)'}`,
                background: n === page ? 'var(--ink)' : 'transparent', color: n === page ? 'var(--cream)' : 'var(--ink)',
                fontSize: 13, cursor: 'pointer', transition: 'all 0.2s'
              }}>{n}</button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <OrderDetailModal
          order={selected}
          onClose={() => setSelected(null)}
          onUpdated={handleUpdated}
        />
      )}
    </div>
  );
}
