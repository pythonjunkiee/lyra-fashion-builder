import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Package, LogOut, ChevronRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

export default function ProfilePage() {
  const { user, isLoading, logout } = useCustomerAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/account', { replace: true, state: { from: '/profile' } });
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="font-body text-muted-foreground">Loading…</p>
        </div>
      </Layout>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Layout>
      <section className="py-12 bg-lyra-cream/30 min-h-[80vh]">
        <div className="container max-w-2xl">
          {/* Breadcrumb */}
          <nav className="font-body text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">My Account</span>
          </nav>

          {/* Profile header */}
          <div className="bg-white rounded-2xl border border-border p-6 mb-4 flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-xl font-medium">
                {user.firstName} {user.lastName}
              </h1>
              <p className="font-body text-sm text-muted-foreground">{user.email}</p>
              <p className="font-body text-xs text-muted-foreground mt-0.5">
                Member since {new Date(user.createdAt).toLocaleDateString('en-AE', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Account sections */}
          <div className="bg-white rounded-2xl border border-border overflow-hidden mb-4">
            <button className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-muted-foreground" />
                <div className="text-left">
                  <p className="font-display text-sm font-medium">My Orders</p>
                  <p className="font-body text-xs text-muted-foreground">Track and view your order history</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Coming soon notice */}
          <div className="bg-lyra-cream/60 rounded-xl border border-border px-5 py-4 mb-6">
            <p className="font-body text-sm text-muted-foreground text-center">
              Full order history and account management is coming soon. For order enquiries, contact us on WhatsApp or Instagram.
            </p>
          </div>

          {/* Sign out */}
          <Button
            variant="outline"
            className="w-full font-body text-muted-foreground hover:text-destructive hover:border-destructive"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </section>
    </Layout>
  );
}
