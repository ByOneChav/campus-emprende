import { useState } from 'react';

import {
  useSearchParams,
  Link
} from 'react-router-dom';

import { resetPassword } from '@/api/auth';

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import {
  Alert,
  AlertDescription
} from '@/components/ui/alert';

import {
  Loader2,
  LockKeyhole,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function ResetPasswordPage() {

  const [searchParams] = useSearchParams();

  const token = searchParams.get('token');

  const [password, setPassword] = useState('');

  const [confirm, setConfirm] = useState('');

  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');

    if (password !== confirm) {

      setError('Las contraseñas no coinciden.');

      return;

    }

    if (!token) {

      setError('El enlace de recuperación es inválido o expiró.');

      return;

    }

    setLoading(true);

    try {

      await resetPassword(token, password);

      setSuccess(true);

    } catch (err) {

      setError(
        err.response?.data?.message ||
        'El reinicio falló. Es posible que el enlace haya caducado.'
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-gradient-to-br
        from-[#f8fbff]
        via-[#eef5ff]
        to-[#f5f7fb]
        flex
        items-center
        justify-center
        px-4
        py-10
      "
    >

      {/* =========================
          BACKGROUND
      ========================== */}

      <div className="absolute top-[-120px] left-[-120px] h-[320px] w-[320px] rounded-full bg-blue-200 blur-3xl opacity-30" />

      <div className="absolute bottom-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-indigo-200 blur-3xl opacity-30" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(10,132,255,0.08),transparent_40%)]" />

      {/* =========================
          CONTENT
      ========================== */}

      <div className="relative z-10 w-full max-w-md">

        {/* BRAND */}

        <div className="mb-6 text-center">

          <div
            className="
              mx-auto
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-3xl
              bg-gradient-to-br
              from-[#0A84FF]
              to-[#5AA9FF]
              shadow-2xl
              shadow-blue-500/30
            "
          >

            <GraduationCap className="h-10 w-10 text-white" />

          </div>

          <div className="mt-5">

            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-blue-200
                bg-blue-50
                px-4
                py-1.5
                text-xs
                font-semibold
                text-[#0A84FF]
                shadow-sm
              "
            >

              <Sparkles className="h-3.5 w-3.5" />

              Seguridad de cuenta

            </div>

            <h1
              className="
                mt-5
                text-3xl
                sm:text-4xl
                font-black
                tracking-tight
                text-slate-900
              "
            >

              Campus Emprende

            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">

              Protege tu cuenta con una contraseña
              segura y continúa impulsando tus servicios.

            </p>

          </div>

        </div>

        {/* =========================
            CARD
        ========================== */}

        <Card
          className="
            overflow-hidden
            rounded-[32px]
            border
            border-white/60
            bg-white/80
            backdrop-blur-xl
            shadow-2xl
            shadow-slate-200/70
          "
        >

          {/* TOP BAR */}

          <div className="h-1.5 w-full bg-gradient-to-r from-[#0A84FF] via-[#5AA9FF] to-[#B7D8FF]" />

          <CardHeader className="space-y-4 p-7 sm:p-8">

            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-gradient-to-br
                from-[#0A84FF]
                to-[#5AA9FF]
                text-white
                shadow-lg
                shadow-blue-500/30
              "
            >

              {success ? (

                <CheckCircle2 className="h-7 w-7" />

              ) : (

                <ShieldCheck className="h-7 w-7" />

              )}

            </div>

            <div>

              <CardTitle
                className="
                  text-2xl
                  font-black
                  tracking-tight
                  text-slate-900
                "
              >

                {success
                  ? '¡Contraseña actualizada!'
                  : 'Establecer nueva contraseña'
                }

              </CardTitle>

              <CardDescription
                className="
                  mt-3
                  text-[15px]
                  leading-7
                  text-slate-500
                "
              >

                {success
                  ? 'Tu contraseña fue restablecida correctamente. Ya puedes iniciar sesión.'
                  : 'Elige una contraseña segura para proteger tu cuenta.'
                }

              </CardDescription>

            </div>

          </CardHeader>

          <CardContent className="p-7 pt-0 sm:p-8 sm:pt-0">

            {success ? (

              <div className="space-y-6 py-2">

                {/* SUCCESS VISUAL */}

                <div
                  className="
                    flex
                    items-center
                    gap-4
                    rounded-3xl
                    border
                    border-green-200
                    bg-green-50
                    p-5
                  "
                >

                  <div
                    className="
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      bg-green-500
                      text-white
                      shadow-lg
                    "
                  >

                    <CheckCircle2 className="h-7 w-7" />

                  </div>

                  <div>

                    <p className="font-bold text-green-900">

                      Contraseña cambiada

                    </p>

                    <p className="mt-1 text-sm text-green-700">

                      Tu cuenta ahora está protegida.

                    </p>

                  </div>

                </div>

                {/* LOGIN BUTTON */}

                <Button
                  asChild

                  className="
                    h-14
                    w-full
                    rounded-2xl
                    bg-gradient-to-r
                    from-[#0A84FF]
                    to-[#339CFF]
                    text-[16px]
                    font-semibold
                    text-white
                    shadow-xl
                    shadow-blue-500/30
                    transition-all
                    duration-300
                    hover:-translate-y-[1px]
                    hover:shadow-2xl
                    hover:shadow-blue-500/40
                  "
                >

                  <Link to="/auth/login">

                    Ir al inicio de sesión

                    <ArrowRight className="ml-2 h-4 w-4" />

                  </Link>

                </Button>

              </div>

            ) : (

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* ERROR */}

                {error && (

                  <Alert
                    variant="destructive"
                    className="rounded-2xl"
                  >

                    <AlertDescription>

                      {error}

                    </AlertDescription>

                  </Alert>

                )}

                {/* PASSWORD */}

                <div className="space-y-2.5">

                  <Label
                    htmlFor="password"
                    className="text-sm font-semibold text-slate-700"
                  >

                    Nueva contraseña

                  </Label>

                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}

                    className="
                      h-14
                      rounded-2xl
                      border-slate-200
                      bg-white/80
                      text-[15px]
                      shadow-sm
                      transition-all
                      duration-300
                      focus:border-[#0A84FF]
                      focus:ring-[#0A84FF]/20
                    "
                  />

                </div>

                {/* CONFIRM */}

                <div className="space-y-2.5">

                  <Label
                    htmlFor="confirm"
                    className="text-sm font-semibold text-slate-700"
                  >

                    Confirmar contraseña

                  </Label>

                  <Input
                    id="confirm"
                    type="password"
                    placeholder="••••••••"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required

                    className="
                      h-14
                      rounded-2xl
                      border-slate-200
                      bg-white/80
                      text-[15px]
                      shadow-sm
                      transition-all
                      duration-300
                      focus:border-[#0A84FF]
                      focus:ring-[#0A84FF]/20
                    "
                  />

                </div>

                {/* BUTTON */}

                <Button
                  type="submit"

                  className="
                    h-14
                    w-full
                    rounded-2xl
                    bg-gradient-to-r
                    from-[#0A84FF]
                    to-[#339CFF]
                    text-[16px]
                    font-semibold
                    text-white
                    shadow-xl
                    shadow-blue-500/30
                    transition-all
                    duration-300
                    hover:-translate-y-[1px]
                    hover:shadow-2xl
                    hover:shadow-blue-500/40
                  "

                  disabled={loading}
                >

                  {loading && (

                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                  )}

                  <LockKeyhole className="mr-2 h-4 w-4" />

                  Restablecer contraseña

                </Button>

              </form>

            )}

          </CardContent>

        </Card>

      </div>

    </div>

  );
}