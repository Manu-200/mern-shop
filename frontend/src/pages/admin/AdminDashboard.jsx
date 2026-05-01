import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { fmt } from '../../utils/format';

const StatBox = ({ label, value, sub }) => (
  <div style={{ background: 'var(--warm-white)', border: '1px solid var(--stone)', padding: '28px 32px' }}>
    <p style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: 12 }}>{label}</p>
    <p style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 300 }}>{value}</p>
    {sub && <p style={{ fontSize: 12, color: 'var(--ink-faint)', marginTop: 6 }}>{sub}</p>}
  </div>
);

export default function AdminDashboard() {
  const [orders, setOrders]     = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/orders/admin/all?limit=5'),
      api.get('/products?sort=popular&limit=5')
    ]).then(([o, p]) => {
      setOrders(o.data.orders);
      setProducts(p.data.products);
    }).finally(() => setLoading(false));
  }, []);

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const processing = orders.filter(o => o.orderStatus === 'processing').length;

  return (
    <div style={{ padding: '48px 0 96px' }}>
      <div className="container">
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: 8 }}>Admin</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 300 }}>Dashboard</h1>
        </div>

        {/* Quick nav */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 48 }}>
          {[['Manage Products', '/admin/products'], ['Manage Orders', '/admin/orders']].map(([l, to]) => (
            <Link key={l} to={to} className="btn btn-outline btn-sm">{l}</Link>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 56 }}>
          <StatBox label="Total Orders" value={orders.length} />
          <StatBox label="Pending" value={processing} sub="Need attention" />
          <StatBox label="Revenue (shown)" value={fmt(totalRevenue)} sub="Last 5 orders" />
          <StatBox label="Products" value={products.length} sub="Active listings" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          {/* Recent Orders */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 300 }}>Recent Orders</h2>
              <Link to="/admin/orders" style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', borderBottom: '1px solid var(--ink)', paddingBottom: 1 }}>View All</Link>
            </div>
            <div style={{ border: '1px solid var(--stone)' }}>
              {loading ? <div style={{ padding: 32, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div> :
                orders.slice(0, 5).map((order, i) => (
                  <div key={order._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: i < 4 ? '1px solid var(--stone)' : 'none' }}>
                    <div>
                      <p style={{ fontSize: 13, fontFamily: 'monospace' }}>#{order._id.slice(-8).toUpperCase()}</p>
                      <p style={{ fontSize: 12, color: 'var(--taupe)' }}>{order.user?.name}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 14, fontWeight: 500 }}>{fmt(order.total)}</p>
                      <span style={{ fontSize: 11, color: order.orderStatus === 'processing' ? '#856404' : '#2d6a4f', textTransform: 'capitalize' }}>{order.orderStatus}</span>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>

          {/* Top Products */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 300 }}>Top Products</h2>
              <Link to="/admin/products" style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', borderBottom: '1px solid var(--ink)', paddingBottom: 1 }}>Manage</Link>
            </div>
            <div style={{ border: '1px solid var(--stone)' }}>
              {loading ? <div style={{ padding: 32, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div> :
                products.map((p, i) => (
                  <div key={p._id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 20px', borderBottom: i < products.length - 1 ? '1px solid var(--stone)' : 'none' }}>
                    <img src={p.images[0]} alt="" style={{ width: 40, height: 50, objectFit: 'cover', background: 'var(--warm-white)', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--taupe)' }}>{p.sold} sold · {fmt(p.price)}</p>
                    </div>
                    <p style={{ fontSize: 12, color: p.stock < 10 ? 'var(--red)' : 'var(--ink-faint)' }}>{p.stock} left</p>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
