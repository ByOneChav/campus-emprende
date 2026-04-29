import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GraduationCap, Loader2 } from 'lucide-react';

const HERO_IMAGE =
  'https://res.cloudinary.com/dcpesbd8q/image/upload/fl_preserve_transparency/v1777387685/ChatGPT_Image_Apr_28_2026_08_16_49_PM_rr0584.jpg';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — hero image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary">
        <img
          src={HERO_IMAGE}
          alt="Campus Emprende"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-primary/40" />
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <GraduationCap className="h-12 w-12 mb-4" />
          <h2 className="text-4xl font-bold leading-tight mb-2">Campus Emprende</h2>
          <p className="text-white/80 text-lg">The student service marketplace</p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile-only brand */}
          <div className="flex flex-col items-center text-center lg:hidden">
            <GraduationCap className="h-10 w-10 text-primary mb-2" />
            <h1 className="text-2xl font-bold">Campus Emprende</h1>
            <p className="text-muted-foreground text-sm">Student service marketplace</p>
          </div>

          {/* Decorated card */}
          <div className="relative rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
            {/* Top accent bar */}
            <div className="h-1.5 w-full bg-linear-to-r from-primary via-primary/70 to-primary/30" />

            <div className="px-8 py-8 space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
                <p className="mt-1 text-muted-foreground">Sign in to your account to continue</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@university.edu"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/auth/forgot-password" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                No account?{' '}
                <Link to="/auth/register" className="text-primary hover:underline font-medium">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
