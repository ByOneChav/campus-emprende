import { useState } from 'react'; // Hook para manejar estado local
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Navegación y acceso a la ruta actual
import { useAuth } from '@/context/AuthContext'; // Hook de autenticación (Redux)
import { Button } from '@/components/ui/button'; // Botón reutilizable
import { Input } from '@/components/ui/input'; // Input reutilizable
import { Label } from '@/components/ui/label'; // Label para formularios
import { Alert, AlertDescription } from '@/components/ui/alert'; // Componente para mostrar errores
import { GraduationCap, Loader2 } from 'lucide-react'; // Iconos

import logoCampus from '@/assets/logoCampus.png'; // Importa imagen local



const LogoCampus = logoCampus; // Imagen usada en el componente

export default function LoginPage() {
  const { login } = useAuth(); // Función login que conecta con Redux + backend
  const navigate = useNavigate(); // Permite redireccionar
  const location = useLocation(); // Permite saber desde dónde vino el usuario

  // Ruta a la que se redirige después del login (o dashboard por defecto)
  const from = location.state?.from?.pathname || '/dashboard';

  // Estado del formulario
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(''); // Manejo de errores
  const [loading, setLoading] = useState(false); // Estado de carga

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita recargar la página
    setError(''); // Limpia errores previos
    setLoading(true); // Activa loading
    try {
      await login(form.email, form.password); // Llama a useAuth → thunk → backend
      navigate(from, { replace: true }); // Redirige a la página original o dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión. Compruebe sus credenciales.'); // Muestra error
    } finally {
      setLoading(false); // Desactiva loading
    }
  };

  return (
    <div className="min-h-screen flex"> {/* Contenedor principal */}

      {/* Left — hero image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary"> {/* Imagen solo en desktop */}
        <img
          src={LogoCampus}
          alt="Campus Emprende"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-primary/40" /> {/* Overlay oscuro */}
        <div className="relative z-10 flex flex-col justify-end p-12 text-white"> {/* Texto sobre imagen */}
          <GraduationCap className="h-12 w-12 mb-4" />
          <h2 className="text-4xl font-bold leading-tight mb-2">Campus Emprende</h2>
          <p className="text-white/80 text-lg">El mercado de servicios estudiantiles</p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 bg-background"> {/* Contenedor del formulario */}
        <div className="w-full max-w-md space-y-6"> {/* Card central */}

          {/* Mobile-only brand */}
          <div className="flex flex-col items-center text-center lg:hidden"> {/* Branding en móvil */}
            <GraduationCap className="h-10 w-10 text-primary mb-2" />
            <h1 className="text-2xl font-bold">Campus Emprende</h1>
            <p className="text-muted-foreground text-sm">Mercado de servicios para estudiantes</p>
          </div>

          {/* Decorated card */}
          <div className="relative rounded-2xl border border-border bg-card shadow-xl overflow-hidden"> {/* Tarjeta */}

            {/* Top accent bar */}
            <div className="h-1.5 w-full bg-linear-to-r from-primary via-primary/70 to-primary/30" />

            <div className="px-8 py-8 space-y-6"> {/* Contenido */}

              <div>
                <h1 className="text-3xl font-bold tracking-tight">Bienvenido de nuevo</h1>
                <p className="mt-1 text-muted-foreground">Inicia sesión en tu cuenta para continuar.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5"> {/* Formulario */}

                {/* Mostrar error si existe */}
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Campo email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="eliasbombom@gmail.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} // Actualiza estado
                    required
                  />
                </div>

                {/* Campo password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Contraseña</Label>
                    <Link to="/auth/forgot-password" className="text-xs text-primary hover:underline">
                      ¿Has olvidado tu contraseña?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="***************"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>

                {/* Botón submit */}
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {/* Spinner */}
                  Iniciar sesión
                </Button>
              </form>

              {/* Link a registro */}
              <p className="text-center text-sm text-muted-foreground">
                ¿Sin cuenta?{' '}
                <Link to="/auth/register" className="text-primary hover:underline font-medium">
                  Regístrate aquí
                </Link>
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}