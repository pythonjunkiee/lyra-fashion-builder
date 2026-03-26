import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

type Tab = 'login' | 'register';

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>('login');
  const { login, register } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // After login, go back to where the user came from (default: profile)
  const from = (location.state as { from?: string })?.from ?? '/profile';

  return (
    <Layout>
      <section className="min-h-[80vh] flex items-center justify-center py-12 bg-lyra-cream/30">
        <div className="container max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="font-display text-3xl font-semibold tracking-tight text-primary">
              LYRA
            </Link>
            <p className="font-body text-sm text-muted-foreground mt-1">Your fashion, your account</p>
          </div>

          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            {/* Tab switcher */}
            <div className="grid grid-cols-2 border-b border-border">
              <button
                onClick={() => setTab('login')}
                className={`py-4 font-display text-sm font-medium transition-colors ${
                  tab === 'login'
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setTab('register')}
                className={`py-4 font-display text-sm font-medium transition-colors ${
                  tab === 'register'
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="p-8">
              {tab === 'login' ? (
                <LoginForm onSuccess={() => navigate(from, { replace: true })} login={login} />
              ) : (
                <RegisterForm onSuccess={() => navigate(from, { replace: true })} register={register} onSwitchToLogin={() => setTab('login')} />
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function LoginForm({
  onSuccess,
  login,
}: {
  onSuccess: () => void;
  login: (email: string, password: string) => Promise<void>;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="login-email" className="font-body text-sm font-medium block mb-1.5">Email address</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(''); }}
          placeholder="you@example.com"
          required
          autoComplete="email"
          className="w-full font-body text-sm border border-border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
        />
      </div>

      <div>
        <label htmlFor="login-password" className="font-body text-sm font-medium block mb-1.5">Password</label>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            className="w-full font-body text-sm border border-border rounded-lg px-4 py-2.5 pr-10 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {error && (
        <p className="font-body text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
      )}

      <Button type="submit" className="w-full font-body" disabled={loading}>
        <LogIn className="mr-2 h-4 w-4" />
        {loading ? 'Signing in…' : 'Sign In'}
      </Button>
    </form>
  );
}

function RegisterForm({
  onSuccess,
  register,
  onSwitchToLogin,
}: {
  onSuccess: () => void;
  register: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  onSwitchToLogin: () => void;
}) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register({ email, password, firstName, lastName });
      onSuccess();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Registration failed.';
      if (msg.includes('already exists')) {
        setError('An account with this email already exists. Try signing in instead.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="reg-first" className="font-body text-sm font-medium block mb-1.5">First name</label>
          <input
            id="reg-first"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Aisha"
            required
            autoComplete="given-name"
            className="w-full font-body text-sm border border-border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label htmlFor="reg-last" className="font-body text-sm font-medium block mb-1.5">Last name</label>
          <input
            id="reg-last"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Al Mansouri"
            required
            autoComplete="family-name"
            className="w-full font-body text-sm border border-border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div>
        <label htmlFor="reg-email" className="font-body text-sm font-medium block mb-1.5">Email address</label>
        <input
          id="reg-email"
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(''); }}
          placeholder="you@example.com"
          required
          autoComplete="email"
          className="w-full font-body text-sm border border-border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
        />
      </div>

      <div>
        <label htmlFor="reg-password" className="font-body text-sm font-medium block mb-1.5">
          Password <span className="text-muted-foreground font-normal">(min. 8 characters)</span>
        </label>
        <div className="relative">
          <input
            id="reg-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            placeholder="••••••••"
            required
            autoComplete="new-password"
            className="w-full font-body text-sm border border-border rounded-lg px-4 py-2.5 pr-10 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {error && (
        <p className="font-body text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
      )}

      <Button type="submit" className="w-full font-body" disabled={loading}>
        <UserPlus className="mr-2 h-4 w-4" />
        {loading ? 'Creating account…' : 'Create Account'}
      </Button>

      <p className="font-body text-xs text-center text-muted-foreground">
        Already have an account?{' '}
        <button type="button" onClick={onSwitchToLogin} className="text-primary hover:underline">
          Sign in
        </button>
      </p>
    </form>
  );
}
