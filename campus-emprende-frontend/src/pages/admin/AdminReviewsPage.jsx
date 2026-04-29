import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllReviewsThunk } from '@/store/admin/adminThunk';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, Star } from 'lucide-react';

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

export default function AdminReviewsPage() {
  const dispatch = useDispatch();
  const { allReviews, loading } = useSelector((s) => s.admin);

  useEffect(() => { dispatch(getAllReviewsThunk()); }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">All Reviews</h1>
        {!loading && <Badge variant="secondary">{allReviews.length}</Badge>}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
      ) : allReviews.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <MessageSquare className="h-10 w-10 mx-auto mb-3" />
          <p>No reviews yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {allReviews.map((r) => (
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
