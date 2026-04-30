import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getActiveServicesThunk } from '@/store/admin/adminThunk';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle } from 'lucide-react';

const CATEGORY_LABELS = {
  WEB_DEV: 'Web Dev', GRAPHIC_DESIGN: 'Design',
  TECH_SUPPORT: 'Soporte técnico', TUTORING: 'Tutoría',
  PHOTOGRAPHY: 'Fotografía', OTHER: 'Otro',
};

export default function AdminActiveServicesPage() {
  const dispatch = useDispatch();
  const { activeServices, loading } = useSelector((s) => s.admin);

  useEffect(() => { dispatch(getActiveServicesThunk()); }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Servicios activos</h1>
        {!loading && <Badge variant="secondary">{activeServices.length}</Badge>}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : activeServices.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <CheckCircle className="h-10 w-10 mx-auto mb-3" />
          <p>No se encontraron servicios activos.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {activeServices.map((s) => (
            <Card key={s.id}>
              <CardContent className="py-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <Link to={`/services/${s.id}`} className="font-medium text-sm hover:underline">
                    {s.title}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {CATEGORY_LABELS[s.category]} ·{' '}
                    <Link to={`/profiles/${s.providerId}`} className="hover:underline">{s.providerName}</Link>
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-700">ACTIVO</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
