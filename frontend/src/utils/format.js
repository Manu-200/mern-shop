export const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

export const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

export const statusColor = (s) => ({
  processing: '#856404',
  confirmed:  '#0c5460',
  shipped:    '#155724',
  delivered:  '#2d6a4f',
  cancelled:  '#721c24'
}[s] || '#555');

export const statusBg = (s) => ({
  processing: '#fff3cd',
  confirmed:  '#d1ecf1',
  shipped:    '#d4edda',
  delivered:  '#d4edda',
  cancelled:  '#f8d7da'
}[s] || '#f0f0f0');
