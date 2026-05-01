import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: 'toast-custom',
              style: {
                background: '#1a1512',
                color: '#faf8f5',
                borderRadius: '4px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                padding: '14px 20px',
              },
              success: { iconTheme: { primary: '#2d6a4f', secondary: '#faf8f5' } },
              error:   { iconTheme: { primary: '#c0392b', secondary: '#faf8f5' } },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
