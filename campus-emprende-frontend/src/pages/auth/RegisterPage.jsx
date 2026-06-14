import { useState } from 'react'; // Hook para manejar estado local
import { Link, useNavigate } from 'react-router-dom'; // Navegación entre rutas
import { useAuth } from '@/context/AuthContext'; // Hook de autenticación (Redux)
import { Button } from '@/components/ui/button'; // Botón reutilizable
import { Input } from '@/components/ui/input'; // Input reutilizable
import { Label } from '@/components/ui/label'; // Label para formularios
import { Alert, AlertDescription } from '@/components/ui/alert'; // Componente para mostrar errores
import { GraduationCap, Loader2, Users, ShieldCheck, BookOpen } from 'lucide-react'; // Iconos
import logoCampus from '@/assets/logoCampus.png'; // Logo de marca (fondo transparente, usado como watermark)

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

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!termsAccepted) {
      setShowTermsModal(true);
      return;
    }

    setError('');
    setLoading(true);

    try {
      await signup(form);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'El registro ha fallado. Por favor, inténtelo de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#071A35] via-[#0A84FF] to-[#5B3DF5] px-4 py-10 sm:py-14">

      {/* ───────────── Fondo decorativo: logo, texto institucional e iconos ───────────── */}
      <div aria-hidden="true" className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">

        {/* Logos de marca con fondo transparente, como watermark */}
        <img
          src={logoCampus}
          alt=""
          className="absolute -top-24 -right-20 w-[340px] sm:w-[520px] opacity-10 rotate-6"
        />
        <img
          src={logoCampus}
          alt=""
          className="absolute -bottom-28 -left-24 w-[240px] sm:w-[380px] opacity-10 -rotate-12"
        />

        {/* Texto grande de marca, detrás de la tarjeta */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="whitespace-nowrap text-[20vw] sm:text-[10vw] font-extrabold leading-none tracking-tight text-white/[0.07]">
            CAMPUS EMPRENDE
          </span>
        </div>

        {/* Lema institucional */}
        <div className="absolute bottom-6 left-0 right-0 px-4 text-center">
          <span className="text-xs sm:text-base md:text-xl font-semibold uppercase tracking-[0.35em] text-white/25">
            Conecta • Aprende • Emprende
          </span>
        </div>

        {/* Iconos que hacen referencia a la plataforma */}
        <GraduationCap className="absolute left-6 top-10 h-14 w-14 text-white/10 sm:left-16 sm:h-24 sm:w-24" strokeWidth={1.5} />
        <Users className="absolute right-8 bottom-28 h-12 w-12 text-white/10 sm:right-20 sm:h-20 sm:w-20" strokeWidth={1.5} />
        <BookOpen className="absolute right-6 top-1/3 h-10 w-10 text-white/10 sm:right-24 sm:h-16 sm:w-16" strokeWidth={1.5} />
        <ShieldCheck className="absolute left-6 bottom-1/3 h-10 w-10 text-white/10 sm:left-20 sm:h-16 sm:w-16" strokeWidth={1.5} />
      </div>

      {/* ───────────── Tarjeta central del formulario ───────────── */}
      <div className="relative z-10 w-full max-w-md">

        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-900/20">

          {/* Barra superior elegante */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#0A84FF] via-[#5AA9FF] to-[#B7D8FF]" />

          {/* Glow decorativo */}
          <div className="absolute -top-24 right-[-50px] h-52 w-52 rounded-full bg-blue-100 blur-3xl opacity-60" />

          {/* Contenido */}
          <div className="relative px-6 sm:px-8 py-8 space-y-7">

            {/* Header: icono + badge de acceso seguro (igual estilo que login) */}
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0A84FF] shadow-lg shadow-blue-500/30">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0A84FF]">
                <ShieldCheck className="h-3.5 w-3.5" />
                Acceso seguro
              </span>
            </div>

            {/* Título */}
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
                  placeholder="elia.delgado@duocuc.cl"
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
                  placeholder="+56 9 2031 5701"
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

              {/* Campo confirmar contraseña */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-[15px] font-semibold text-slate-800"
                >
                  Confirme Contraseña
                </Label>

                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="*************"
                  required
                  minLength={6}
                  className="h-14 rounded-2xl border-slate-200 bg-slate-50/70 text-[15px] shadow-sm transition-all duration-200 focus:border-[#0A84FF] focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* Términos y condiciones */}
              <div className="mt-4 text-sm text-slate-600">
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />

                  <span>
                    He leído y acepto los{" "}
                    <a
                      href="/legal/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Términos y Condiciones
                    </a>
                  </span>
                </label>
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

            {/* Modal de términos y condiciones */}
            {showTermsModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

                <div className="w-full max-w-md mx-4 overflow-hidden rounded-3xl bg-white shadow-2xl">

                  <div className="bg-gradient-to-r from-[#0A84FF] to-[#339CFF] p-6 text-white">
                    <h3 className="text-2xl font-bold">
                      Términos y Condiciones
                    </h3>

                    <p className="mt-1 text-blue-100">
                      Aceptación requerida
                    </p>
                  </div>

                  <div className="p-6">

                    <div className="flex justify-center mb-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                        <span className="text-3xl">⚠️</span>
                      </div>
                    </div>

                    <p className="text-center text-slate-600 leading-relaxed">
                      Debes aceptar los Términos y Condiciones antes de crear una cuenta
                      en <strong>Campus Emprende.</strong>
                    </p>

                    <div className="mt-6 flex gap-3">

                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setShowTermsModal(false)}
                      >
                        Entendido
                      </Button>

                      <Button
                        className="flex-1 bg-[#0A84FF] hover:bg-[#006BE6]"
                        onClick={() => {
                          window.open('/legal/terms', '_blank');
                        }}
                      >
                        Ver términos
                      </Button>

                    </div>

                  </div>

                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}