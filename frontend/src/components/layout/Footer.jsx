import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--ink)', color: 'var(--taupe)', padding: '60px 0 32px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 300, letterSpacing: 6, color: 'var(--cream)', marginBottom: 16 }}>Maison</p>
            <p style={{ fontSize: 13, lineHeight: 1.8, maxWidth: 260 }}>
              Carefully curated wardrobe essentials. Timeless quality, thoughtful design.
            </p>
          </div>
          {[
            { title: 'Shop', links: [['All Products', '/shop'], ['Clothing', '/shop?category=clothing'], ['Bags', '/shop?category=bags'], ['Footwear', '/shop?category=footwear']] },
            { title: 'Account', links: [['Sign In', '/login'], ['Register', '/register'], ['My Orders', '/orders'], ['Profile', '/profile']] },
            { title: 'Info', links: [['About Us', '/'], ['Shipping', '/'], ['Returns', '/'], ['Contact', '/']] },
          ].map(col => (
            <div key={col.title}>
              <p style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, color: 'var(--cream)', marginBottom: 20 }}>{col.title}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {col.links.map(([label, to]) => (
                  <Link key={label} to={to} style={{ fontSize: 13, transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--cream)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--taupe)'}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: 12 }}>© {new Date().getFullYear()} Maison. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
