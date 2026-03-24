import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, UserCheck, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

type Step = "choose" | "signin" | "guest";

export default function CheckoutAuth() {
  const [step, setStep] = useState<Step>("choose");
  const navigate = useNavigate();

  return (
    <Layout>
      <section className="min-h-[80vh] flex items-center justify-center py-12 bg-lyra-cream/30">
        <div className="container max-w-md">
          {/* Breadcrumb */}
          <nav className="font-body text-sm text-muted-foreground mb-8 text-center">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Checkout</span>
          </nav>

          {step === "choose" && <ChooseStep onSignIn={() => setStep("signin")} onGuest={() => setStep("guest")} />}
          {step === "signin" && <SignInStep onBack={() => setStep("choose")} onSuccess={() => navigate("/checkout/details")} />}
          {step === "guest" && <GuestStep onBack={() => setStep("choose")} />}
        </div>
      </section>
    </Layout>
  );
}

function ChooseStep({ onSignIn, onGuest }: { onSignIn: () => void; onGuest: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-border p-8 shadow-sm space-y-6">
      <div className="text-center">
        <h1 className="font-display text-2xl font-medium mb-2">How would you like to continue?</h1>
        <p className="font-body text-sm text-muted-foreground">
          Sign in for faster checkout and order tracking, or continue as a guest.
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={onSignIn}
          className="w-full flex items-center justify-between gap-4 p-5 rounded-xl border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all text-left group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <UserCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-display text-sm font-medium">Sign In</p>
              <p className="font-body text-xs text-muted-foreground">Faster checkout, order history</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </button>

        <button
          onClick={onGuest}
          className="w-full flex items-center justify-between gap-4 p-5 rounded-xl border-2 border-border hover:border-foreground/30 hover:bg-muted/30 transition-all text-left group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-display text-sm font-medium">Continue as Guest</p>
              <p className="font-body text-xs text-muted-foreground">No account needed</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      </div>
    </div>
  );
}

function SignInStep({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError("");

    // Placeholder: replace with real auth when customer accounts are ready
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setError("No account found with that email. Try continuing as a guest.");
  };

  return (
    <div className="bg-white rounded-2xl border border-border p-8 shadow-sm space-y-6">
      <div>
        <button onClick={onBack} className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          ← Back
        </button>
        <h1 className="font-display text-2xl font-medium mb-1">Sign In</h1>
        <p className="font-body text-sm text-muted-foreground">Welcome back to Lyra Fashion</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="font-body text-sm font-medium block mb-1.5">Email address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            placeholder="you@example.com"
            required
            className="w-full font-body text-sm border border-border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label htmlFor="checkout-password" className="font-body text-sm font-medium block mb-1.5">Password</label>
          <div className="relative">
            <input
              id="checkout-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="••••••••"
              required
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

        <Button type="submit" className="w-full font-body" disabled={loading || !email || !password}>
          {loading ? "Signing in…" : "Sign In"}
        </Button>
      </form>

      <div className="text-center">
        <p className="font-body text-sm text-muted-foreground">
          Don't have an account?{" "}
          <button onClick={onBack} className="text-primary hover:underline">
            Continue as guest
          </button>
        </p>
      </div>
    </div>
  );
}

function GuestStep({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-border p-8 shadow-sm text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <UserCheck className="h-7 w-7 text-green-600" />
        </div>
        <h2 className="font-display text-xl font-medium">Details saved!</h2>
        <p className="font-body text-sm text-muted-foreground">
          We'll use these details to process your order. You'll be able to complete your purchase on the next step.
        </p>
        <p className="font-body text-xs text-muted-foreground pt-2">
          Full checkout coming soon — in the meantime, contact us on WhatsApp or Instagram to place your order.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-border p-8 shadow-sm space-y-6">
      <div>
        <button onClick={onBack} className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          ← Back
        </button>
        <h1 className="font-display text-2xl font-medium mb-1">Continue as Guest</h1>
        <p className="font-body text-sm text-muted-foreground">We just need a few quick details.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="guest-name" className="font-body text-sm font-medium block mb-1.5">Full name</label>
          <input
            id="guest-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            className="w-full font-body text-sm border border-border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label htmlFor="guest-email" className="font-body text-sm font-medium block mb-1.5">Email address</label>
          <input
            id="guest-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full font-body text-sm border border-border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label htmlFor="guest-phone" className="font-body text-sm font-medium block mb-1.5">Phone number</label>
          <input
            id="guest-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+971 50 000 0000"
            className="w-full font-body text-sm border border-border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>

        <Button type="submit" className="w-full font-body" disabled={!name || !email}>
          Continue to Order Summary
        </Button>
      </form>
    </div>
  );
}
