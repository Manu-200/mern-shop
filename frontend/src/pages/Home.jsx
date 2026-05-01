import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/product/ProductCard';

const CATEGORIES = [
  { key: 'clothing',    label: 'Clothing',     img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80' },
  { key: 'bags',        label: 'Bags',          img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80' },
  { key: 'footwear',   label: 'Footwear',      img: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=80' },
  { key: 'accessories',label: 'Accessories',   img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get('/products?featured=true&limit=4')
      .then(r => setFeatured(r.data.products))
      .catch(console.error);
  }, []);

  return (
    <div>
      {/* ── Hero ── */}
      <section style={{ position: 'relative', height: '92vh', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=85"
          alt="Hero"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,21,18,0.7) 0%, rgba(26,21,18,0.15) 60%, transparent 100%)' }} />
        <div className="container" style={{ position: 'relative', paddingBottom: 80 }}>
          <div className="fade-up">
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: 'rgba(250,248,245,0.7)', marginBottom: 20 }}>
              New Collection · SS 2025
            </p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(52px,8vw,100px)', fontWeight: 300, color: 'var(--cream)', lineHeight: 1, marginBottom: 32, letterSpacing: 2 }}>
              Dress with<br /><em>intention</em>
            </h1>
            <Link to="/shop" className="btn btn-outline" style={{ color: 'var(--cream)', borderColor: 'var(--cream)' }}>
              Explore Collection
            </Link>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section style={{ padding: '96px 0 80px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: 12 }}>Browse by Category</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 300 }}>Everything you need</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {CATEGORIES.map(cat => (
              <Link key={cat.key} to={`/shop?category=${cat.key}`}
                style={{ position: 'relative', overflow: 'hidden', aspectRatio: '3/4', display: 'block', background: 'var(--warm-white)' }}
                onMouseEnter={e => e.currentTarget.querySelector('img').style.transform = 'scale(1.06)'}
                onMouseLeave={e => e.currentTarget.querySelector('img').style.transform = 'scale(1)'}>
                <img src={cat.img} alt={cat.label} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,21,18,0.55) 0%, transparent 60%)' }} />
                <div style={{ position: 'absolute', bottom: 20, left: 20 }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--cream)', fontWeight: 300 }}>{cat.label}</p>
                  <p style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(250,248,245,0.7)', textTransform: 'uppercase', marginTop: 4 }}>Shop Now →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      {featured.length > 0 && (
        <section style={{ padding: '0 0 96px' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
              <div>
                <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: 10 }}>Handpicked</p>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 300 }}>Featured Pieces</h2>
              </div>
              <Link to="/shop" style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', borderBottom: '1px solid var(--ink)', paddingBottom: 2, fontWeight: 500 }}>
                View All
              </Link>
            </div>
            <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Brand Promise ── */}
      <section style={{ background: 'var(--ink)', color: 'var(--cream)', padding: '96px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 300, lineHeight: 1.1, maxWidth: 700, margin: '0 auto 40px', letterSpacing: 1 }}>
            "<em>Fewer, better</em> things. That is the philosophy."
          </h2>
          <p style={{ color: 'var(--taupe)', maxWidth: 480, margin: '0 auto 48px', lineHeight: 1.8 }}>
            We source only from makers who share our commitment to craft, longevity, and honest materials.
            Every piece is chosen to outlast trends.
          </p>
          <Link to="/shop" className="btn btn-outline" style={{ borderColor: 'rgba(250,248,245,0.3)', color: 'var(--cream)' }}>
            Discover the Collection
          </Link>
        </div>
      </section>
    </div>
  );
}
