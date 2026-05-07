import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getActiveServicesThunk } from '@/store/admin/adminThunk';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle } from 'lucide-react';

const CATEGORY_LABELS = {
  WEB_DEV: 'Web Dev', GRAPHIC_DESIGN: 'Design',
  TECH_SUPPORT: 'Soporte técnico', TUTORING: 'Tutoría',
  PHOTOGRAPHY: 'Fotografía', OTHER: 'Otro',
};

export default function AdminActiveServicesPage() {
  const dispatch = useDispatch();
  const { activeServices, loading } = useSelector((s) => s.admin);

  useEffect(() => { dispatch(getActiveServicesThunk()); }, [dispatch]);

  return (

  <div className="min-h-screen bg-[#f5f7fb] p-6">

    {/* Glow decorativo */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none">

      <div className="absolute top-[-120px] right-[-120px] h-[300px] w-[300px] rounded-full bg-blue-100 blur-3xl opacity-50" />

      <div className="absolute bottom-[-120px] left-[-120px] h-[300px] w-[300px] rounded-full bg-slate-200 blur-3xl opacity-50" />

    </div>

    <div className="relative space-y-8">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div className="space-y-3">

          {/* Badge superior */}
          <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-xs font-semibold text-green-700">

            <CheckCircle className="h-3.5 w-3.5" />

            Servicios aprobados y visibles

          </div>

          {/* Título */}
          <div className="flex items-center gap-3 flex-wrap">

            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              Servicios activos
            </h1>

            {!loading && (

              <Badge className="h-8 px-3 rounded-xl bg-slate-900 text-white text-sm shadow-md">

                {activeServices.length}

              </Badge>

            )}

          </div>

          <p className="text-slate-500 text-[15px] max-w-2xl">
            Administra los servicios que actualmente están aprobados y visibles para los estudiantes.
          </p>

        </div>

      </div>

      {/* Loading */}
      {loading ? (

        <div className="grid gap-4">

          {[...Array(5)].map((_, i) => (

            <Skeleton
              key={i}
              className="h-32 rounded-3xl"
            />

          ))}

        </div>

      ) : activeServices.length === 0 ? (

        /* Empty state */
        <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white/80 backdrop-blur-sm shadow-xl">

          <div className="absolute top-[-50px] right-[-50px] h-44 w-44 rounded-full bg-green-100 blur-3xl opacity-50" />

          <div className="relative py-24 flex flex-col items-center justify-center text-center px-6">

            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-50 border border-green-100 shadow-inner mb-6">

              <CheckCircle className="h-12 w-12 text-green-500" />

            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-2">
              No hay servicios activos
            </h2>

            <p className="text-slate-500 max-w-md leading-relaxed">
              Cuando un servicio sea aprobado por el administrador aparecerá automáticamente en esta sección.
            </p>

          </div>

        </div>

      ) : (

        /* Grid */
        <div className="grid gap-5">

          {activeServices.map((s, index) => (

            <Card
              key={s.id}
              className="group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-lg shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-200/40"
            >

              {/* Glow */}
              <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-blue-100 blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-500" />

              {/* Barra lateral */}
              <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-green-400 to-emerald-500" />

              <CardContent className="relative p-6">

                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

                  {/* Info */}
                  <div className="flex items-start gap-5 min-w-0 flex-1">

                    {/* Número */}
                    <div className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0A84FF] to-[#5AA9FF] text-white font-black shadow-lg shadow-blue-300/40">

                      {index + 1}

                    </div>

                    {/* Texto */}
                    <div className="min-w-0 space-y-3 flex-1">

                      <div className="space-y-2">

                        <Link
                          to={`/services/${s.id}`}
                          className="block text-2xl font-black tracking-tight text-slate-900 hover:text-[#0A84FF] transition-colors truncate"
                        >

                          {s.title}

                        </Link>

                        <div className="flex flex-wrap items-center gap-2">

                          <Badge className="rounded-xl bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1">

                            {CATEGORY_LABELS[s.category]}

                          </Badge>

                          <Badge className="rounded-xl bg-green-50 text-green-700 border border-green-100 px-3 py-1">

                            Servicio aprobado

                          </Badge>

                        </div>

                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">

                        <span>Proveedor:</span>

                        <Link
                          to={`/profiles/${s.providerId}`}
                          className="font-semibold text-slate-700 hover:text-[#0A84FF] transition-colors"
                        >

                          {s.providerName}

                        </Link>

                      </div>

                    </div>

                  </div>

                  {/* Estado */}
                  <div className="flex items-center">

                    <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-3 shadow-sm">

                      <div className="relative flex h-3 w-3">

                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>

                        <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>

                      </div>

                      <span className="text-sm font-bold tracking-wide text-green-700">
                        ACTIVO
                      </span>

                    </div>

                  </div>

                </div>

              </CardContent>

            </Card>

          ))}

        </div>

      )}

    </div>

  </div>

);
}
