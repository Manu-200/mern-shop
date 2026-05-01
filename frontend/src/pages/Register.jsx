import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm]     = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { register }        = useAuth();
  const navigate            = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password);
      toast.success(`Welcome, ${user.name.split(' ')[0]}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=85" alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,21,18,0.3)' }} />
        <div style={{ position: 'absolute', bottom: 48, left: 48 }}>
          <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--cream)', letterSpacing: 6, textTransform: 'uppercase' }}>Maison</Link>
          <p style={{ color: 'rgba(250,248,245,0.7)', fontSize: 13, marginTop: 8 }}>Join a community of considered dressers.</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 80px', background: 'var(--cream)' }}>
        <div className="fade-up" style={{ width: '100%', maxWidth: 380 }}>
          <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: 12 }}>New here</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 300, marginBottom: 40 }}>Create Account</h1>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[['name', 'Full Name', 'text', 'Jane Smith'], ['email', 'Email Address', 'email', 'you@example.com'], ['password', 'Password', 'password', '6+ characters'], ['confirm', 'Confirm Password', 'password', 'Repeat password']].map(([key, label, type, ph]) => (
              <div key={key}>
                <label className="input-label">{label}</label>
                <input className="input" type={type} placeholder={ph} required
                  value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
              </div>
            ))}
            <button type="submit" className="btn btn-dark btn-full" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 28, fontSize: 14, color: 'var(--ink-faint)' }}>
            Already a member? <Link to="/login" style={{ borderBottom: '1px solid var(--ink)', color: 'var(--ink)', paddingBottom: 1 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
