import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { fmt } from '../utils/format';
import toast from 'react-hot-toast';

const TAX_RATE     = 0.08;
const FREE_SHIP    = 100;
const SHIP_COST    = 9.99;

export default function Cart() {
  const { cart, subtotal, itemCount, updateItem, removeItem, loading } = useCart();
  const navigate = useNavigate();

  const shippingCost = subtotal >= FREE_SHIP ? 0 : SHIP_COST;
  const tax          = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total        = Math.round((subtotal + shippingCost + tax) * 100) / 100;

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  const items = cart?.items || [];

  return (
    <div style={{ padding: '48px 0 96px' }}>
      <div className="container">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 300, marginBottom: 48 }}>
          Shopping Cart {itemCount > 0 && <span style={{ fontSize: 24, color: 'var(--taupe)' }}>({itemCount})</span>}
        </h1>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 32, marginBottom: 16 }}>Your cart is empty</p>
            <p style={{ color: 'var(--ink-faint)', marginBottom: 32 }}>Add some pieces you love</p>
            <Link to="/shop" className="btn btn-dark">Continue Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 64, alignItems: 'start' }}>
            {/* Items */}
            <div>
              <div style={{ display: 'flex', padding: '0 0 12px', borderBottom: '1px solid var(--stone)', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--taupe)', gap: 24 }}>
                <span style={{ flex: 1 }}>Product</span>
                <span style={{ width: 120, textAlign: 'center' }}>Quantity</span>
                <span style={{ width: 80, textAlign: 'right' }}>Total</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {items.map(item => (
                  <div key={item._id} className="fade-in" style={{ display: 'flex', gap: 24, padding: '28px 0', borderBottom: '1px solid var(--stone)', alignItems: 'center' }}>
                    {/* Image */}
                    <Link to={`/product/${item.product?._id}`}>
                      <img src={item.product?.images?.[0]} alt={item.product?.name}
                        style={{ width: 90, height: 112, objectFit: 'cover', background: 'var(--warm-white)', flexShrink: 0 }} />
                    </Link>
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link to={`/product/${item.product?._id}`} style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink)' }}>{item.product?.name}</Link>
                      <div style={{ fontSize: 12, color: 'var(--taupe)', marginTop: 6, display: 'flex', gap: 12 }}>
                        {item.color && <span>{item.color}</span>}
                        {item.size  && <span>Size: {item.size}</span>}
                        <span>{fmt(item.product?.price)}</span>
                      </div>
                      <button onClick={async () => { await removeItem(item._id); toast.success('Removed'); }}
                        style={{ fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--taupe)', marginTop: 10, borderBottom: '1px solid var(--taupe)', paddingBottom: 1, transition: 'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--taupe)'}>
                        Remove
                      </button>
                    </div>
                    {/* Qty */}
                    <div style={{ width: 120, display: 'flex', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--stone)' }}>
                        <button onClick={() => updateItem(item._id, item.quantity - 1)} style={{ width: 32, height: 36, fontSize: 16, color: 'var(--ink-faint)' }}>−</button>
                        <span style={{ width: 32, textAlign: 'center', fontSize: 14 }}>{item.quantity}</span>
                        <button onClick={() => updateItem(item._id, item.quantity + 1)} style={{ width: 32, height: 36, fontSize: 16, color: 'var(--ink-faint)' }}>+</button>
                      </div>
                    </div>
                    {/* Total */}
                    <div style={{ width: 80, textAlign: 'right', fontWeight: 500, fontSize: 15 }}>
                      {fmt((item.product?.price || 0) * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 24, fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--ink-faint)', borderBottom: '1px solid var(--stone)', paddingBottom: 2 }}>
                ← Continue Shopping
              </Link>
            </div>

            {/* Summary */}
            <div style={{ background: 'var(--warm-white)', padding: 32, position: 'sticky', top: 90 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 300, marginBottom: 28 }}>Order Summary</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                {[['Subtotal', fmt(subtotal)], ['Shipping', subtotal >= FREE_SHIP ? 'Free' : fmt(SHIP_COST)], ['Tax (8%)', fmt(tax)]].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ color: 'var(--ink-faint)' }}>{l}</span>
                    <span>{v}</span>
                  </div>
                ))}
                {subtotal < FREE_SHIP && (
                  <p style={{ fontSize: 12, color: 'var(--accent-dk)', fontStyle: 'italic' }}>
                    Add {fmt(FREE_SHIP - subtotal)} more for free shipping
                  </p>
                )}
              </div>
              <hr className="divider" style={{ margin: '0 0 20px' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 28 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>Total</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400 }}>{fmt(total)}</span>
              </div>
              <button className="btn btn-dark btn-full" onClick={() => navigate('/checkout')}>
                Proceed to Checkout
              </button>
              <p style={{ fontSize: 11, color: 'var(--taupe)', textAlign: 'center', marginTop: 16 }}>Secure checkout · Free returns</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
