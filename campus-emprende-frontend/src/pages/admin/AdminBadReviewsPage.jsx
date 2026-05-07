import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getBadReviewsThunk } from '@/store/admin/adminThunk';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

import {
  ThumbsDown,
  Star,
  AlertTriangle,
  Quote,
  ShieldAlert,
} from 'lucide-react';

function StarDisplay({ rating }) {
  return (
    <div className="flex items-center gap-1.5">

      {[1, 2, 3, 4, 5].map((n) => (
        <div
          key={n}
          className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-300 ${
            n <= rating
              ? 'bg-gradient-to-br from-red-500 via-rose-500 to-orange-500 shadow-lg shadow-red-200'
              : 'bg-slate-100'
          }`}
        >
          <Star
            className={`h-5.5 w-5.5 ${
              n <= rating
                ? 'fill-white text-white'
                : 'text-slate-300'
            }`}
          />
        </div>
      ))}
    </div>
  );
}

export default function AdminBadReviewsPage() {
  const dispatch = useDispatch();

  const { badReviews, loading } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(getBadReviewsThunk());
  }, [dispatch]);

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

        {/* DECORACION */}
        <div className="absolute -top-12 -right-10 h-44 w-44 rounded-full bg-red-100 blur-3xl opacity-70"></div>

        <div className="absolute -bottom-12 -left-10 h-44 w-44 rounded-full bg-orange-100 blur-3xl opacity-70"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          {/* TITULOS */}
          <div>

            <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-1.5 text-sm font-medium text-red-700 mb-4">
              <AlertTriangle className="h-4 w-4" />
              Reseñas negativas
            </div>

            <div className="flex flex-wrap items-center gap-3">

              <h1 className="text-3xl font-black tracking-tight text-slate-900">
                Malas críticas
              </h1>

              <Badge className="rounded-full border border-red-200 bg-red-100 px-4 py-1.5 text-red-700 hover:bg-red-100">
                1–2 estrellas
              </Badge>
            </div>

            <p className="mt-3 text-sm text-slate-500">
              Opiniones negativas y valoraciones bajas reportadas por los usuarios.
            </p>
          </div>

          {/* TOTAL */}
          {!loading && (
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 shadow-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 text-white shadow-lg shadow-red-200">
                <ShieldAlert className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Malas críticas
                </p>

                <h2 className="text-2xl font-black text-slate-900">
                  {badReviews.length}
                </h2>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-36 w-full rounded-3xl"
            />
          ))}
        </div>
      ) : badReviews.length === 0 ? (

        /* EMPTY */
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center shadow-sm">

          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <ThumbsDown className="h-10 w-10 text-slate-400" />
          </div>

          <h3 className="text-xl font-bold text-slate-800">
            No se encontraron reseñas negativas
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Las críticas negativas aparecerán aquí automáticamente.
          </p>
        </div>

      ) : (

        /* LISTA */
        <div className="grid gap-5">

          {badReviews.map((r, index) => (
            <Card
              key={r.id}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-100/50"
            >
              <CardContent className="p-0">

                <div className="p-6">

                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

                    {/* LEFT */}
                    <div className="flex gap-4 flex-1">

                      {/* ICON */}
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 text-white shadow-lg shadow-red-200">
                        <Quote className="h-6 w-6" />
                      </div>

                      {/* CONTENT */}
                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-3">

                          <Link
                            to={`/services/${r.serviceId}`}
                            className="text-lg font-bold text-slate-900 transition-colors hover:text-red-600"
                          >
                            {r.serviceTitle}
                          </Link>

                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                            #{index + 1}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">

                          <span>por</span>

                          <Link
                            to={`/profiles/${r.reviewerId}`}
                            className="font-semibold text-slate-700 transition-colors hover:text-red-600"
                          >
                            {r.reviewerName}
                          </Link>
                        </div>

                        {r.comment && (
                          <div className="mt-5 rounded-2xl border border-red-100 bg-red-50/60 p-5">

                            <p className="text-[15px] leading-7 text-slate-700">
                              {r.comment}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-col items-start lg:items-end gap-4">

                      <Badge className="rounded-full border border-red-200 bg-red-100 px-4 py-1.5 text-red-700 hover:bg-red-100">
                        Valoración baja
                      </Badge>

                      <StarDisplay rating={r.rating} />
                    </div>
                  </div>
                </div>

                {/* LINEA */}
                <div className="h-1 w-full bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}