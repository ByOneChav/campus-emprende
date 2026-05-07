import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicProfile } from '@/api/profile';
import { getProviderReviews } from '@/api/reviews';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, ExternalLink, Briefcase, Mail } from 'lucide-react';

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`h-4 w-4 ${n <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
      ))}
    </div>
  );
}

export default function PublicProfilePage() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getPublicProfile(userId), getProviderReviews(userId)])
      .then(([{ data: p }, { data: r }]) => {
        setProfile(p);
        setReviews(r);
      })
      .catch(() => setError('Perfil no encontrado.'))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
      <Skeleton className="h-24 w-24 rounded-full" />
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-32 w-full" />
    </div>
  );

  if (error) return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center text-muted-foreground">{error}</div>
  );

  const initials = profile?.fullName?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (

  <div className="min-h-screen bg-[#f5f7fb] px-4 py-10">

    {/* Glow decorativo */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none">

      <div className="absolute top-[-120px] left-[-120px] h-[320px] w-[320px] rounded-full bg-blue-100 blur-3xl opacity-60" />

      <div className="absolute bottom-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-slate-200 blur-3xl opacity-60" />

    </div>

    <div className="relative max-w-5xl mx-auto space-y-8">

      {/* Header */}
      <div className="space-y-2">

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold">

          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>

          Perfil profesional

        </div>

        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          Perfil público
        </h1>

        <p className="text-slate-500">
          Conoce más sobre este profesional dentro de Campus Emprende.
        </p>

      </div>

      {/* Card principal */}
      <Card className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-2xl shadow-slate-300/20">

        {/* Barra superior */}
        <div className="h-2 w-full bg-gradient-to-r from-[#0A0F5C] via-[#2563EB] to-[#93C5FD]" />

        <CardContent className="p-0">

          {/* Hero */}
          <div className="relative px-8 pt-10 pb-8">

            {/* Glow interno */}
            <div className="absolute top-[-80px] right-[-80px] h-60 w-60 rounded-full bg-blue-100 blur-3xl opacity-50" />

            <div className="relative flex flex-col lg:flex-row lg:items-start gap-8">

              {/* Avatar */}
              <div className="shrink-0">

                <Avatar className="h-36 w-36 border-[6px] border-white shadow-2xl shadow-blue-200/40">

                  {profile?.avatarUrl ? (

                    <img
                      src={profile.avatarUrl}
                      alt="avatar"
                      className="h-full w-full object-cover rounded-full"
                    />

                  ) : (

                    <AvatarFallback className="text-5xl font-black bg-gradient-to-br from-[#0A0F5C] to-[#2563EB] text-white">

                      {initials}

                    </AvatarFallback>

                  )}

                </Avatar>

              </div>

              {/* Información */}
              <div className="flex-1 min-w-0 space-y-5">

                <div>

                  <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight">

                    {profile?.fullName}

                  </h1>

                  <div className="flex flex-wrap items-center gap-3 mt-4">

                    {profile?.career && (

                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 text-slate-700 text-sm font-medium">

                        <Briefcase className="h-4 w-4" />

                        {profile.career}

                      </div>

                    )}

                    {avgRating && (

                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-yellow-50 border border-yellow-100 text-yellow-700 text-sm font-semibold">

                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />

                        {avgRating} / 5

                      </div>

                    )}

                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-1.5 rounded-xl text-xs font-semibold">
                      Campus Emprende
                    </Badge>

                  </div>

                </div>

                {/* Contacto */}
                <div className="space-y-3">

                  <div className="flex items-center gap-3 text-slate-600">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">

                      <Mail className="h-4 w-4" />

                    </div>

                    <span className="text-[15px]">
                      {profile?.email}
                    </span>

                  </div>

                  {profile?.linkedinUrl && (

                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-3 text-[#0A66C2] font-semibold hover:underline transition-all"
                    >

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">

                        <ExternalLink className="h-4 w-4" />

                      </div>

                      Ver perfil de LinkedIn

                    </a>

                  )}

                </div>

              </div>

            </div>

          </div>

          <Separator />

          {/* Biografía */}
          <div className="px-8 py-8">

            <div className="flex items-center gap-3 mb-5">

              <div className="h-10 w-1 rounded-full bg-blue-500" />

              <div>

                <h2 className="text-2xl font-black text-slate-900">
                  Acerca de
                </h2>

                <p className="text-sm text-slate-500">
                  Información profesional del usuario
                </p>

              </div>

            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6">

              <p className="text-[15px] leading-8 text-slate-700 whitespace-pre-line">

                {profile?.bio || 'Este usuario aún no ha agregado una biografía profesional.'}

              </p>

            </div>

          </div>

        </CardContent>

      </Card>

      {/* Reviews */}
      {reviews.length > 0 && (

        <div className="space-y-5">

          <div>

            <h2 className="text-3xl font-black text-slate-900">
              Reseñas
            </h2>

            <p className="text-slate-500 mt-1">
              Opiniones y experiencias de otros estudiantes.
            </p>

          </div>

          <div className="grid gap-5">

            {reviews.map((r) => (

              <Card
                key={r.id}
                className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-lg shadow-slate-200/40 hover:shadow-2xl transition-all duration-300"
              >

                <CardContent className="p-6 space-y-4">

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <h3 className="font-bold text-slate-900">
                        {r.authorName}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        {r.comment}
                      </p>

                    </div>

                    <div className="shrink-0">

                      <StarRating rating={r.rating} />

                    </div>

                  </div>

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
