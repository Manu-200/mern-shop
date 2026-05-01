import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { fmtDate } from '../utils/format';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zip: user?.address?.zip || '',
    }
  });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await api.put('/auth/profile', form);
      updateUser(r.data.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) { toast.error('Passwords do not match'); return; }
    setSavingPw(true);
    try {
      await api.put('/auth/password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed');
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally { setSavingPw(false); }
  };

  const setAddr = (k, v) => setForm(p => ({ ...p, address: { ...p.address, [k]: v } }));

  return (
    <div style={{ padding: '48px 0 96px' }}>
      <div className="container" style={{ maxWidth: 800 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 56, paddingBottom: 32, borderBottom: '1px solid var(--stone)' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--cream)', fontWeight: 300 }}>
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 300 }}>{user?.name}</h1>
            <p style={{ color: 'var(--taupe)', fontSize: 14 }}>{user?.email} · Member since {fmtDate(user?.createdAt)}</p>
            {user?.role === 'admin' && <span style={{ fontSize: 11, letterSpacing: 1.5, padding: '3px 10px', background: 'var(--ink)', color: 'var(--cream)', textTransform: 'uppercase', marginTop: 8, display: 'inline-block' }}>Admin</span>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
          {/* Profile form */}
          <form onSubmit={handleProfile}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 300, marginBottom: 28 }}>Personal Info</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="input-label">Full Name</label>
                <input className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label className="input-label">Street Address</label>
                <input className="input" value={form.address.street} onChange={e => setAddr('street', e.target.value)} placeholder="123 Main St" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="input-label">City</label>
                  <input className="input" value={form.address.city} onChange={e => setAddr('city', e.target.value)} />
                </div>
                <div>
                  <label className="input-label">State</label>
                  <input className="input" value={form.address.state} onChange={e => setAddr('state', e.target.value)} placeholder="NY" />
                </div>
              </div>
              <div>
                <label className="input-label">ZIP Code</label>
                <input className="input" value={form.address.zip} onChange={e => setAddr('zip', e.target.value)} placeholder="10001" />
              </div>
              <button type="submit" className="btn btn-dark" disabled={saving} style={{ marginTop: 8, alignSelf: 'flex-start' }}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>

          {/* Password form */}
          <form onSubmit={handlePassword}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 300, marginBottom: 28 }}>Change Password</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[['currentPassword', 'Current Password'], ['newPassword', 'New Password'], ['confirm', 'Confirm New Password']].map(([k, l]) => (
                <div key={k}>
                  <label className="input-label">{l}</label>
                  <input className="input" type="password" placeholder="••••••••"
                    value={pwForm[k]} onChange={e => setPwForm(p => ({ ...p, [k]: e.target.value }))} />
                </div>
              ))}
              <button type="submit" className="btn btn-outline" disabled={savingPw} style={{ marginTop: 8, alignSelf: 'flex-start' }}>
                {savingPw ? 'Updating…' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
