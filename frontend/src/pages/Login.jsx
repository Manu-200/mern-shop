import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login }           = useAuth();
  const navigate            = useNavigate();
  const location            = useLocation();
  const from                = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}`);
      navigate(from);
    } catch (err) {
      // If there's no response from the server, it's likely a CORS or network issue.
      if (!err.response) {
        toast.error('Network Error: Could not reach the server. Please check deployment configuration.');
      } else {
        // Otherwise, display the error message from the server.
        toast.error(err.response.data.message || 'Invalid credentials');
      }
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {/* Left — image */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&q=85" alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,21,18,0.3)' }} />
        <div style={{ position: 'absolute', bottom: 48, left: 48 }}>
          <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--cream)', letterSpacing: 6, textTransform: 'uppercase' }}>Shopshere</Link>
          <p style={{ color: 'rgba(250,248,245,0.7)', fontSize: 13, marginTop: 8 }}>Curated essentials for the considered wardrobe.</p>
        </div>
      </div>

      {/* Right — form */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 80px', background: 'var(--cream)' }}>
        <div className="fade-up" style={{ width: '100%', maxWidth: 380 }}>
          <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: 12 }}>Welcome back</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 300, marginBottom: 40 }}>Sign In</h1>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label className="input-label">Email Address</label>
              <input className="input" type="email" placeholder="you@example.com" required
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <label className="input-label">Password</label>
              <input className="input" type="password" placeholder="••••••••" required
                value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
            </div>
            <button type="submit" className="btn btn-dark btn-full" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 28, fontSize: 14, color: 'var(--ink-faint)' }}>
            New here? <Link to="/register" style={{ borderBottom: '1px solid var(--ink)', color: 'var(--ink)', paddingBottom: 1 }}>Create account</Link>
          </p>

          <div style={{ marginTop: 32, padding: 16, background: 'var(--warm-white)', fontSize: 12, color: 'var(--ink-faint)' }}>
            <p style={{ fontWeight: 500, marginBottom: 6 }}>Demo Accounts:</p>
            <p>Admin: admin@shop.com / admin123</p>
            <p>User: demo@shop.com / demo1234</p>
          </div>
        </div>
      </div>
    </div>
  );
}
