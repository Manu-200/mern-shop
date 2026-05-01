import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/product/ProductCard';

const CATEGORIES = ['clothing', 'accessories', 'footwear', 'bags', 'beauty', 'home'];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts]         = useState([]);
  const [total, setTotal]               = useState(0);
  const [pages, setPages]               = useState(1);
  const [loading, setLoading]           = useState(true);

  const category = searchParams.get('category') || '';
  const sort     = searchParams.get('sort') || 'newest';
  const search   = searchParams.get('search') || '';
  const page     = Number(searchParams.get('page')) || 1;

  const [searchInput, setSearchInput]   = useState(search);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sort, page, limit: 12 });
      if (category) params.set('category', category);
      if (search)   params.set('search', search);
      const r = await api.get(`/products?${params}`);
      setProducts(r.data.products);
      setTotal(r.data.total);
      setPages(r.data.pages);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [category, sort, search, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const set = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    set('search', searchInput);
  };

  const selStyle = (active) => ({
    padding: '6px 14px', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 500,
    cursor: 'pointer', borderRadius: '2px', border: active ? '1px solid var(--ink)' : '1px solid var(--stone)',
    background: active ? 'var(--ink)' : 'transparent', color: active ? 'var(--cream)' : 'var(--ink-faint)',
    transition: 'all 0.2s',
  });

  return (
    <div style={{ padding: '48px 0 96px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: 12 }}>
            {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All Products'}
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 300, marginBottom: 8 }}>
            {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'The Collection'}
          </h1>
          <p style={{ color: 'var(--ink-faint)', fontSize: 14 }}>{total} pieces</p>
        </div>

        {/* Filters bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
          {/* Search */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
            <input className="input" placeholder="Search pieces…" value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              style={{ width: 220, padding: '9px 14px', fontSize: 13 }} />
            <button type="submit" className="btn btn-dark btn-sm">Search</button>
          </form>

          {/* Categories */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button style={selStyle(!category)} onClick={() => set('category', '')}>All</button>
            {CATEGORIES.map(c => (
              <button key={c} style={selStyle(category === c)} onClick={() => set('category', c)}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sort} onChange={e => set('sort', e.target.value)}
            style={{ padding: '9px 14px', fontSize: 12, letterSpacing: 1, border: '1px solid var(--stone)', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="page-loader"><div className="spinner" /></div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 32, marginBottom: 12 }}>No pieces found</p>
            <p style={{ color: 'var(--ink-faint)' }}>Try a different search or category</p>
          </div>
        ) : (
          <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '48px 24px' }}>
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 64 }}>
            {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => { const next = new URLSearchParams(searchParams); next.set('page', n); setSearchParams(next); }}
                style={{ width: 36, height: 36, fontSize: 13, fontWeight: 500, border: `1px solid ${n === page ? 'var(--ink)' : 'var(--stone)'}`,
                  background: n === page ? 'var(--ink)' : 'transparent', color: n === page ? 'var(--cream)' : 'var(--ink)', transition: 'all 0.2s', cursor: 'pointer' }}>
                {n}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
