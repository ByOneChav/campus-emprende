import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('loading');
    try {
      await forgotPassword(email);
      setStatus('sent');
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo enviar el correo electrónico de reinicio.');
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Restablecer contraseña</CardTitle>
            <CardDescription>Introduce tu correo electrónico para recibir un enlace de restablecimiento.</CardDescription>
          </CardHeader>
          <CardContent>
            {status === 'sent' ? (
              <div className="text-center space-y-4 py-4">
                <p className="text-green-600 font-medium">Correo electrónico enviado!</p>
                <p className="text-sm text-muted-foreground">
                  Revisa tu bandeja de entrada para obtener un enlace para restablecer la contraseña. (Válido 5 minutos).
                </p>
                <Button variant="outline" asChild>
                  <Link to="/auth/login"><ArrowLeft className="mr-2 h-4 w-4" />Volver a iniciar sesión</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-1.5">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={status === 'loading'}>
                  {status === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enviar enlace de reinicio
                </Button>
                <Button variant="ghost" className="w-full" asChild>
                  <Link to="/auth/login"><ArrowLeft className="mr-2 h-4 w-4" />Volver a iniciar sesión</Link>
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
