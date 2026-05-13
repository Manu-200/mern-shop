import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { fmt } from '../../utils/format';
import toast from 'react-hot-toast';

const CATEGORIES = ['clothing', 'accessories', 'footwear', 'bags', 'beauty', 'home'];

const EMPTY = {
  name: '', description: '', price: '', comparePrice: '',
  category: 'clothing', brand: '', stock: '',
  images: '', sizes: '', colors: '', tags: '',
  featured: false
};

function ProductModal({ product, onClose, onSaved }) {
  const isEdit = Boolean(product);
  const [form, setForm] = useState(isEdit ? {
    ...product,
    price: product.price,
    comparePrice: product.comparePrice || '',
    stock: product.stock,
    images:  product.images.join(', '),
    sizes:   product.sizes.join(', '),
    colors:  product.colors.join(', '),
    tags:    product.tags.join(', '),
  } : EMPTY);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock || !form.description) {
      toast.error('Please fill in all required fields'); return;
    }
    setSaving(true);
    const payload = {
      ...form,
      price:        Number(form.price),
      comparePrice: form.comparePrice ? Number(form.comparePrice) : undefined,
      stock:        Number(form.stock),
      images:  form.images  ? form.images.split(',').map(s => s.trim()).filter(Boolean)  : [],
      sizes:   form.sizes   ? form.sizes.split(',').map(s => s.trim()).filter(Boolean)   : [],
      colors:  form.colors  ? form.colors.split(',').map(s => s.trim()).filter(Boolean)  : [],
      tags:    form.tags    ? form.tags.split(',').map(s => s.trim()).filter(Boolean)     : [],
    };
    try {
      const r = isEdit
        ? await api.put(`/products/${product._id}`, payload)
        : await api.post('/products', payload);
      onSaved(r.data.product, isEdit);
      toast.success(isEdit ? 'Product updated' : 'Product created');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const overlay = {
    position: 'fixed', inset: 0, background: 'rgba(26,21,18,0.6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: 24
  };

  const iStyle = { width: '100%' };

  return (
    <div style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--cream)', width: '100%', maxWidth: 680,
        maxHeight: '92vh', overflowY: 'auto', padding: 40
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 300 }}>
            {isEdit ? 'Edit Product' : 'Add Product'}
          </h2>
          <button onClick={onClose} style={{ fontSize: 22, color: 'var(--taupe)' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: '1/-1' }}>
              <label className="input-label">Product Name *</label>
              <input className="input" style={iStyle} value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div>
              <label className="input-label">Price (INR) *</label>
              <input className="input" style={iStyle} type="number" min="0" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} required />
            </div>
            <div>
              <label className="input-label">Compare Price (optional)</label>
              <input className="input" style={iStyle} type="number" min="0" step="0.01" placeholder="Original price for sale display" value={form.comparePrice} onChange={e => set('comparePrice', e.target.value)} />
            </div>
            <div>
              <label className="input-label">Category *</label>
              <select className="input" style={{ ...iStyle, cursor: 'pointer' }} value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">Brand</label>
              <input className="input" style={iStyle} value={form.brand} onChange={e => set('brand', e.target.value)} />
            </div>
            <div>
              <label className="input-label">Stock *</label>
              <input className="input" style={iStyle} type="number" min="0" value={form.stock} onChange={e => set('stock', e.target.value)} required />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 28 }}>
              <input type="checkbox" id="featured" checked={form.featured} onChange={e => set('featured', e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--ink)' }} />
              <label htmlFor="featured" style={{ fontSize: 13, cursor: 'pointer' }}>Featured product</label>
            </div>
          </div>

          <div>
            <label className="input-label">Description *</label>
            <textarea className="input" rows={4} style={{ resize: 'vertical' }} value={form.description} onChange={e => set('description', e.target.value)} required />
          </div>

          <div>
            <label className="input-label">Image URLs (comma-separated)</label>
            <textarea className="input" rows={2} style={{ resize: 'vertical', fontSize: 12 }} placeholder="https://…, https://…" value={form.images} onChange={e => set('images', e.target.value)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div>
              <label className="input-label">Sizes (comma-sep)</label>
              <input className="input" placeholder="XS, S, M, L, XL" value={form.sizes} onChange={e => set('sizes', e.target.value)} />
            </div>
            <div>
              <label className="input-label">Colors (comma-sep)</label>
              <input className="input" placeholder="Black, White, Sage" value={form.colors} onChange={e => set('colors', e.target.value)} />
            </div>
            <div>
              <label className="input-label">Tags (comma-sep)</label>
              <input className="input" placeholder="wool, winter" value={form.tags} onChange={e => set('tags', e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8, paddingTop: 20, borderTop: '1px solid var(--stone)' }}>
            <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
            <button type="submit" className="btn btn-dark" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminProducts() {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(null); // null | 'create' | product
  const [search, setSearch]       = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [page, setPage]           = useState(1);
  const [total, setTotal]         = useState(0);
  const [pages, setPages]         = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (search)    params.set('search', search);
      if (catFilter) params.set('category', catFilter);
      const r = await api.get(`/products?${params}`);
      setProducts(r.data.products);
      setTotal(r.data.total);
      setPages(r.data.pages);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [page, catFilter]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchProducts(); };

  const handleDelete = async (id) => {
    if (!confirm('Remove this product from the store?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(p => p.filter(x => x._id !== id));
      toast.success('Product removed');
    } catch { toast.error('Could not delete'); }
  };

  const handleSaved = (saved, isEdit) => {
    if (isEdit) setProducts(p => p.map(x => x._id === saved._id ? saved : x));
    else { setProducts(p => [saved, ...p]); setTotal(t => t + 1); }
  };

  const thStyle = { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--taupe)', padding: '12px 16px', textAlign: 'left', fontWeight: 500, borderBottom: '1px solid var(--stone)', background: 'var(--warm-white)' };
  const tdStyle = { padding: '14px 16px', borderBottom: '1px solid var(--stone)', fontSize: 13, verticalAlign: 'middle' };

  return (
    <div style={{ padding: '48px 0 96px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: 8 }}>Admin</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 300 }}>Products</h1>
            <p style={{ color: 'var(--ink-faint)', marginTop: 4 }}>{total} total listings</p>
          </div>
          <button className="btn btn-dark" onClick={() => setModal('create')}>+ Add Product</button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 28, alignItems: 'center' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
            <input className="input" style={{ width: 240, padding: '9px 14px' }} placeholder="Search products…"
              value={search} onChange={e => setSearch(e.target.value)} />
            <button type="submit" className="btn btn-dark btn-sm">Search</button>
          </form>
          <select className="input" style={{ width: 160, padding: '9px 14px', cursor: 'pointer' }}
            value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(1); }}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
          {(search || catFilter) && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setCatFilter(''); setPage(1); }}>Clear</button>
          )}
        </div>

        {/* Table */}
        <div style={{ border: '1px solid var(--stone)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Product', 'Category', 'Price', 'Stock', 'Sold', 'Rating', 'Actions'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 48 }}><div className="spinner" style={{ margin: '0 auto' }} /></td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 48, color: 'var(--ink-faint)', fontStyle: 'italic' }}>No products found</td></tr>
              ) : products.map(p => (
                <tr key={p._id} style={{ transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--warm-white)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={p.images[0]} alt="" style={{ width: 44, height: 54, objectFit: 'cover', background: 'var(--stone)', flexShrink: 0 }} />
                      <div>
                        <p style={{ fontWeight: 500, color: 'var(--ink)', lineHeight: 1.3 }}>{p.name}</p>
                        <p style={{ fontSize: 11, color: 'var(--taupe)', marginTop: 2 }}>{p.brand}</p>
                        {p.featured && <span style={{ fontSize: 9, letterSpacing: 1, background: 'var(--ink)', color: 'var(--cream)', padding: '2px 6px', marginTop: 4, display: 'inline-block' }}>FEATURED</span>}
                      </div>
                    </div>
                  </td>
                  <td style={tdStyle}><span style={{ fontSize: 11, textTransform: 'capitalize', letterSpacing: 0.5 }}>{p.category}</span></td>
                  <td style={tdStyle}>
                    <p style={{ fontWeight: 500 }}>{fmt(p.price)}</p>
                    {p.comparePrice > p.price && <p style={{ fontSize: 11, color: 'var(--taupe)', textDecoration: 'line-through' }}>{fmt(p.comparePrice)}</p>}
                  </td>
                  <td style={tdStyle}>
                    <span style={{ color: p.stock === 0 ? 'var(--red)' : p.stock < 10 ? '#856404' : 'var(--green)', fontWeight: 500 }}>
                      {p.stock === 0 ? 'Out of Stock' : p.stock}
                    </span>
                  </td>
                  <td style={tdStyle}>{p.sold}</td>
                  <td style={tdStyle}>
                    {p.numReviews > 0 ? `${p.rating.toFixed(1)} ★ (${p.numReviews})` : <span style={{ color: 'var(--taupe)' }}>—</span>}
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setModal(p)}>Edit</button>
                      <button className="btn btn-sm" onClick={() => handleDelete(p._id)}
                        style={{ background: 'transparent', border: '1px solid var(--stone)', color: 'var(--red)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', padding: '6px 14px', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--red)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--red)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.borderColor = 'var(--stone)'; }}>
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div style={{ display: 'flex', gap: 8, marginTop: 24, justifyContent: 'center' }}>
            {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)} style={{
                width: 36, height: 36, border: `1px solid ${n === page ? 'var(--ink)' : 'var(--stone)'}`,
                background: n === page ? 'var(--ink)' : 'transparent', color: n === page ? 'var(--cream)' : 'var(--ink)',
                fontSize: 13, cursor: 'pointer', transition: 'all 0.2s'
              }}>{n}</button>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <ProductModal
          product={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
