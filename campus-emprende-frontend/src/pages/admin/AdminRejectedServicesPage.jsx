import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getRejectedServicesThunk } from '@/store/admin/adminThunk';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { XCircle } from 'lucide-react';

const CATEGORY_LABELS = {
  WEB_DEV: 'Web Dev', GRAPHIC_DESIGN: 'Design',
  TECH_SUPPORT: 'Tech Support', TUTORING: 'Tutoring',
  PHOTOGRAPHY: 'Photography', OTHER: 'Other',
};

export default function AdminRejectedServicesPage() {
  const dispatch = useDispatch();
  const { rejectedServices, loading } = useSelector((s) => s.admin);

  useEffect(() => { dispatch(getRejectedServicesThunk()); }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Rejected Services</h1>
        {!loading && <Badge variant="secondary">{rejectedServices.length}</Badge>}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
      ) : rejectedServices.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <XCircle className="h-10 w-10 mx-auto mb-3" />
          <p>No rejected services.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {rejectedServices.map((s) => (
            <Card key={s.id}>
              <CardContent className="py-3 flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <Link to={`/services/${s.id}`} className="font-medium text-sm hover:underline">
                    {s.title}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {CATEGORY_LABELS[s.category]} ·{' '}
                    <Link to={`/profiles/${s.providerId}`} className="hover:underline">{s.providerName}</Link>
                  </p>
                  {s.rejectionReason && (
                    <p className="text-xs text-red-600 mt-1">Reason: {s.rejectionReason}</p>
                  )}
                </div>
                <Badge className="bg-red-100 text-red-700">REJECTED</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
