import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllUsersThunk } from '@/store/admin/adminThunk';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, ShieldCheck, GraduationCap, CalendarDays } from 'lucide-react';

const ROLE_COLORS = {
  ADMIN:
    'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 shadow-md shadow-emerald-200',

  STUDENT:
    'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0 shadow-md shadow-orange-200',
};

export default function AdminUsersPage() {
  const dispatch = useDispatch();
  const { allUsers, loading } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(getAllUsersThunk());
  }, [dispatch]);

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

        {/* Background decor */}
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-blue-100 blur-3xl opacity-70"></div>
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-purple-100 blur-3xl opacity-70"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 border border-blue-100 mb-4">
              <Users className="h-4 w-4" />
              Gestión de usuarios
            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Todos los usuarios
            </h1>

            <p className="text-slate-500 mt-2 text-sm">
              Administra y visualiza todos los usuarios registrados en la plataforma.
            </p>
          </div>

          {!loading && (
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg">
                <Users className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Total usuarios
                </p>
                <h2 className="text-2xl font-black text-slate-900">
                  {allUsers.length}
                </h2>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="grid gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-24 w-full rounded-3xl"
            />
          ))}
        </div>
      ) : allUsers.length === 0 ? (

        /* EMPTY STATE */
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <Users className="h-10 w-10 text-slate-400" />
          </div>

          <h3 className="text-xl font-bold text-slate-800">
            No se encontraron usuarios
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Aún no existen usuarios registrados en la plataforma.
          </p>
        </div>

      ) : (

        /* USERS LIST */
        <div className="grid gap-5">
          {allUsers.map((u, index) => (
            <Card
              key={u.id}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100/50"
            >
              <CardContent className="p-0">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 p-6">

                  {/* LEFT */}
                  <div className="flex items-center gap-4 min-w-0 flex-1">

                    {/* Avatar */}
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white shadow-lg">
                      {u.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>

                    {/* User Info */}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">

                        <Link
                          to={`/profiles/${u.id}`}
                          className="text-lg font-bold text-slate-900 transition-colors hover:text-blue-600"
                        >
                          {u.fullName}
                        </Link>

                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                          #{index + 1}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-slate-500 break-all">
                        {u.email}
                      </p>

                      {u.createdAt && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                          <CalendarDays className="h-4 w-4" />
                          Registrado el{' '}
                          {new Date(u.createdAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center gap-3">

                    {/* Role icon */}
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100">
                      {u.role === 'ADMIN' ? (
                        <ShieldCheck className="h-5 w-5 text-purple-600" />
                      ) : (
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                      )}
                    </div>

                    {/* Badge */}
                    <Badge
                      className={`px-4 py-2 text-xs font-bold tracking-wide uppercase rounded-full ${
                        ROLE_COLORS[u.role] ||
                        'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {u.role}
                    </Badge>
                  </div>
                </div>

                {/* Bottom line */}
                <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}