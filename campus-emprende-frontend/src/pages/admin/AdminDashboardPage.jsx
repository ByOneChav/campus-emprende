import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import {
  getDashboardThunk,
  getTopStudentsThunk,
} from '@/store/admin/adminThunk';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Send,
  Flag,
  ShieldCheck,
  Star,
  Sparkles,
  Trophy,
  ArrowRight,
} from 'lucide-react';

function RatingStars({ value }) {
  const rounded = Math.round(value * 10) / 10;

  return (
    <div className="flex items-center justify-center gap-2">

      <div className="flex items-center gap-1">

        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            className={`flex h-7 w-7 items-center justify-center rounded-xl ${
              n <= Math.round(value)
                ? 'bg-gradient-to-br from-yellow-400 to-amber-500 shadow-md shadow-yellow-200'
                : 'bg-slate-100'
            }`}
          >
            <Star
              className={`h-3.5 w-3.5 ${
                n <= Math.round(value)
                  ? 'fill-white text-white'
                  : 'text-slate-300'
              }`}
            />
          </div>
        ))}
      </div>

      <span className="text-sm font-bold text-slate-700">
        {rounded > 0 ? rounded.toFixed(1) : '—'}
      </span>
    </div>
  );
}

export default function AdminDashboardPage() {
  const dispatch = useDispatch();

  const {
    dashboard,
    topStudents,
    loading,
  } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(getDashboardThunk());
    dispatch(getTopStudentsThunk());
  }, [dispatch]);

  const stats = dashboard
    ? [
        {
          label: 'Total de usuarios',
          value: dashboard.totalUsers,
          icon: Users,
          gradient:
            'from-blue-500 to-cyan-500',
          shadow:
            'shadow-blue-200',
        },

        {
          label: 'Servicios aprobados',
          value: dashboard.approvedServices,
          icon: CheckCircle,
          gradient:
            'from-green-500 to-emerald-500',
          shadow:
            'shadow-green-200',
        },

        {
          label: 'Revisión pendiente',
          value: dashboard.pendingServices,
          icon: Clock,
          gradient:
            'from-yellow-400 to-orange-500',
          shadow:
            'shadow-yellow-200',
        },

        {
          label: 'Rechazados',
          value: dashboard.rejectedServices,
          icon: XCircle,
          gradient:
            'from-red-500 to-rose-500',
          shadow:
            'shadow-red-200',
        },

        {
          label: 'Solicitudes totales',
          value: dashboard.totalRequests,
          icon: Send,
          gradient:
            'from-indigo-500 to-violet-500',
          shadow:
            'shadow-indigo-200',
        },

        {
          label: 'Informes pendientes',
          value: dashboard.pendingReports,
          icon: Flag,
          gradient:
            'from-orange-500 to-amber-500',
          shadow:
            'shadow-orange-200',
        },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

      {/* HERO */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

        {/* EFECTOS */}
        <div className="absolute -top-10 -right-10 h-44 w-44 rounded-full bg-blue-100 blur-3xl opacity-70"></div>

        <div className="absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-indigo-100 blur-3xl opacity-70"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 mb-4">
              <Sparkles className="h-4 w-4" />
              Administración avanzada
            </div>

            <div className="flex items-center gap-3">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200">
                <ShieldCheck className="h-7 w-7" />
              </div>

              <div>
                <h1 className="text-4xl font-black tracking-tight text-slate-900">
                  Panel de administración
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  Supervisa usuarios, servicios, solicitudes y reportes del sistema.
                </p>
              </div>
            </div>
          </div>

          {/* QUICK STATUS */}
          <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 shadow-sm">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-200">
              <Trophy className="h-6 w-6" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
                Estado del sistema
              </p>

              <p className="text-lg font-black text-slate-900">
                Operativo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

        {loading
          ? [...Array(6)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-36 rounded-3xl"
              />
            ))
          : stats.map(
              ({
                label,
                value,
                icon: Icon,
                gradient,
                shadow,
              }) => (
                <Card
                  key={label}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <CardContent className="relative p-6">

                    {/* DECORACION */}
                    <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-slate-100 blur-3xl opacity-40"></div>

                    <div className="relative z-10 flex items-center justify-between">

                      <div className="space-y-3">

                        <div
                          className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg ${shadow}`}
                        >
                          <Icon className="h-8 w-8" />
                        </div>

                        <div>
                          <p className="text-3xl font-black text-slate-900">
                            {value}
                          </p>

                          <p className="text-sm font-medium text-slate-500">
                            {label}
                          </p>
                        </div>
                      </div>

                      <ArrowRight className="h-6 w-6 text-slate-300 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              )
            )}
      </div>

      {/* TOP STUDENTS */}
      <Card className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">

        <CardHeader className="border-b bg-gradient-to-r from-yellow-50 via-white to-white">

          <CardTitle className="flex items-center gap-3 text-xl font-black text-slate-900">

            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-md shadow-yellow-200">
              <Star className="h-5 w-5 fill-white" />
            </div>

            Los 5 mejores estudiantes
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">

          {loading ? (
            <div className="space-y-3 p-6">
              {[...Array(5)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-14 w-full rounded-2xl"
                />
              ))}
            </div>
          ) : topStudents.length === 0 ? (

            <div className="py-20 text-center">

              <Trophy className="mx-auto mb-4 h-12 w-12 text-slate-300" />

              <p className="text-sm text-slate-500">
                Aún no hay datos de los estudiantes.
              </p>
            </div>

          ) : (
            <div className="overflow-x-auto">

              <Table>

                <TableHeader>

                  <TableRow className="bg-slate-50 hover:bg-slate-50">

                    <TableHead className="w-16 text-center font-bold">
                      #
                    </TableHead>

                    <TableHead className="font-bold">
                      Estudiantes
                    </TableHead>

                    <TableHead className="text-center font-bold">
                      Servicios
                    </TableHead>

                    <TableHead className="text-center font-bold">
                      Solicitudes
                    </TableHead>

                    <TableHead className="text-center font-bold">
                      Completado
                    </TableHead>

                    <TableHead className="text-center font-bold">
                      Calificación promedio
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>

                  {topStudents.map((s, idx) => (
                    <TableRow
                      key={s.studentId}
                      className="hover:bg-blue-50/40"
                    >

                      <TableCell className="text-center">

                        <div
                          className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ${
                            idx === 0
                              ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-md shadow-yellow-200'
                              : idx === 1
                              ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white'
                              : idx === 2
                              ? 'bg-gradient-to-br from-orange-300 to-orange-400 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {idx + 1}
                        </div>
                      </TableCell>

                      <TableCell>

                        <div>
                          <p className="font-bold text-slate-900">
                            {s.studentName}
                          </p>

                          <p className="text-xs text-slate-500">
                            {s.studentEmail}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell className="text-center font-bold text-slate-700">
                        {s.totalServices}
                      </TableCell>

                      <TableCell className="text-center font-bold text-slate-700">
                        {s.totalRequests}
                      </TableCell>

                      <TableCell className="text-center">

                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                          {s.completedRequests}
                        </span>
                      </TableCell>

                      <TableCell className="text-center">
                        <RatingStars value={s.averageRating} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* QUICK LINKS */}
      <div className="grid md:grid-cols-2 gap-5">

        {/* MODERACION */}
        <Card className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100">

          <CardHeader>

            <CardTitle className="flex items-center gap-3 text-lg font-black text-slate-900">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-200">
                <ShieldCheck className="h-5 w-5" />
              </div>

              Moderación del servicio
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">

            <p className="text-sm leading-7 text-slate-500">
              Revisa, aprueba o rechaza publicaciones de servicios estudiantiles.
            </p>

            <Button
              asChild
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 shadow-lg shadow-blue-200 hover:from-blue-700 hover:to-blue-600"
            >
              <Link to="/admin/services">
                Servicios de gestión
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* REPORTES */}
        <Card className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-100">

          <CardHeader>

            <CardTitle className="flex items-center gap-3 text-lg font-black text-slate-900">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-200">
                <Flag className="h-5 w-5" />
              </div>

              Informes de contenido
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">

            <p className="text-sm leading-7 text-slate-500">
              Gestiona reportes enviados por estudiantes sobre usuarios, servicios y reseñas.
            </p>

            <Button
              asChild
              className="rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 shadow-lg shadow-orange-200 hover:from-orange-600 hover:to-amber-600"
            >
              <Link to="/admin/reports">
                Administrar informes
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}