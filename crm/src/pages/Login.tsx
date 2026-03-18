import { useState } from 'react';
import { LogIn, Eye, EyeOff, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL as string;

export default function Login() {
  const { login } = useAuth();
  const [key, setKey] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = key.trim();
    if (!trimmed) return;

    setLoading(true);
    setError('');

    try {
      // Verify the key against a lightweight admin endpoint before storing it
      const res = await fetch(`${API_URL}/admin/categories`, {
        headers: { 'x-api-key': trimmed },
      });

      if (res.status === 401 || res.status === 429) {
        setError('Invalid API key. Please check and try again.');
        setLoading(false);
        return;
      }

      // Any non-401 response means the key was accepted by the server
      login(trimmed);
    } catch {
      setError('Could not connect to the server. Check your network and try again.');
    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8f7f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        background: 'white',
        borderRadius: 16,
        border: '1px solid #e8e4df',
        padding: '40px',
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48,
            background: '#1c1a18',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
          }}>
            <Lock size={20} color="#d4a853" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#d4a853', letterSpacing: 3, marginBottom: 4 }}>
            LYRA
          </h1>
          <p style={{ fontSize: 13, color: '#7a7570' }}>CRM Dashboard — Admin Access</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="apikey">Admin API Key</label>
            <div style={{ position: 'relative' }}>
              <input
                id="apikey"
                type={show ? 'text' : 'password'}
                value={key}
                onChange={(e) => { setKey(e.target.value); setError(''); }}
                placeholder="Paste your admin API key"
                style={{ width: '100%', paddingRight: 44 }}
                autoComplete="current-password"
                autoFocus
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label={show ? 'Hide key' : 'Show key'}
                style={{
                  position: 'absolute', right: 10, top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#7a7570', padding: 4, display: 'flex',
                }}
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p style={{
              color: '#dc2626', fontSize: 13,
              marginTop: -8, marginBottom: 16,
              background: '#fee2e2', padding: '8px 12px',
              borderRadius: 6,
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '11px 16px', marginTop: 4 }}
            disabled={loading || !key.trim()}
          >
            <LogIn size={16} />
            {loading ? 'Verifying…' : 'Sign In'}
          </button>
        </form>

        <p style={{ fontSize: 12, color: '#a09b96', textAlign: 'center', marginTop: 20 }}>
          Your key is stored only in this browser session and cleared when you close the tab.
        </p>
      </div>
    </div>
  );
}
