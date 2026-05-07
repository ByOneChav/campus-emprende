import { useState } from 'react'; // Hook para manejar estado local
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Navegación y acceso a la ruta actual
import { useAuth } from '@/context/AuthContext'; // Hook de autenticación (Redux)

import { Button } from '@/components/ui/button'; // Botón reutilizable
import { Input } from '@/components/ui/input'; // Input reutilizable
import { Label } from '@/components/ui/label'; // Label para formularios
import { Alert, AlertDescription } from '@/components/ui/alert'; // Componente para mostrar errores

import {
  GraduationCap,
  Loader2,
  Sparkles
} from 'lucide-react'; // Iconos

import backgroundCampus from '@/assets/background-campus.png'; // Imagen de fondo
import logoCampus from '@/assets/logoCampus.png'; // Logo local

const LogoCampus = logoCampus; // Imagen usada en el componente

export default function LoginPage() {

  const { login } = useAuth(); // Función login que conecta con Redux + backend

  const navigate = useNavigate(); // Permite redireccionar

  const location = useLocation(); // Permite saber desde dónde vino el usuario

  // Ruta a la que se redirige después del login (o dashboard por defecto)
  const from = location.state?.from?.pathname || '/dashboard';

  // Estado del formulario
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState(''); // Manejo de errores

  const [loading, setLoading] = useState(false); // Estado de carga

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e) => {

    e.preventDefault(); // Evita recargar la página

    setError(''); // Limpia errores previos

    setLoading(true); // Activa loading

    try {

      // Llama a useAuth → thunk → backend
      await login(form.email, form.password);

      // Redirige a la página original o dashboard
      navigate(from, { replace: true });

    } catch (err) {

      // Muestra error
      setError(
        err.response?.data?.message ||
        'Error al iniciar sesión. Compruebe sus credenciales.'
      );

    } finally {

      setLoading(false); // Desactiva loading

    }
  };

  return (

    <div className="relative min-h-screen overflow-hidden bg-[#f5f7fb]">

      {/* =========================
          IMAGEN DE FONDO COMPLETA
      ========================== */}
      <div className="absolute inset-0 overflow-hidden">

        {/* Imagen fondo */}
        <img
          src={backgroundCampus}
          alt="Campus Emprende Background"

          // object-cover hace que la imagen ocupe TODO el espacio
          // scale aumenta un poco el tamaño para evitar cortes raros
          className="h-full w-full object-cover object-center scale-110"
        />

        {/* Overlay oscuro/transparente */}
        <div className="absolute inset-0 bg-[#001B44]/75" />

        {/* Degradado elegante */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#001B44]/70 via-[#0A84FF]/20 to-[#001B44]/80" />

        {/* Glow central */}
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />

      </div>

      {/* =========================
          CONTENIDO PRINCIPAL FLEX
      ========================== */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12 backdrop-blur-[2px]">

        {/* Glow decorativo */}
        <div className="absolute left-[-100px] top-[-100px] h-[300px] w-[300px] rounded-full bg-blue-500/20 blur-3xl" />

        <div className="absolute bottom-[-100px] right-[-100px] h-[300px] w-[300px] rounded-full bg-cyan-400/20 blur-3xl" />

        {/* =========================
            CARD LOGIN
        ========================== */}

        <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-500">

          {/* Card */}
          <div className="relative overflow-hidden rounded-[32px] border border-white/20 bg-white/92 shadow-2xl backdrop-blur-xl">

            {/* Barra superior */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#0A84FF] via-[#5AA9FF] to-[#B7D8FF]" />

            {/* Glow interno */}
            <div className="absolute -top-24 right-[-50px] h-52 w-52 rounded-full bg-blue-100 blur-3xl opacity-50" />

            {/* Contenido */}
            <div className="relative px-8 py-9 space-y-7">

              {/* Header */}
              <div className="space-y-5">

                {/* Top Row */}
                <div className="flex items-center justify-between">

                  {/* Icono */}
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0A84FF] to-[#5AA9FF] shadow-lg shadow-blue-500/30">

                    <GraduationCap className="h-8 w-8 text-white" />

                  </div>

                  {/* Badge */}
                  <div className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-[#0A84FF] shadow-sm">

                    <Sparkles className="h-4 w-4" />

                    Acceso seguro

                  </div>

                </div>

                {/* Título */}
                <div>

                  <h1 className="text-4xl font-black tracking-tight text-slate-900">
                    Bienvenido de nuevo
                  </h1>

                  <p className="mt-2 text-[17px] leading-relaxed text-slate-600">
                    Inicia sesión en tu cuenta para continuar.
                  </p>

                </div>

              </div>

              {/* =========================
                  FORMULARIO
              ========================== */}

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Error */}
                {error && (

                  <Alert
                    variant="destructive"
                    className="rounded-2xl border-red-200"
                  >

                    <AlertDescription>
                      {error}
                    </AlertDescription>

                  </Alert>

                )}

                {/* Campo email */}
                <div className="space-y-2">

                  <Label
                    htmlFor="email"
                    className="text-[15px] font-semibold text-slate-800"
                  >
                    Correo electrónico
                  </Label>

                  <Input
                    id="email"
                    type="email"
                    placeholder="eliasbombom@gmail.com"
                    value={form.email}

                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value
                      })
                    }

                    required

                    className="h-14 rounded-2xl border-slate-200 bg-white/80 text-[15px] shadow-sm backdrop-blur-sm transition-all duration-200 focus:border-[#0A84FF] focus:ring-4 focus:ring-blue-100"
                  />

                </div>

                {/* Campo contraseña */}
                <div className="space-y-2">

                  {/* Header password */}
                  <div className="flex items-center justify-between">

                    <Label
                      htmlFor="password"
                      className="text-[15px] font-semibold text-slate-800"
                    >
                      Contraseña
                    </Label>

                    <Link
                      to="/auth/forgot-password"
                      className="text-sm font-medium text-[#0A84FF] transition-colors hover:text-[#006BE6] hover:underline"
                    >
                      ¿Has olvidado tu contraseña?
                    </Link>

                  </div>

                  <Input
                    id="password"
                    type="password"
                    placeholder="***************"
                    value={form.password}

                    onChange={(e) =>
                      setForm({
                        ...form,
                        password: e.target.value
                      })
                    }

                    required

                    className="h-14 rounded-2xl border-slate-200 bg-white/80 text-[15px] shadow-sm backdrop-blur-sm transition-all duration-200 focus:border-[#0A84FF] focus:ring-4 focus:ring-blue-100"
                  />

                </div>

                {/* Botón login */}
                <Button
                  type="submit"
                  className="w-full h-14 rounded-2xl bg-[#0A84FF] text-white text-[17px] font-semibold shadow-lg shadow-blue-500/30 transition-all duration-300 hover:-translate-y-[1px] hover:bg-[#339CFF] hover:shadow-xl hover:shadow-blue-500/40"
                  size="lg"
                  disabled={loading}
                >

                  {loading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}

                  Iniciar sesión

                </Button>

              </form>

              {/* Divider */}
              <div className="relative">

                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200/70" />
                </div>

                <div className="relative flex justify-center text-xs uppercase">

                  <span className="bg-white px-3 text-slate-400">
                    Campus Emprende
                  </span>

                </div>

              </div>

              {/* Footer */}
              <p className="text-center text-[15px] text-slate-600">

                ¿Sin cuenta?{' '}

                <Link
                  to="/auth/register"
                  className="font-semibold text-[#0A84FF] transition-colors hover:text-[#006BE6] hover:underline"
                >
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