import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyServices } from '@/api/services';
import { getSentRequests, getReceivedRequests } from '@/api/requests';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Briefcase, Send, Inbox, AlertCircle } from 'lucide-react';

const STATUS_COLORS = {
  PENDIENTE: 'bg-yellow-100 text-yellow-700',
  APROBADO: 'bg-green-100 text-green-700',
  RECHAZADO: 'bg-red-100 text-red-700',
  INACTIVO: 'bg-gray-100 text-gray-600',
  ACEPTADO: 'bg-blue-100 text-blue-700',
  EN_CURSO: 'bg-indigo-100 text-indigo-700',
  COMPLETADO: 'bg-green-100 text-green-700',
  CANCELADO: 'bg-red-100 text-red-700',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyServices(), getSentRequests(), getReceivedRequests()])
      .then(([{ data: s }, { data: se }, { data: re }]) => {
        setServices(s);
        setSent(se);
        setReceived(re);
      })
      .finally(() => setLoading(false));
  }, []);

  const pendingServices = services.filter((s) => s.status === 'PENDIENTE').length;
  const activeRequests = received.filter((r) => ['PENDIENTE', 'ACEPTADO', 'EN_CURSO'].includes(r.status)).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Bienvenido de nuevo, {user?.fullName?.split(' ')[0]}!</p>
        </div>
        <Button asChild>
          <Link to="/services/create"><Plus className="mr-2 h-4 w-4" />Nuevo servicio</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Mis servicios', value: services.length, icon: Briefcase },
          { label: 'Revisión pendiente', value: pendingServices, icon: AlertCircle },
          { label: 'Solicitudes enviadas', value: sent.length, icon: Send },
          { label: 'Solicitudes activas', value: activeRequests, icon: Inbox },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="pt-5 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-muted">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{loading ? '—' : value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* My Services */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Mis servicios</h2>
        </div>
        {loading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : services.length === 0 ? (
          <Card>
            <CardContent className="py-10 flex flex-col items-center gap-3 text-center text-muted-foreground">
              <Briefcase className="h-8 w-8" />
              <p>Todavía no has ofrecido ningún servicio.</p>
              <Button asChild><Link to="/services/create">Ofrece tu primer servicio</Link></Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {services.map((s) => (
              <Card key={s.id}>
                <CardContent className="py-3 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{s.title}</p>
                    <p className="text-xs text-muted-foreground">{s.category.replace('_', ' ')}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge className={STATUS_COLORS[s.status] || ''}>{s.status}</Badge>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/services/${s.id}`}>Ver detalles</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/services/${s.id}/edit`}>Editar</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Recent received requests */}
      {received.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Solicitudes entrantes</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/requests">Ver todo →</Link>
            </Button>
          </div>
          <div className="space-y-2">
            {received.slice(0, 3).map((r) => (
              <Card key={r.id}>
                <CardContent className="py-3 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{r.serviceTitle}</p>
                    <p className="text-xs text-muted-foreground">De: {r.clientName}</p>
                  </div>
                  <Badge className={STATUS_COLORS[r.status] || ''}>{r.status.replace('_', ' ')}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
