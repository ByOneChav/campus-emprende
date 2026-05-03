import { useState } from 'react'; // Hook para manejar estado local
import { Link, useNavigate } from 'react-router-dom'; // Navegación entre rutas
import { useAuth } from '@/context/AuthContext'; // Hook de autenticación (Redux)
import { Button } from '@/components/ui/button'; // Botón reutilizable
import { Input } from '@/components/ui/input'; // Input reutilizable
import { Label } from '@/components/ui/label'; // Label para formularios
import { Alert, AlertDescription } from '@/components/ui/alert'; // Componente para mostrar errores
import { GraduationCap, Loader2 } from 'lucide-react'; // Iconos
import logoCampus from '@/assets/logoCampus.png'; // Importa imagen local



const LogoCampus = logoCampus; // Imagen usada en el componente

export default function RegisterPage() {
  const { signup } = useAuth(); // Función de registro conectada a Redux + backend
  const navigate = useNavigate(); // Permite redireccionar a otras páginas

  // Estado del formulario
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '', role: 'ROLE_STUDENT' });
  const [error, setError] = useState(''); // Manejo de errores
  const [loading, setLoading] = useState(false); // Estado de carga (spinner)

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita recargar la página
    setError(''); // Limpia errores previos
    setLoading(true); // Activa loading
    try {
      await signup(form); // Llama al thunk → API → backend
      navigate('/dashboard'); // Redirige al dashboard si todo sale bien
    } catch (err) {
      setError(err.response?.data?.message || 'El registro ha fallado. Por favor, inténtelo de nuevo.'); // Muestra error
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
          <h2 className="text-4xl font-bold leading-tight mb-2">ELIAS BOMBOM XD :)</h2>
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
            <div className="h-1.5 w-full bg-linear-to-r from-primary via-primary/70 to-primary/30" /> {/* Barra decorativa */}

            <div className="px-8 py-8 space-y-6"> {/* Contenido del formulario */}
              
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Crea una cuenta</h1>
                <p className="mt-1 text-muted-foreground">Únete hoy mismo al mercado del campus.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5"> {/* Formulario */}

                {/* Mostrar error si existe */}
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Campo nombre */}
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Nombre completo</Label>
                  <Input
                    id="fullName"
                    placeholder="Elias Bombom"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })} // Actualiza estado
                    required
                  />
                </div>

                {/* Campo email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email">Correo Institucional</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="eliasbombom@gmail.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                {/* Campo teléfono */}
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Teléfono (opcional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+56 9 111 2222"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                {/* Campo contraseña */}
                <div className="space-y-1.5">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="*************"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>

                {/* Botón submit */}
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {/* Spinner */}
                  Crear una cuenta
                </Button>
              </form>

              {/* Link a login */}
              <p className="text-center text-sm text-muted-foreground">
                ¿Ya tienes una cuenta?{' '}
                <Link to="/auth/login" className="text-primary hover:underline font-medium">
                  Iniciar sesión
                </Link>
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
