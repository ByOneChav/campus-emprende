import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllReviewsThunk } from '@/store/admin/adminThunk';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

import {
  MessageSquare,
  Star,
  Sparkles,
  Quote,
} from 'lucide-react';

function StarDisplay({ rating }) {
  return (
    <div className="flex items-center gap-1">

      {[1, 2, 3, 4, 5].map((n) => (
        <div
          key={n}
          className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 ${
            n <= rating
              ? 'bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg shadow-yellow-200'
              : 'bg-slate-100'
          }`}
        >
          <Star
            className={`h-5 w-5 ${
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

export default function AdminReviewsPage() {
  const dispatch = useDispatch();

  const { allReviews, loading } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(getAllReviewsThunk());
  }, [dispatch]);

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

        {/* Decoración */}
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-yellow-100 blur-3xl opacity-70"></div>
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blue-100 blur-3xl opacity-70"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-50 px-4 py-1.5 text-sm font-medium text-yellow-700 border border-yellow-100 mb-4">
              <Sparkles className="h-4 w-4" />
              Gestión de reseñas
            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Todas las reseñas
            </h1>

            <p className="text-slate-500 mt-2 text-sm">
              Visualiza y administra las opiniones de los usuarios sobre los servicios.
            </p>
          </div>

          {!loading && (
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 shadow-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-lg shadow-yellow-200">
                <MessageSquare className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Total reseñas
                </p>

                <h2 className="text-2xl font-black text-slate-900">
                  {allReviews.length}
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
              className="h-32 w-full rounded-3xl"
            />
          ))}
        </div>
      ) : allReviews.length === 0 ? (

        /* EMPTY */
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center shadow-sm">

          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <MessageSquare className="h-10 w-10 text-slate-400" />
          </div>

          <h3 className="text-xl font-bold text-slate-800">
            Aún no hay reseñas
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Las opiniones de los usuarios aparecerán aquí.
          </p>
        </div>

      ) : (

        /* REVIEWS */
        <div className="grid gap-5">

          {allReviews.map((r, index) => (
            <Card
              key={r.id}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-yellow-100/50"
            >
              <CardContent className="p-0">

                <div className="p-6">

                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

                    {/* LEFT */}
                    <div className="flex gap-4 flex-1">

                      {/* Icon */}
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-lg shadow-yellow-200">
                        <Quote className="h-6 w-6" />
                      </div>

                      {/* CONTENT */}
                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-3">

                          <Link
                            to={`/services/${r.serviceId}`}
                            className="text-lg font-bold text-slate-900 transition-colors hover:text-blue-600"
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
                            className="font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                          >
                            {r.reviewerName}
                          </Link>
                        </div>

                        {r.comment && (
                          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">

                            <p className="text-[15px] leading-7 text-slate-600">
                              {r.comment}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-col items-start lg:items-end gap-3">

                      <Badge className="rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-100 px-4 py-1.5 border border-yellow-200">
                        {r.rating}/5 estrellas
                      </Badge>

                      <StarDisplay rating={r.rating} />
                    </div>
                  </div>
                </div>

                {/* LINEA HOVER */}
                <div className="h-1 w-full bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}