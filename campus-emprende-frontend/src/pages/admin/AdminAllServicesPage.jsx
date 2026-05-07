import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllServicesThunk } from "@/store/admin/adminThunk";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase } from "lucide-react";

const CATEGORY_LABELS = {
  WEB_DEV: "Desarrollo web",
  GRAPHIC_DESIGN: "Diseño Gráfico",
  TECH_SUPPORT: "Soporte técnico",
  TUTORING: "Tutoría",
  PHOTOGRAPHY: "Fotografía",
  OTHER: "Otro",
};

const STATUS_COLORS = {
  ACTIVE: "bg-green-100 text-green-700",
  PENDIENTE: "bg-yellow-100 text-yellow-700",
  RECHAZADO: "bg-red-100 text-red-700",
  INACTIVO: "bg-gray-100 text-gray-600",
};

export default function AdminAllServicesPage() {
  const dispatch = useDispatch();
  const { allServices, loading } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(getAllServicesThunk());
  }, [dispatch]);

  return (

  <div className="min-h-screen bg-[#f6f8fc] p-6">

    {/* Fondo decorativo */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none">

      <div className="absolute top-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-blue-100 blur-3xl opacity-40" />

      <div className="absolute bottom-[-120px] left-[-120px] h-[320px] w-[320px] rounded-full bg-indigo-100 blur-3xl opacity-40" />

    </div>

    <div className="relative space-y-8">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div className="space-y-3">

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700">

            <Briefcase className="h-3.5 w-3.5" />

            Gestión administrativa de servicios

          </div>

          <div className="flex items-center gap-3 flex-wrap">

            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              Todos los servicios
            </h1>

            {!loading && (

              <Badge className="h-8 px-3 rounded-xl bg-slate-900 text-white text-sm shadow-md">

                {allServices.length}

              </Badge>

            )}

          </div>

          <p className="text-slate-500 text-[15px] max-w-2xl">
            Visualiza y administra el estado de todos los servicios registrados dentro de la plataforma.
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

      ) : allServices.length === 0 ? (

        /* Empty */
        <div className="rounded-[32px] border border-slate-200 bg-white shadow-xl py-24 text-center">

          <Briefcase className="h-14 w-14 mx-auto text-slate-300 mb-5" />

          <h2 className="text-2xl font-black text-slate-900 mb-2">
            No hay servicios registrados
          </h2>

          <p className="text-slate-500">
            Los servicios aparecerán aquí automáticamente.
          </p>

        </div>

      ) : (

        /* Lista */
        <div className="grid gap-5">

          {allServices.map((s, index) => {

            const isApproved = s.status === 'APROBADO';
            const isInactive = s.status === 'INACTIVO';
            const isPending = s.status === 'PENDIENTE';
            const isRejected = s.status === 'RECHAZADO';

            return (

              <Card
                key={s.id}
                className="group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-lg shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-200/30"
              >

                {/* Glow */}
                <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-blue-100 blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />

                {/* Barra lateral dinámica */}
                <div
                  className={`
                    absolute left-0 top-0 h-full w-1.5
                    ${isApproved ? 'bg-gradient-to-b from-green-400 to-emerald-500' : ''}
                    ${isInactive ? 'bg-gradient-to-b from-red-400 to-rose-500' : ''}
                    ${isPending ? 'bg-gradient-to-b from-yellow-400 to-orange-500' : ''}
                    ${isRejected ? 'bg-gradient-to-b from-slate-500 to-slate-700' : ''}
                  `}
                />

                <CardContent className="relative p-6">

                  <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

                    {/* Info */}
                    <div className="flex items-start gap-5 min-w-0 flex-1">

                      {/* Número */}
                      <div className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0A84FF] to-[#5AA9FF] text-white font-black shadow-lg shadow-blue-300/40">

                        {index + 1}

                      </div>

                      {/* Textos */}
                      <div className="space-y-3 min-w-0 flex-1">

                        <div className="space-y-2">

                          <Link
                            to={`/services/${s.id}`}
                            className="block text-2xl font-black tracking-tight text-slate-900 hover:text-[#0A84FF] transition-colors truncate"
                          >

                            {s.title}

                          </Link>

                          <div className="flex flex-wrap items-center gap-2">

                            <Badge className="rounded-xl bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1">

                              {CATEGORY_LABELS[s.category]}

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

                      {/* APROBADO */}
                      {isApproved && (

                        <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-3 shadow-sm">

                          <div className="relative flex h-3 w-3">

                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>

                            <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>

                          </div>

                          <span className="text-sm font-bold tracking-wide text-green-700">
                            APROBADO
                          </span>

                        </div>

                      )}

                      {/* INACTIVO */}
                      {isInactive && (

                        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-3 shadow-sm">

                          <div className="h-3 w-3 rounded-full bg-red-500" />

                          <span className="text-sm font-bold tracking-wide text-red-700">
                            INACTIVO
                          </span>

                        </div>

                      )}

                      {/* PENDIENTE */}
                      {isPending && (

                        <div className="flex items-center gap-3 rounded-2xl border border-yellow-200 bg-yellow-50 px-5 py-3 shadow-sm">

                          <div className="h-3 w-3 rounded-full bg-yellow-500" />

                          <span className="text-sm font-bold tracking-wide text-yellow-700">
                            PENDIENTE
                          </span>

                        </div>

                      )}

                      {/* RECHAZADO */}
                      {isRejected && (

                        <div className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-slate-100 px-5 py-3 shadow-sm">

                          <div className="h-3 w-3 rounded-full bg-slate-600" />

                          <span className="text-sm font-bold tracking-wide text-slate-700">
                            RECHAZADO
                          </span>

                        </div>

                      )}

                    </div>

                  </div>

                </CardContent>

              </Card>

            );

          })}

        </div>

      )}

    </div>

  </div>

);
}
