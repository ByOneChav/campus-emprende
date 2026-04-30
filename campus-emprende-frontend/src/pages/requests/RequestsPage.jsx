import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getSentRequests, getReceivedRequests,
  acceptRequest, declineRequest, startRequest,
  completeRequest, confirmRequest, cancelRequest
} from '@/api/requests';
import { submitReview } from '@/api/reviews';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Loader2 } from 'lucide-react';

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  ACCEPTED: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-indigo-100 text-indigo-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)}>
          <Star className={`h-6 w-6 transition-colors ${n <= value ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground hover:text-yellow-300'}`} />
        </button>
      ))}
    </div>
  );
}

function RequestCard({ request, asProvider, onAction }) {
  const [loading, setLoading] = useState(false);

  const action = async (fn) => {
    setLoading(true);
    try { await fn(request.id); onAction(); }
    catch {} finally { setLoading(false); }
  };

  return (
    <Card>
      <CardContent className="pt-4 space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <Link to={`/services/${request.serviceId}`} className="font-medium text-sm hover:underline">
              {request.serviceTitle}
            </Link>
            <p className="text-xs text-muted-foreground mt-0.5">
              {asProvider ? `From: ${request.clientName}` : `Provider: ${request.providerName}`}
            </p>
          </div>
          <Badge className={STATUS_COLORS[request.status] || ''}>
            {request.status.replace('_', ' ')}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground border-l-2 pl-3">{request.message}</p>

        {/* Provider actions */}
        {asProvider && (
          <div className="flex flex-wrap gap-2">
            {request.status === 'PENDING' && (
              <>
                <Button size="sm" disabled={loading} onClick={() => action(acceptRequest)}>
                  {loading && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}Aceptar
                </Button>
                <Button size="sm" variant="destructive" disabled={loading} onClick={() => action(declineRequest)}>
                  Rechazar
                </Button>
              </>
            )}
            {request.status === 'ACCEPTED' && (
              <Button size="sm" disabled={loading} onClick={() => action(startRequest)}>
                {loading && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}Marcar en progreso
              </Button>
            )}
            {request.status === 'IN_PROGRESS' && (
              <Button size="sm" disabled={loading} onClick={() => action(completeRequest)}>
                {loading && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}Marcar completado
              </Button>
            )}
            {['PENDING', 'ACCEPTED', 'IN_PROGRESS'].includes(request.status) && (
              <Button size="sm" variant="ghost" disabled={loading} onClick={() => action(cancelRequest)}>
                Cancelar
              </Button>
            )}
          </div>
        )}

        {/* Client actions */}
        {!asProvider && (
          <div className="flex flex-wrap gap-2">
            {request.status === 'COMPLETED' && !request.completedAt && (
              <Button size="sm" disabled={loading} onClick={() => action(confirmRequest)}>
                {loading && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}Confirmar finalización
              </Button>
            )}
            {request.status === 'COMPLETED' && request.completedAt && (
              <Button size="sm" variant="secondary" onClick={() => onAction('review', request)}>
                <Star className="mr-1 h-3 w-3" />Dejar reseña
              </Button>
            )}
            {['PENDING', 'ACCEPTED', 'IN_PROGRESS'].includes(request.status) && (
              <Button size="sm" variant="ghost" disabled={loading} onClick={() => action(cancelRequest)}>
                Cancelar
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function RequestsPage() {
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [loading, setLoading] = useState(true);

  const [reviewDialog, setReviewDialog] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [{ data: s }, { data: r }] = await Promise.all([getSentRequests(), getReceivedRequests()]);
      setSent(s);
      setReceived(r);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAction = (type, request) => {
    if (type === 'review') {
      setReviewDialog(request);
      setRating(0);
      setComment('');
      setReviewError('');
    } else {
      load();
    }
  };

  const handleReviewSubmit = async () => {
    if (rating === 0) { setReviewError('Por favor, seleccione una calificación.'); return; }
    setReviewLoading(true);
    try {
      await submitReview(reviewDialog.id, rating, comment);
      setReviewDialog(null);
      load();
    } catch (err) {
      setReviewError(err.response?.data?.message || 'No se pudo enviar la reseña.');
    } finally {
      setReviewLoading(false);
    }
  };

  const LoadingList = () => (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
    </div>
  );

  const EmptyState = ({ label }) => (
    <div className="py-12 text-center text-muted-foreground text-sm">{label}</div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Mis solicitudes</h1>

      <Tabs defaultValue="sent">
        <TabsList>
          <TabsTrigger value="sent">Enviado ({sent.length})</TabsTrigger>
          <TabsTrigger value="received">Recibido ({received.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="sent" className="mt-4 space-y-3">
          {loading ? <LoadingList /> : sent.length === 0 ? (
            <EmptyState label="Aún no has enviado ninguna solicitud de servicio." />
          ) : (
            sent.map((r) => (
              <RequestCard key={r.id} request={r} asProvider={false} onAction={(t) => handleAction(t, r)} />
            ))
          )}
        </TabsContent>

        <TabsContent value="received" className="mt-4 space-y-3">
          {loading ? <LoadingList /> : received.length === 0 ? (
            <EmptyState label="Aún no has recibido ninguna solicitud." />
          ) : (
            received.map((r) => (
              <RequestCard key={r.id} request={r} asProvider onAction={load} />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={!!reviewDialog} onOpenChange={() => setReviewDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Deja una reseña</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Por: <strong>{reviewDialog?.serviceTitle}</strong></p>
            {reviewError && <Alert variant="destructive"><AlertDescription>{reviewError}</AlertDescription></Alert>}
            <div className="space-y-1.5">
              <p className="text-sm font-medium">Clasificación</p>
              <StarPicker value={rating} onChange={setRating} />
            </div>
            <Textarea
              placeholder="Comparte tu experiencia (opcional)..."
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialog(null)}>Cancelar</Button>
            <Button onClick={handleReviewSubmit} disabled={reviewLoading}>
              {reviewLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Enviar reseña
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
