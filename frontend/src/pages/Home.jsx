import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/product/ProductCard';
import styles from './Home.module.css';

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
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <div className={`fade-up ${styles.heroContent}`}>
            <p className={styles.preTitle}>
              New Collection · SS 2025
            </p>
            <h1 className={styles.title}>
              Dress with<br /><em>intention</em>
            </h1>
            <p className={styles.subtitle}>
              Curated essentials for the considered wardrobe. Fewer, better things.
            </p>
            <Link to="/shop" className="btn btn-dark">
              Explore Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className={styles.categoriesSection}>
        <div className="container">
          <div className={styles.categoriesHeader}>
            <p className={styles.categoriesPreTitle}>Browse by Category</p>
            <h2 className={styles.categoriesTitle}>Everything you need</h2>
          </div>
          <div className={styles.categoriesGrid}>
            {CATEGORIES.map(cat => (
              <Link key={cat.key} to={`/shop?category=${cat.key}`} className={styles.categoryCard}>
                <img src={cat.img} alt={cat.label} />
                <div className={styles.categoryCardOverlay} />
                <div className={styles.categoryCardContent}>
                  <p className={styles.categoryCardLabel}>{cat.label}</p>
                  <p className={styles.categoryCardLink}>Shop Now →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className={styles.featuredSection}>
          <div className="container">
            <div className={styles.featuredHeader}>
              <div>
                <p className={styles.featuredPreTitle}>Handpicked</p>
                <h2 className={styles.featuredTitle}>Featured Pieces</h2>
              </div>
              <Link to="/shop" className={styles.featuredLink}>
                View All
              </Link>
            </div>
            <div className={`stagger ${styles.featuredGrid}`}>
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Brand Promise */}
      <section className={styles.brandPromiseSection}>
        <div className={`container ${styles.brandPromiseContent}`}>
          <h2 className={styles.brandPromiseTitle}>
            "<em>Fewer, better</em> things. That is the philosophy."
          </h2>
          <p className={styles.brandPromiseText}>
            We source only from makers who share our commitment to craft, longevity, and honest materials.
            Every piece is chosen to outlast trends.
          </p>
          <Link to="/shop" className={`btn btn-outline ${styles.brandPromiseButton}`}>
            Discover the Collection
          </Link>
        </div>
      </section>
    </div>
  );
}
