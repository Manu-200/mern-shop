import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout }   = useAuth();
  const { itemCount }      = useCart();
  const location           = useLocation();
  const navigate           = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const handleLogout = () => { logout(); toast.success('See you soon.'); navigate('/'); };

  const navStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
    background: scrolled ? 'rgba(250,248,245,0.96)' : 'rgba(250,248,245,0.8)',
    backdropFilter: 'blur(12px)',
    borderBottom: `1px solid ${scrolled ? 'var(--stone)' : 'transparent'}`,
    transition: 'all 0.3s ease',
    height: 'var(--nav-h)',
  };

  const linkStyle = (path) => ({
    fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 500,
    color: location.pathname === path ? 'var(--ink)' : 'var(--ink-faint)',
    transition: 'color 0.2s',
    padding: '4px 0',
    borderBottom: location.pathname === path ? '1px solid var(--ink)' : '1px solid transparent',
  });

  return (
    <nav style={navStyle}>
      <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Left links */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <Link to="/shop" style={linkStyle('/shop')}>Shop</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" style={linkStyle('/admin')}>Admin</Link>
          )}
        </div>

        {/* Logo */}
        <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 300, letterSpacing: 8, color: 'var(--ink)', textTransform: 'uppercase', textDecoration: 'none' }}>
          Maison
        </Link>

        {/* Right links */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          {user ? (
            <>
              <Link to="/orders" style={linkStyle('/orders')}>Orders</Link>
              <Link to="/profile" style={linkStyle('/profile')}>Account</Link>
              <button onClick={handleLogout} style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--ink-faint)', fontWeight: 500, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-faint)'}>
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/login" style={linkStyle('/login')}>Sign In</Link>
          )}

          {user && (
            <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {itemCount > 0 && (
                <span style={{
                  position: 'absolute', top: -8, right: -8,
                  background: 'var(--ink)', color: 'var(--cream)',
                  width: 17, height: 17, borderRadius: '50%',
                  fontSize: 9, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  letterSpacing: 0
                }}>
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
