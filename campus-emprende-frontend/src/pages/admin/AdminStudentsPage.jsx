import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { getStudentsThunk } from '@/store/admin/adminThunk';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

import {
  GraduationCap,
  Users,
  Sparkles,
  CalendarDays,
  ArrowUpRight
} from 'lucide-react';

export default function AdminStudentsPage() {

  const dispatch = useDispatch();

  const { students, loading } = useSelector((s) => s.admin);

  useEffect(() => {

    dispatch(getStudentsThunk());

  }, [dispatch]);

  return (

    <div className="space-y-8">

      {/* =========================
          HEADER
      ========================== */}

      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">

        {/* Glow decorativo */}
        <div className="absolute -top-20 right-[-60px] h-56 w-56 rounded-full bg-blue-100 blur-3xl opacity-70" />

        {/* Barra superior */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#0A84FF] via-[#5AA9FF] to-[#B7D8FF]" />

        <div className="relative flex flex-col gap-6 px-7 py-7 lg:flex-row lg:items-center lg:justify-between">

          {/* Left */}
          <div className="space-y-4">

            {/* Badge top */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-[#0A84FF] shadow-sm">

              <Sparkles className="h-4 w-4" />

              Gestión de estudiantes

            </div>

            {/* Título */}
            <div className="flex items-center gap-4">

              {/* Icon */}
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0A84FF] to-[#5AA9FF] shadow-lg shadow-blue-500/30">

                <GraduationCap className="h-8 w-8 text-white" />

              </div>

              {/* Text */}
              <div>

                <h1 className="text-4xl font-black tracking-tight text-slate-900">
                  Estudiantes
                </h1>

                <p className="mt-1 text-[16px] text-slate-500">
                  Administra y visualiza los estudiantes registrados.
                </p>

              </div>

            </div>

          </div>

          {/* Right Stats */}
          {!loading && (

            <div className="flex items-center gap-4">

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 shadow-sm">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">

                    <Users className="h-6 w-6 text-[#0A84FF]" />

                  </div>

                  <div>

                    <p className="text-3xl font-black text-slate-900">
                      {students.length}
                    </p>

                    <p className="text-sm text-slate-500">
                      Estudiantes registrados
                    </p>

                  </div>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>

      {/* =========================
          LOADING
      ========================== */}

      {loading ? (

        <div className="space-y-4">

          {[...Array(6)].map((_, i) => (

            <Skeleton
              key={i}
              className="h-28 w-full rounded-3xl"
            />

          ))}

        </div>

      ) : students.length === 0 ? (

        /* =========================
            EMPTY STATE
        ========================== */

        <Card className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">

          <CardContent className="flex flex-col items-center justify-center py-20 text-center">

            {/* Icon */}
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-50">

              <GraduationCap className="h-12 w-12 text-[#0A84FF]" />

            </div>

            {/* Texto */}
            <h2 className="text-2xl font-bold text-slate-900">
              No se encontraron estudiantes
            </h2>

            <p className="mt-3 max-w-md text-slate-500">
              Aún no existen estudiantes registrados en la plataforma.
            </p>

          </CardContent>

        </Card>

      ) : (

        /* =========================
            LISTA ESTUDIANTES
        ========================== */

        <div className="grid gap-5">

          {students.map((u) => (

            <Card
              key={u.id}
              className="
                group
                overflow-hidden
                rounded-3xl
                border
                border-slate-200/80
                bg-white
                shadow-lg
                shadow-slate-200/40
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-2xl
              "
            >

              <CardContent className="relative p-6">

                {/* Glow hover */}
                <div className="absolute right-[-20px] top-[-20px] h-28 w-28 rounded-full bg-blue-100 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-70" />

                <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                  {/* =========================
                      LEFT INFO
                  ========================== */}

                  <div className="flex items-center gap-5 min-w-0">

                    {/* Avatar */}
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0A84FF] to-[#5AA9FF] text-xl font-bold text-white shadow-lg shadow-blue-500/30">

                      {u.fullName?.charAt(0)?.toUpperCase() || 'U'}

                    </div>

                    {/* Datos */}
                    <div className="min-w-0">

                      {/* Nombre */}
                      <Link
                        to={`/profiles/${u.id}`}
                        className="
                          flex
                          items-center
                          gap-2
                          truncate
                          text-xl
                          font-bold
                          text-slate-900
                          transition-colors
                          hover:text-[#0A84FF]
                        "
                      >

                        <span className="truncate">
                          {u.fullName}
                        </span>

                        <ArrowUpRight className="h-4 w-4 opacity-0 transition-all duration-300 group-hover:opacity-100" />

                      </Link>

                      {/* Email */}
                      <p className="mt-1 truncate text-sm text-slate-500">
                        {u.email}
                      </p>

                    </div>

                  </div>

                  {/* =========================
                      RIGHT SIDE
                  ========================== */}

                  <div className="flex flex-wrap items-center gap-3">

                    {/* Fecha */}
                    {u.createdAt && (

                      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">

                        <CalendarDays className="h-4 w-4 text-slate-500" />

                        {new Date(u.createdAt).toLocaleDateString()}

                      </div>

                    )}

                    {/* Badge */}
                    <Badge className="rounded-full border border-blue-200 bg-blue-100 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-700">

                      ESTUDIANTE

                    </Badge>

                  </div>

                </div>

              </CardContent>

            </Card>

          ))}

        </div>

      )}

    </div>
  );
}