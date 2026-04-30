import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getServiceDetail } from '@/api/services';
import { getServiceReviews } from '@/api/reviews';
import { sendRequest } from '@/api/requests';
import { submitReport } from '@/api/reports';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Flag, Send, ArrowLeft, Loader2 } from 'lucide-react';

const CATEGORY_LABELS = {
  WEB_DEV: 'Desarrollo web', GRAPHIC_DESIGN: 'Diseño Gráfico',
  TECH_SUPPORT: 'Soporte técnico', TUTORING: 'Tutoría',
  PHOTOGRAPHY: 'Fotografía', OTHER: 'Otro',
};

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`h-4 w-4 ${n <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
      ))}
    </div>
  );
}

export default function ServiceDetailPage() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [requestOpen, setRequestOpen] = useState(false);
  const [requestMsg, setRequestMsg] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState('');

  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    Promise.all([getServiceDetail(id), getServiceReviews(id)])
      .then(([{ data: s }, { data: r }]) => { setService(s); setReviews(r); })
      .catch(() => navigate('/services'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSendRequest = async () => {
    if (!requestMsg.trim()) { setRequestError('Por favor, escriba un mensaje.'); return; }
    setRequestLoading(true);
    setRequestError('');
    try {
      await sendRequest(Number(id), requestMsg);
      setRequestOpen(false);
      setRequestMsg('');
      navigate('/requests');
    } catch (err) {
      setRequestError(err.response?.data?.message || 'No se pudo enviar la solicitud.');
    } finally {
      setRequestLoading(false);
    }
  };

  const handleReport = async () => {
    if (!reportReason.trim()) return;
    setReportLoading(true);
    try {
      await submitReport({ targetType: 'SERVICE', targetId: Number(id), reason: reportReason });
      setReportOpen(false);
      setReportReason('');
    } catch {} finally {
      setReportLoading(false);
    }
  };

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-40 w-full" />
    </div>
  );

  const isOwner = service?.providerId === user?.id;
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link to="/services"><ArrowLeft className="mr-2 h-4 w-4" />Volver a servicios</Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="text-xl">{service?.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{CATEGORY_LABELS[service?.category]}</Badge>
                {avgRating && (
                  <div className="flex items-center gap-1">
                    <StarRating rating={Math.round(parseFloat(avgRating))} />
                    <span className="text-sm font-medium">{avgRating}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {isAuthenticated && !isOwner && (
                <Button onClick={() => setRequestOpen(true)}>
                  <Send className="mr-2 h-4 w-4" />Solicitar Servicio
                </Button>
              )}
              {isOwner && (
                <Button variant="outline" asChild>
                  <Link to={`/services/${id}/edit`}>Editar servicio</Link>
                </Button>
              )}
              {isAuthenticated && !isOwner && (
                <Button variant="ghost" size="icon" onClick={() => setReportOpen(true)} title="Report">
                  <Flag className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-5 space-y-5">
          <div>
            <h3 className="font-semibold mb-2">Descripción</h3>
            <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{service?.description}</p>
          </div>
          <Separator />
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {service?.providerName?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <Link to={`/profiles/${service?.providerId}`} className="font-medium text-sm hover:underline">
                {service?.providerName}
              </Link>
              <p className="text-xs text-muted-foreground">Proveedor de servicios</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {reviews.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Reseñas ({reviews.length})</h2>
          <div className="space-y-3">
            {reviews.map((r) => (
              <Card key={r.id}>
                <CardContent className="pt-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{r.reviewerName}</span>
                    <StarRating rating={r.rating} />
                  </div>
                  {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Request Dialog */}
      <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Solicite este servicio</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {requestError && <Alert variant="destructive"><AlertDescription>{requestError}</AlertDescription></Alert>}
            <Textarea
              placeholder="Describe lo que necesitas…"
              rows={4}
              value={requestMsg}
              onChange={(e) => setRequestMsg(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRequestOpen(false)}>Cancelar</Button>
            <Button onClick={handleSendRequest} disabled={requestLoading}>
              {requestLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Enviar solicitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Dialog */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reportar este servicio</DialogTitle></DialogHeader>
          <Textarea
            placeholder="Describe el problema..."
            rows={3}
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleReport} disabled={reportLoading}>
              {reportLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Enviar informe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
