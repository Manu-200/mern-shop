import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { fmt, fmtDate } from '../utils/format';
import toast from 'react-hot-toast';

const Stars = ({ rating, interactive, onSet }) => (
  <div style={{ display: 'flex', gap: 3, cursor: interactive ? 'pointer' : 'default' }}>
    {[1,2,3,4,5].map(n => (
      <svg key={n} width={interactive ? 22 : 13} height={interactive ? 22 : 13} viewBox="0 0 24 24"
        fill={n <= Math.round(rating) ? 'var(--accent)' : 'none'}
        stroke="var(--accent)" strokeWidth="1.5"
        onClick={() => interactive && onSet(n)}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ))}
  </div>
);

export default function ProductDetail() {
  const { id }          = useParams();
  const navigate        = useNavigate();
  const { user }        = useAuth();
  const { addToCart }   = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx]   = useState(0);
  const [selSize, setSelSize] = useState('');
  const [selColor, setSelColor] = useState('');
  const [qty, setQty]         = useState(1);
  const [addingCart, setAddingCart] = useState(false);

  const [review, setReview]   = useState({ rating: 0, comment: '' });
  const [submittingReview, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(r => { setProduct(r.data.product); if (r.data.product.colors[0]) setSelColor(r.data.product.colors[0]); })
      .catch(() => navigate('/shop'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please sign in to add to cart'); navigate('/login'); return; }
    if (product.sizes?.length && !selSize) { toast.error('Please select a size'); return; }
    if (product.stock === 0) { toast.error('Out of stock'); return; }
    setAddingCart(true);
    try {
      await addToCart(product._id, qty, selSize, selColor);
      toast.success('Added to cart');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add to cart');
    } finally { setAddingCart(false); }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (review.rating === 0) { toast.error('Please select a rating'); return; }
    if (!review.comment.trim()) { toast.error('Please write a comment'); return; }
    setSubmitting(true);
    try {
      const r = await api.post(`/products/${id}/reviews`, review);
      setProduct(r.data.product);
      setReview({ rating: 0, comment: '' });
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit review');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!product) return null;

  const hasDiscount = product.comparePrice && product.comparePrice > product.price;

  return (
    <div style={{ padding: '48px 0 96px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 40, fontSize: 12, color: 'var(--taupe)' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/shop')}>Shop</span>
          <span>/</span>
          <span style={{ cursor: 'pointer', textTransform: 'capitalize' }} onClick={() => navigate(`/shop?category=${product.category}`)}>{product.category}</span>
          <span>/</span>
          <span style={{ color: 'var(--ink)' }}>{product.name}</span>
        </div>

        {/* Main layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
          {/* Gallery */}
          <div>
            <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: 'var(--warm-white)', marginBottom: 12 }}>
              <img src={product.images[imgIdx] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80'}
                alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: 8 }}>
                {product.images.map((img, i) => (
                  <div key={i} onClick={() => setImgIdx(i)} style={{
                    width: 72, height: 88, cursor: 'pointer', overflow: 'hidden', flexShrink: 0,
                    border: `2px solid ${imgIdx === i ? 'var(--ink)' : 'transparent'}`, transition: 'border-color 0.2s'
                  }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="fade-up">
            <p style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: 12 }}>{product.brand}</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 300, lineHeight: 1.1, marginBottom: 16 }}>{product.name}</h1>

            {/* Rating */}
            {product.numReviews > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <Stars rating={product.rating} />
                <span style={{ fontSize: 13, color: 'var(--ink-faint)' }}>{product.rating.toFixed(1)} ({product.numReviews} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 28 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 300 }}>{fmt(product.price)}</span>
              {hasDiscount && <span style={{ fontSize: 16, color: 'var(--taupe)', textDecoration: 'line-through' }}>{fmt(product.comparePrice)}</span>}
            </div>

            <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.8, marginBottom: 32 }}>{product.description}</p>
            <hr className="divider" />

            {/* Colors */}
            {product.colors.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>Colour — <span style={{ fontWeight: 400, fontStyle: 'italic' }}>{selColor}</span></p>
                <div style={{ display: 'flex', gap: 8 }}>
                  {product.colors.map(c => (
                    <button key={c} onClick={() => setSelColor(c)} style={{
                      padding: '6px 16px', fontSize: 12, border: `1px solid ${selColor === c ? 'var(--ink)' : 'var(--stone)'}`,
                      background: selColor === c ? 'var(--ink)' : 'transparent', color: selColor === c ? 'var(--cream)' : 'var(--ink-faint)',
                      cursor: 'pointer', transition: 'all 0.2s', letterSpacing: 0.5
                    }}>{c}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>Size</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {product.sizes.map(s => (
                    <button key={s} onClick={() => setSelSize(s)} style={{
                      width: 46, height: 46, fontSize: 12, border: `1px solid ${selSize === s ? 'var(--ink)' : 'var(--stone)'}`,
                      background: selSize === s ? 'var(--ink)' : 'transparent', color: selSize === s ? 'var(--cream)' : 'var(--ink-faint)',
                      cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-body)'
                    }}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to cart */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--stone)' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 40, height: 48, fontSize: 18, color: 'var(--ink-faint)', transition: 'color 0.2s' }}>−</button>
                <span style={{ width: 40, textAlign: 'center', fontSize: 15 }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={{ width: 40, height: 48, fontSize: 18, color: 'var(--ink-faint)', transition: 'color 0.2s' }}>+</button>
              </div>
              <button className="btn btn-dark" style={{ flex: 1 }} onClick={handleAddToCart} disabled={addingCart || product.stock === 0}>
                {product.stock === 0 ? 'Out of Stock' : addingCart ? 'Adding…' : 'Add to Cart'}
              </button>
            </div>

            <p style={{ fontSize: 12, color: 'var(--taupe)' }}>
              {product.stock > 0 ? `${product.stock} in stock · Free shipping over ₹8,000` : 'Currently out of stock'}
            </p>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 24 }}>
                {product.tags.map(t => (
                  <span key={t} style={{ fontSize: 11, padding: '4px 10px', border: '1px solid var(--stone)', color: 'var(--taupe)', letterSpacing: 1 }}>{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div style={{ marginTop: 96, borderTop: '1px solid var(--stone)', paddingTop: 64 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 300, marginBottom: 48 }}>Customer Reviews</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
            {/* Review list */}
            <div>
              {product.reviews.length === 0 ? (
                <p style={{ color: 'var(--ink-faint)', fontStyle: 'italic' }}>No reviews yet. Be the first.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                  {product.reviews.map(r => (
                    <div key={r._id} style={{ borderBottom: '1px solid var(--stone)', paddingBottom: 28 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontWeight: 500, fontSize: 14 }}>{r.name}</span>
                        <span style={{ fontSize: 12, color: 'var(--taupe)' }}>{fmtDate(r.createdAt)}</span>
                      </div>
                      <Stars rating={r.rating} />
                      <p style={{ marginTop: 10, fontSize: 14, lineHeight: 1.7, color: 'var(--ink-soft)' }}>{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Write review */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 300, marginBottom: 24 }}>Write a Review</h3>
              {!user ? (
                <p style={{ color: 'var(--ink-faint)', fontSize: 14 }}>Please <a href="/login" style={{ borderBottom: '1px solid currentColor' }}>sign in</a> to leave a review.</p>
              ) : (
                <form onSubmit={handleReview} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <label className="input-label">Your Rating</label>
                    <Stars rating={review.rating} interactive onSet={r => setReview(p => ({ ...p, rating: r }))} />
                  </div>
                  <div>
                    <label className="input-label">Your Review</label>
                    <textarea className="input" rows={5} placeholder="Tell us what you think…"
                      value={review.comment} onChange={e => setReview(p => ({ ...p, comment: e.target.value }))}
                      style={{ resize: 'vertical' }} />
                  </div>
                  <button type="submit" className="btn btn-dark" disabled={submittingReview} style={{ alignSelf: 'flex-start' }}>
                    {submittingReview ? 'Submitting…' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
