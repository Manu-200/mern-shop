import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import styles from './Register.module.css';

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
    <div className={styles.registerPage}>
      <div className={`fade-up ${styles.formContainer}`}>
        <div className={styles.header}>
          <p className={styles.preTitle}>New here</p>
          <h1 className={styles.title}>Create Account</h1>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {[['name', 'Full Name', 'text', 'Jane Smith'], ['email', 'Email Address', 'email', 'you@example.com'], ['password', 'Password', 'password', '6+ characters'], ['confirm', 'Confirm Password', 'password', 'Repeat password']].map(([key, label, type, ph]) => (
            <div key={key}>
              <label className="input-label">{label}</label>
              <input className="input" type={type} placeholder={ph} required
                value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
            </div>
          ))}
          <button type="submit" className={`btn btn-dark btn-full ${styles.submitButton}`} disabled={loading}>
            {loading ? 'Creating Account…' : 'Create Account'}
          </button>
        </form>

        <p className={styles.loginLink}>
          Already a member? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
