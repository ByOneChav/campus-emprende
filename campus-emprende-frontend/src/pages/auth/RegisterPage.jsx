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
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    role: 'ROLE_STUDENT'
  });

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
      setError(
        err.response?.data?.message ||
        'El registro ha fallado. Por favor, inténtelo de nuevo.'
      ); // Muestra error
    } finally {
      setLoading(false); // Desactiva loading
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f5f7fb]"> {/* Fondo general */}

      {/* Left — hero image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0A84FF]">
        {/* Imagen solo en desktop */}

        <img
          src={LogoCampus}
          alt="Campus Emprende"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Overlay elegante */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A84FF]/40 via-[#0A84FF]/50 to-[#001B44]/80" />

        {/* Texto sobre imagen */}
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">

          {/* Icono con efecto glass */}
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-lg">
            <GraduationCap className="h-8 w-8" />
          </div>

          <h2 className="text-5xl font-bold leading-tight mb-4">
            Campus Emprende
          </h2>

          <p className="text-white/85 text-xl max-w-md leading-relaxed">
            El mercado moderno de servicios estudiantiles para conectar talento universitario.
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">

        {/* Card central */}
        <div className="w-full max-w-md space-y-6">

          {/* Branding en móvil */}
          <div className="flex flex-col items-center text-center lg:hidden">

            {/* Logo mobile */}
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0A84FF] shadow-lg shadow-blue-500/30">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-slate-900">
              Campus Emprende
            </h1>

            <p className="text-slate-500 text-sm mt-1">
              Mercado de servicios para estudiantes
            </p>
          </div>

          {/* Decorated card */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-300/30 backdrop-blur-sm">

            {/* Barra superior elegante */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#0A84FF] via-[#5AA9FF] to-[#B7D8FF]" />

            {/* Glow decorativo */}
            <div className="absolute -top-24 right-[-50px] h-52 w-52 rounded-full bg-blue-100 blur-3xl opacity-60" />

            {/* Contenido */}
            <div className="relative px-8 py-8 space-y-7">

              {/* Header */}
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                  Crea una cuenta
                </h1>

                <p className="mt-2 text-[17px] text-slate-500 leading-relaxed">
                  Únete hoy mismo al mercado del campus.
                </p>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Mostrar error si existe */}
                {error && (
                  <Alert
                    variant="destructive"
                    className="rounded-2xl border-red-200"
                  >
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Campo nombre */}
                <div className="space-y-2">
                  <Label
                    htmlFor="fullName"
                    className="text-[15px] font-semibold text-slate-800"
                  >
                    Nombre completo
                  </Label>

                  <Input
                    id="fullName"
                    placeholder="Elias Bombom"
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({ ...form, fullName: e.target.value })
                    }
                    required
                    className="h-14 rounded-2xl border-slate-200 bg-slate-50/70 text-[15px] shadow-sm transition-all duration-200 focus:border-[#0A84FF] focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* Campo email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-[15px] font-semibold text-slate-800"
                  >
                    Correo Institucional
                  </Label>

                  <Input
                    id="email"
                    type="email"
                    placeholder="eliasbombom@gmail.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                    className="h-14 rounded-2xl border-slate-200 bg-slate-50/70 text-[15px] shadow-sm transition-all duration-200 focus:border-[#0A84FF] focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* Campo teléfono */}
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-[15px] font-semibold text-slate-800"
                  >
                    Teléfono (opcional)
                  </Label>

                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+56 9 111 2222"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="h-14 rounded-2xl border-slate-200 bg-slate-50/70 text-[15px] shadow-sm transition-all duration-200 focus:border-[#0A84FF] focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* Campo contraseña */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-[15px] font-semibold text-slate-800"
                  >
                    Contraseña
                  </Label>

                  <Input
                    id="password"
                    type="password"
                    placeholder="*************"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                    minLength={6}
                    className="h-14 rounded-2xl border-slate-200 bg-slate-50/70 text-[15px] shadow-sm transition-all duration-200 focus:border-[#0A84FF] focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* Botón submit */}
                <Button
                  type="submit"
                  className="w-full h-14 rounded-2xl bg-[#0A84FF] text-white text-[17px] font-semibold shadow-lg shadow-blue-500/30 transition-all duration-300 hover:bg-[#339CFF] hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-[1px]"
                  size="lg"
                  disabled={loading}
                >
                  {loading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}

                  Crear una cuenta
                </Button>
              </form>

              {/* Link a login */}
              <p className="text-center text-[15px] text-slate-500">
                ¿Ya tienes una cuenta?{' '}

                <Link
                  to="/auth/login"
                  className="font-semibold text-[#0A84FF] transition-colors hover:text-[#006BE6] hover:underline"
                >
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
