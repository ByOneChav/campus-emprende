import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getBadReviewsThunk } from '@/store/admin/adminThunk';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ThumbsDown, Star } from 'lucide-react';

function StarDisplay({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-3.5 w-3.5 ${n <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
        />
      ))}
    </div>
  );
}

export default function AdminBadReviewsPage() {
  const dispatch = useDispatch();
  const { badReviews, loading } = useSelector((s) => s.admin);

  useEffect(() => { dispatch(getBadReviewsThunk()); }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Malas críticas</h1>
        <Badge className="bg-red-100 text-red-700">1–2 estrellas</Badge>
        {!loading && <Badge variant="secondary">{badReviews.length}</Badge>}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
      ) : badReviews.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <ThumbsDown className="h-10 w-10 mx-auto mb-3" />
          <p>No se encontraron reseñas negativas.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {badReviews.map((r) => (
            <Card key={r.id}>
              <CardContent className="py-3 space-y-1.5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <Link to={`/services/${r.serviceId}`} className="font-medium text-sm hover:underline">
                      {r.serviceTitle}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      by{' '}
                      <Link to={`/profiles/${r.reviewerId}`} className="hover:underline">{r.reviewerName}</Link>
                    </p>
                  </div>
                  <StarDisplay rating={r.rating} />
                </div>
                {r.comment && <p className="text-sm text-muted-foreground line-clamp-2">{r.comment}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
