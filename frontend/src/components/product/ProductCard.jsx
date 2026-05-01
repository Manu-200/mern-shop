import { useState } from 'react';
import { Link } from 'react-router-dom';
import { fmt } from '../../utils/format';

const Stars = ({ rating }) => (
  <div style={{ display: 'flex', gap: 2 }}>
    {[1,2,3,4,5].map(n => (
      <svg key={n} width="10" height="10" viewBox="0 0 24 24"
        fill={n <= Math.round(rating) ? 'var(--accent)' : 'none'}
        stroke="var(--accent)" strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ))}
  </div>
);

export default function ProductCard({ product }) {
  const [imgIdx, setImgIdx] = useState(0);
  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPct = hasDiscount ? Math.round((1 - product.price / product.comparePrice) * 100) : 0;

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Image */}
      <Link to={`/product/${product._id}`} style={{ display: 'block', position: 'relative', overflow: 'hidden', background: 'var(--warm-white)', aspectRatio: '3/4' }}
        onMouseEnter={() => product.images[1] && setImgIdx(1)}
        onMouseLeave={() => setImgIdx(0)}>
        <img
          src={product.images[imgIdx] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80'}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        />
        {/* Badges */}
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {hasDiscount && <span className="badge badge-sale">−{discountPct}%</span>}
          {product.stock <= 5 && product.stock > 0 && <span className="badge badge-low">Low Stock</span>}
          {product.sold > 200 && <span className="badge badge-new">Bestseller</span>}
        </div>
      </Link>

      {/* Info */}
      <div style={{ padding: '14px 0 0' }}>
        <p style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: 6 }}>{product.brand}</p>
        <Link to={`/product/${product._id}`} style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink)', lineHeight: 1.25, display: 'block', marginBottom: 8,
          transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-dk)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--ink)'}>
          {product.name}
        </Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontWeight: 500, fontSize: 15 }}>{fmt(product.price)}</span>
            {hasDiscount && <span style={{ fontSize: 12, color: 'var(--taupe)', textDecoration: 'line-through' }}>{fmt(product.comparePrice)}</span>}
          </div>
          {product.numReviews > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Stars rating={product.rating} />
              <span style={{ fontSize: 11, color: 'var(--taupe)' }}>({product.numReviews})</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
