import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/product/ProductCard';
import toast from 'react-hot-toast';
import styles from './Shop.module.css';

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
    } catch (err) {
      console.error(err);
      // Provide more specific feedback for deployment issues
      if (!err.response) {
        toast.error('Network Error: Could not connect to the API server. Please check the backend deployment.');
      }
    }
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

  return (
    <div className={styles.shopPage}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <p className={styles.preTitle}>
            {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All Products'}
          </p>
          <h1 className={styles.title}>
            {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'The Collection'}
          </h1>
          <p className={styles.totalPieces}>{total} pieces</p>
        </div>

        {/* Filters bar */}
        <div className={styles.filtersBar}>
          {/* Search */}
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input className={`input ${styles.searchInput}`} placeholder="Search pieces…" value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
            <button type="submit" className="btn btn-dark btn-sm">Search</button>
          </form>

          {/* Categories */}
          <div className={styles.categoryFilters}>
            <button className={`${styles.categoryButton} ${!category ? styles.active : ''}`} onClick={() => set('category', '')}>All</button>
            {CATEGORIES.map(c => (
              <button key={c} className={`${styles.categoryButton} ${category === c ? styles.active : ''}`} onClick={() => set('category', c)}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select value={sort} onChange={e => set('sort', e.target.value)} className={styles.sortSelect}>
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
          <div className={styles.noProducts}>
            <p className={styles.noProductsTitle}>No pieces found</p>
            <p className={styles.noProductsSubtitle}>Try a different search or category</p>
          </div>
        ) : (
          <div className={`stagger ${styles.productGrid}`}>
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className={styles.pagination}>
            {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => { const next = new URLSearchParams(searchParams); next.set('page', n); setSearchParams(next); }} className={`${styles.pageButton} ${n === page ? styles.active : ''}`}>
                {n}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
