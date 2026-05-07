import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getMyServices } from '@/api/services';
import { getSentRequests, getReceivedRequests } from '@/api/requests';

import { useAuth } from '@/context/AuthContext';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

import {
  Plus,
  Briefcase,
  Send,
  Inbox,
  AlertCircle,
  Sparkles
} from 'lucide-react';

const STATUS_COLORS = {
  PENDIENTE: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  APROBADO: 'bg-green-100 text-green-700 border border-green-200',
  RECHAZADO: 'bg-red-100 text-red-700 border border-red-200',
  INACTIVO: 'bg-gray-100 text-gray-600 border border-gray-200',
  ACEPTADO: 'bg-blue-100 text-blue-700 border border-blue-200',
  EN_CURSO: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
  COMPLETADO: 'bg-green-100 text-green-700 border border-green-200',
  CANCELADO: 'bg-red-100 text-red-700 border border-red-200',
};

export default function DashboardPage() {

  const { user } = useAuth();

  const [services, setServices] = useState([]);
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    Promise.all([
      getMyServices(),
      getSentRequests(),
      getReceivedRequests()
    ])
      .then(([{ data: s }, { data: se }, { data: re }]) => {

        setServices(s);
        setSent(se);
        setReceived(re);

      })
      .finally(() => setLoading(false));

  }, []);

  const pendingServices =
    services.filter((s) => s.status === 'PENDIENTE').length;

  const activeRequests =
    received.filter((r) =>
      ['PENDIENTE', 'ACEPTADO', 'EN_CURSO'].includes(r.status)
    ).length;

  return (

    <div className="min-h-screen bg-[#f5f7fb]">

      {/* Contenedor principal */}
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">

        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          {/* Welcome */}
          <div className="space-y-4">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-[#0A84FF] shadow-sm">

              <Sparkles className="h-4 w-4" />

              Panel principal

            </div>

            {/* Título */}
            <div>

              <h1 className="text-5xl font-black tracking-tight text-slate-900">
                Dashboard
              </h1>

              {/* Usuario personalizado */}
              <div className="mt-4 flex items-center gap-4">

                {/* Avatar */}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0A84FF] to-[#5AA9FF] text-xl font-bold text-white shadow-lg shadow-blue-500/30">

                  {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}

                </div>

                {/* Texto */}
                <div>

                  <p className="text-sm font-medium text-slate-500">
                    Bienvenido de nuevo 👋
                  </p>

                  <h2 className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-2xl font-bold text-transparent">

                    {user?.fullName?.split(' ')[0]}

                  </h2>

                </div>

              </div>

            </div>

          </div>

          {/* Botón nuevo servicio */}
          <Button
            asChild
            className="h-14 rounded-2xl bg-[#0A84FF] px-8 text-[16px] font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:-translate-y-[1px] hover:bg-[#339CFF] hover:shadow-xl hover:shadow-blue-500/40"
          >

            <Link to="/services/create">

              <Plus className="mr-2 h-5 w-5" />

              Nuevo servicio

            </Link>

          </Button>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {[
            {
              label: 'Mis servicios',
              value: services.length,
              icon: Briefcase,
              color: 'from-blue-500 to-cyan-400'
            },
            {
              label: 'Revisión pendiente',
              value: pendingServices,
              icon: AlertCircle,
              color: 'from-yellow-500 to-orange-400'
            },
            {
              label: 'Solicitudes enviadas',
              value: sent.length,
              icon: Send,
              color: 'from-violet-500 to-fuchsia-400'
            },
            {
              label: 'Solicitudes activas',
              value: activeRequests,
              icon: Inbox,
              color: 'from-emerald-500 to-green-400'
            },
          ].map(({ label, value, icon: Icon, color }) => (

            <Card
              key={label}
              className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >

              <CardContent className="relative p-6">

                {/* Glow */}
                <div className="absolute right-[-20px] top-[-20px] h-24 w-24 rounded-full bg-slate-100 blur-2xl opacity-60" />

                <div className="relative flex items-center gap-5">

                  {/* Icon */}
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${color} shadow-lg`}>

                    <Icon className="h-6 w-6 text-white" />

                  </div>

                  {/* Texto */}
                  <div>

                    <p className="text-3xl font-black text-slate-900">

                      {loading ? '—' : value}

                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-500">
                      {label}
                    </p>

                  </div>

                </div>

              </CardContent>

            </Card>

          ))}

        </div>

        {/* Servicios */}
        <div className="space-y-5">

          {/* Header sección */}
          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-3xl font-bold text-slate-900">
                Mis servicios
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Administra y revisa tus servicios publicados.
              </p>

            </div>

          </div>

          {/* Loading */}
          {loading ? (

            <div className="space-y-3">

              {[...Array(3)].map((_, i) => (

                <Skeleton
                  key={i}
                  className="h-24 w-full rounded-3xl"
                />

              ))}

            </div>

          ) : services.length === 0 ? (

            /* Empty state */
            <Card className="rounded-3xl border border-slate-200 bg-white shadow-xl">

              <CardContent className="flex flex-col items-center gap-5 py-16 text-center">

                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50">

                  <Briefcase className="h-10 w-10 text-[#0A84FF]" />

                </div>

                <div>

                  <h3 className="text-xl font-bold text-slate-900">
                    Aún no tienes servicios
                  </h3>

                  <p className="mt-2 text-slate-500">
                    Comienza publicando tu primer servicio profesional.
                  </p>

                </div>

                <Button
                  asChild
                  className="h-12 rounded-2xl bg-[#0A84FF] px-6 font-semibold text-white hover:bg-[#339CFF]"
                >

                  <Link to="/services/create">

                    Ofrece tu primer servicio

                  </Link>

                </Button>

              </CardContent>

            </Card>

          ) : (

            /* Lista servicios */
            <div className="space-y-4">

              {services.map((s) => (

                <Card
                  key={s.id}
                  className="rounded-3xl border border-slate-200/80 bg-white shadow-lg shadow-slate-200/40 transition-all duration-300 hover:shadow-2xl"
                >

                  <CardContent className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">

                    {/* Info */}
                    <div className="min-w-0 flex-1">

                      <h3 className="truncate text-xl font-bold text-slate-900">

                        {s.title}

                      </h3>

                      <p className="mt-1 text-sm font-medium uppercase tracking-wide text-slate-500">

                        {s.category.replace('_', ' ')}

                      </p>

                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3">

                      <Badge
                        className={`rounded-full px-4 py-1 text-xs font-semibold ${STATUS_COLORS[s.status] || ''}`}
                      >

                        {s.status}

                      </Badge>

                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="rounded-xl border-slate-200 hover:bg-slate-50"
                      >

                        <Link to={`/services/${s.id}`}>

                          Ver detalles

                        </Link>

                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="rounded-xl border-slate-200 hover:bg-slate-50"
                      >

                        <Link to={`/services/${s.id}/edit`}>

                          Editar

                        </Link>

                      </Button>

                    </div>

                  </CardContent>

                </Card>

              ))}

            </div>

          )}

        </div>

        {/* Solicitudes */}
        {received.length > 0 && (

          <div className="space-y-5">

            {/* Header */}
            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-3xl font-bold text-slate-900">
                  Solicitudes entrantes
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Revisa las últimas solicitudes recibidas.
                </p>

              </div>

              <Button
                variant="ghost"
                size="sm"
                asChild
                className="rounded-xl hover:bg-slate-100"
              >

                <Link to="/requests">

                  Ver todo →

                </Link>

              </Button>

            </div>

            {/* Lista */}
            <div className="space-y-4">

              {received.slice(0, 3).map((r) => (

                <Card
                  key={r.id}
                  className="rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40"
                >

                  <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-lg font-bold text-slate-900">

                        {r.serviceTitle}

                      </p>

                      <p className="mt-1 text-sm text-slate-500">

                        De: {r.clientName}

                      </p>

                    </div>

                    <Badge
                      className={`rounded-full px-4 py-1 text-xs font-semibold ${STATUS_COLORS[r.status] || ''}`}
                    >

                      {r.status.replace('_', ' ')}

                    </Badge>

                  </CardContent>

                </Card>

              ))}

            </div>

          </div>

        )}

      </div>

    </div>
  );
}