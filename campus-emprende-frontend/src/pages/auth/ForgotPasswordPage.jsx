import { useState } from 'react';

import { Link } from 'react-router-dom';

import { forgotPassword } from '@/api/auth';

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
  ArrowLeft,
  GraduationCap,
  ShieldCheck,
  Mail,
  Sparkles
} from 'lucide-react';

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

      setError(
        err.response?.data?.message ||
        'No se pudo enviar el correo electrónico de reinicio.'
      );

      setStatus('idle');

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
          BACKGROUND GLOW
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

              Recupera el acceso a tu cuenta de forma segura
              y continúa impulsando tus servicios profesionales.

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

            {/* ICON */}
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

              <ShieldCheck className="h-7 w-7" />

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

                Restablecer contraseña

              </CardTitle>

              <CardDescription
                className="
                  mt-3
                  text-[15px]
                  leading-7
                  text-slate-500
                "
              >

                Introduce tu correo electrónico para recibir
                un enlace seguro de restablecimiento.

              </CardDescription>

            </div>

          </CardHeader>

          <CardContent className="p-7 pt-0 sm:p-8 sm:pt-0">

            {status === 'sent' ? (

              <div className="space-y-6 py-4 text-center">

                {/* SUCCESS ICON */}
                <div
                  className="
                    mx-auto
                    flex
                    h-20
                    w-20
                    items-center
                    justify-center
                    rounded-3xl
                    bg-green-100
                    shadow-lg
                    shadow-green-200/60
                  "
                >

                  <Mail className="h-10 w-10 text-green-600" />

                </div>

                <div>

                  <p className="text-xl font-black text-slate-900">

                    ¡Correo enviado!

                  </p>

                  <p className="mt-3 text-sm leading-7 text-slate-500">

                    Revisa tu bandeja de entrada para obtener
                    un enlace de recuperación.

                    <br />

                    El enlace expira en 5 minutos.

                  </p>

                </div>

                <Button
                  variant="outline"
                  asChild

                  className="
                    h-12
                    w-full
                    rounded-2xl
                    border-slate-200
                    text-[15px]
                    font-semibold
                    hover:bg-slate-50
                  "
                >

                  <Link to="/auth/login">

                    <ArrowLeft className="mr-2 h-4 w-4" />

                    Volver a iniciar sesión

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

                {/* INPUT */}
                <div className="space-y-2.5">

                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold text-slate-700"
                  >

                    Correo electrónico

                  </Label>

                  <Input
                    id="email"
                    type="email"
                    placeholder="elia.delgado@duocuc.cl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

                  disabled={status === 'loading'}

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

                  {status === 'loading' && (

                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                  )}

                  Enviar enlace de reinicio

                </Button>

                {/* BACK */}
                <Button
                  variant="ghost"
                  className="
                    h-14
                    w-full
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    text-[15px]
                    font-semibold
                    shadow-md
                    transition-all
                    duration-200
                    hover:bg-slate-50
                  "
                  asChild
                >

                  <Link to="/auth/login">

                    <ArrowLeft className="mr-2 h-4 w-4" />

                    Volver a iniciar sesión

                  </Link>

                </Button>

              </form>

            )}

          </CardContent>

        </Card>

      </div>

    </div>

  );
}