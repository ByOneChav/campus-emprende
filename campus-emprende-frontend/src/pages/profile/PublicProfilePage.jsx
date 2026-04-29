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
      .catch(() => setError('Profile not found.'))
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
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <Avatar className="h-20 w-20">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt="avatar" className="h-20 w-20 object-cover rounded-full" />
              ) : (
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">{initials}</AvatarFallback>
              )}
            </Avatar>
            <div className="space-y-1 flex-1">
              <h1 className="text-2xl font-bold">{profile?.fullName}</h1>
              {profile?.career && (
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <Briefcase className="h-4 w-4" /> {profile.career}
                </div>
              )}
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <Mail className="h-4 w-4" /> {profile?.email}
              </div>
              {avgRating && (
                <div className="flex items-center gap-2 pt-1">
                  <StarRating rating={Math.round(parseFloat(avgRating))} />
                  <span className="text-sm font-medium">{avgRating}</span>
                  <span className="text-xs text-muted-foreground">({reviews.length} reviews)</span>
                </div>
              )}
              {profile?.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline pt-1"
                >
                  <ExternalLink className="h-4 w-4" /> LinkedIn
                </a>
              )}
            </div>
          </div>

          {profile?.bio && (
            <>
              <Separator className="my-5" />
              <div>
                <h2 className="font-semibold mb-2">About</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{profile.bio}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {reviews.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Reviews received</h2>
          <div className="space-y-3">
            {reviews.map((r) => (
              <Card key={r.id}>
                <CardContent className="pt-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{r.reviewerName}</span>
                    <StarRating rating={r.rating} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    For: <Link to={`/services/${r.serviceId}`} className="hover:underline">{r.serviceTitle}</Link>
                  </p>
                  {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
