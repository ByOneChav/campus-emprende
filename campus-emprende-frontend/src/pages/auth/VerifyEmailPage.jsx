import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { verifyEmail } from '@/api/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No se encontró ningún token de verificación en la URL.');
      return;
    }
    verifyEmail(token)
      .then(() => {
        setStatus('success');
        setMessage('¡Tu correo electrónico ha sido verificado! Ya puedes usar todas las funciones.');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'La verificación falló. El token puede haber caducado o no ser válido.');
      });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Verificación de correo electrónico</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Verificando tu correo electrónico…</p>
            </>
          )}
          {status === 'success' && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500" />
              <p className="text-green-700 font-medium">{message}</p>
              <Button asChild>
                <Link to="/dashboard">Ir al Dashboard</Link>
              </Button>
            </>
          )}
          {status === 'error' && (
            <>
              <XCircle className="h-12 w-12 text-destructive" />
              <p className="text-destructive">{message}</p>
              <Button variant="outline" asChild>
                <Link to="/auth/login">Volver a iniciar sesión</Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
