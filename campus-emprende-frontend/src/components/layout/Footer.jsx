import {
  GraduationCap,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Mail,
} from 'lucide-react';

import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-slate-200 bg-gradient-to-br from-slate-50 via-white to-blue-50">

      {/* EFECTOS */}
      <div className="absolute -top-16 left-0 h-40 w-40 rounded-full bg-blue-100 blur-3xl opacity-50"></div>

      <div className="absolute -bottom-20 right-0 h-52 w-52 rounded-full bg-indigo-100 blur-3xl opacity-50"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-10">

        {/* TOP */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

          {/* BRAND */}
          <div className="space-y-4 max-w-md">

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
              <Sparkles className="h-4 w-4" />
              Marketplace universitario
            </div>

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200">
                <GraduationCap className="h-7 w-7" />
              </div>

              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  Campus Emprende
                </h2>

                <p className="text-sm text-slate-500">
                  Mercado de servicios estudiantiles
                </p>
              </div>
            </div>

            <p className="text-sm leading-7 text-slate-600">
              Conecta estudiantes talentosos con personas que buscan
              servicios profesionales, rápidos y confiables dentro
              del campus universitario.
            </p>

            {/* BADGES */}
            <div className="flex flex-wrap gap-3">

              <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                Usuarios verificados
              </div>

              <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                <Mail className="h-4 w-4 text-blue-500" />
                Soporte activo
              </div>
            </div>
          </div>

          {/* LINKS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

            {/* NAVEGACION */}
            <div>

              <h3 className="mb-5 text-sm font-black uppercase tracking-[0.2em] text-slate-400">
                Navegación
              </h3>

              <nav className="space-y-3">

                <Link
                  to="/services"
                  className="group flex items-center gap-2 text-sm font-medium text-slate-600 transition-all hover:text-blue-600"
                >
                  Explorar servicios

                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>

                <Link
                  to="/auth/login"
                  className="group flex items-center gap-2 text-sm font-medium text-slate-600 transition-all hover:text-blue-600"
                >
                  Acceso

                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>

                <Link
                  to="/auth/register"
                  className="group flex items-center gap-2 text-sm font-medium text-slate-600 transition-all hover:text-blue-600"
                >
                  Registro

                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </nav>
            </div>

            {/* INFO */}
            <div>

              <h3 className="mb-5 text-sm font-black uppercase tracking-[0.2em] text-slate-400">
                Plataforma
              </h3>

              <div className="space-y-4 text-sm text-slate-600">

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="font-semibold text-slate-800">
                    Servicios rápidos
                  </p>

                  <p className="mt-1 text-slate-500">
                    Solicita y ofrece servicios en minutos.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="font-semibold text-slate-800">
                    Comunidad universitaria
                  </p>

                  <p className="mt-1 text-slate-500">
                    Diseñado especialmente para estudiantes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LINE */}
        <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Campus Emprende.
            Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-3">

            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>

            <span className="text-sm font-medium text-slate-500">
              Plataforma activa
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}