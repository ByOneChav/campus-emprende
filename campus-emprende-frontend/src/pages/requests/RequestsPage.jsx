import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  getSentRequests,
  getReceivedRequests,
  acceptRequest,
  declineRequest,
  startRequest,
  completeRequest,
  confirmRequest,
  cancelRequest,
} from '@/api/requests';

import { submitReview } from '@/api/reviews';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

import { Textarea } from '@/components/ui/textarea';

import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';

import { Skeleton } from '@/components/ui/skeleton';

import {
  Star,
  Loader2,
  Send,
  Inbox,
  CheckCircle2,
  Clock3,
  XCircle,
  PlayCircle,
  Sparkles,
} from 'lucide-react';

const STATUS_COLORS = {
  PENDIENTE:
    'bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-0 shadow-md shadow-yellow-200',

  ACEPTADO:
    'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-md shadow-blue-200',

  EN_CURSO:
    'bg-gradient-to-r from-indigo-500 to-violet-500 text-white border-0 shadow-md shadow-indigo-200',

  COMPLETADO:
    'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-md shadow-green-200',

  CANCELADO:
    'bg-gradient-to-r from-red-500 to-rose-500 text-white border-0 shadow-md shadow-red-200',
};

function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-3">

      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="group transition-transform hover:scale-110"
        >
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 ${
              n <= value
                ? 'bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 shadow-lg shadow-yellow-200'
                : 'bg-slate-100 hover:bg-yellow-50'
            }`}
          >
            <Star
              className={`h-6 w-6 transition-all ${
                n <= value
                  ? 'fill-white text-white'
                  : 'text-slate-400 group-hover:text-yellow-400'
              }`}
            />
          </div>
        </button>
      ))}
    </div>
  );
}

function RequestCard({ request, asProvider, onAction }) {
  const [loading, setLoading] = useState(false);

  const action = async (fn) => {
    setLoading(true);

    try {
      await fn(request.id);
      onAction();
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const statusIcons = {
    PENDIENTE: <Clock3 className="h-4 w-4" />,
    ACEPTADO: <Sparkles className="h-4 w-4" />,
    EN_CURSO: <PlayCircle className="h-4 w-4" />,
    COMPLETADO: <CheckCircle2 className="h-4 w-4" />,
    CANCELADO: <XCircle className="h-4 w-4" />,
  };

  return (
    <Card className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-100/50">

      <CardContent className="p-0">

        <div className="p-6 space-y-5">

          {/* TOP */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

            {/* INFO */}
            <div className="space-y-3 flex-1">

              <div className="flex flex-wrap items-center gap-3">

                <Link
                  to={`/services/${request.serviceId}`}
                  className="text-xl font-black tracking-tight text-slate-900 transition-colors hover:text-blue-600"
                >
                  {request.serviceTitle}
                </Link>

                <Badge
                  className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 ${
                    STATUS_COLORS[request.status] || ''
                  }`}
                >
                  {statusIcons[request.status]}
                  {request.status.replace('_', ' ')}
                </Badge>
              </div>

              <p className="text-sm text-slate-500">
                {asProvider
                  ? `De: ${request.clientName}`
                  : `Proveedor: ${request.providerName}`}
              </p>
            </div>
          </div>

          {/* MENSAJE */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">

            <p className="border-l-4 border-blue-400 pl-4 text-[15px] leading-7 text-slate-600">
              {request.message}
            </p>
          </div>

          {/* PROVIDER ACTIONS */}
          {asProvider && (
            <div className="flex flex-wrap gap-3">

              {request.status === 'PENDIENTE' && (
                <>
                  <Button
                    size="sm"
                    disabled={loading}
                    onClick={() => action(acceptRequest)}
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                  >
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}

                    Aceptar
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={loading}
                    onClick={() => action(declineRequest)}
                    className="rounded-xl"
                  >
                    Rechazar
                  </Button>
                </>
              )}

              {request.status === 'ACEPTADO' && (
                <Button
                  size="sm"
                  disabled={loading}
                  onClick={() => action(startRequest)}
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600"
                >
                  {loading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}

                  Marcar en progreso
                </Button>
              )}

              {request.status === 'EN_CURSO' && (
                <Button
                  size="sm"
                  disabled={loading}
                  onClick={() => action(completeRequest)}
                  className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600"
                >
                  {loading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}

                  Marcar completado
                </Button>
              )}

              {['PENDIENTE', 'ACEPTADO', 'EN_CURSO'].includes(
                request.status
              ) && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={loading}
                  onClick={() => action(cancelRequest)}
                  className="rounded-xl"
                >
                  Cancelar
                </Button>
              )}
            </div>
          )}

          {/* CLIENT ACTIONS */}
          {!asProvider && (
            <div className="flex flex-wrap gap-3">

              {request.status === 'COMPLETADO' &&
                !request.completedAt && (
                  <Button
                    size="sm"
                    disabled={loading}
                    onClick={() => action(confirmRequest)}
                    className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600"
                  >
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}

                    Confirmar finalización
                  </Button>
                )}

              {request.status === 'COMPLETADO' &&
                request.completedAt && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onAction('review', request)}
                    className="rounded-xl border border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                  >
                    <Star className="mr-2 h-4 w-4 fill-yellow-400 text-yellow-400" />
                    Dejar reseña
                  </Button>
                )}

              {['PENDIENTE', 'ACEPTADO', 'EN_CURSO'].includes(
                request.status
              ) && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={loading}
                  onClick={() => action(cancelRequest)}
                  className="rounded-xl"
                >
                  Cancelar
                </Button>
              )}
            </div>
          )}
        </div>

        {/* LINE */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

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
      const [{ data: s }, { data: r }] =
        await Promise.all([
          getSentRequests(),
          getReceivedRequests(),
        ]);

      setSent(s);
      setReceived(r);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

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
    if (rating === 0) {
      setReviewError(
        'Por favor, seleccione una calificación.'
      );

      return;
    }

    setReviewLoading(true);

    try {
      await submitReview(
        reviewDialog.id,
        rating,
        comment
      );

      setReviewDialog(null);

      load();
    } catch (err) {
      setReviewError(
        err.response?.data?.message ||
          'No se pudo enviar la reseña.'
      );
    } finally {
      setReviewLoading(false);
    }
  };

  const LoadingList = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Skeleton
          key={i}
          className="h-40 w-full rounded-3xl"
        />
      ))}
    </div>
  );

  const EmptyState = ({ label, icon }) => (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center shadow-sm">

      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
        {icon}
      </div>

      <p className="text-sm text-slate-500">
        {label}
      </p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

      {/* HEADER */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

        <div className="absolute -top-10 -right-10 h-44 w-44 rounded-full bg-blue-100 blur-3xl opacity-70"></div>

        <div className="absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-indigo-100 blur-3xl opacity-70"></div>

        <div className="relative z-10">

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 mb-4">
            <Send className="h-4 w-4" />
            Gestión de solicitudes
          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Mis solicitudes
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            Administra solicitudes enviadas y recibidas de servicios.
          </p>
        </div>
      </div>

      {/* TABS */}
      <Tabs defaultValue="sent">

        <TabsList className="h-auto rounded-2xl bg-slate-100 p-1.5">

          <TabsTrigger
            value="sent"
            className="rounded-xl px-5 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Send className="mr-2 h-4 w-4" />
            Enviado ({sent.length})
          </TabsTrigger>

          <TabsTrigger
            value="received"
            className="rounded-xl px-5 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Inbox className="mr-2 h-4 w-4" />
            Recibido ({received.length})
          </TabsTrigger>
        </TabsList>

        {/* SENT */}
        <TabsContent value="sent" className="mt-6 space-y-4">

          {loading ? (
            <LoadingList />
          ) : sent.length === 0 ? (
            <EmptyState
              label="Aún no has enviado ninguna solicitud de servicio."
              icon={<Send className="h-10 w-10 text-slate-400" />}
            />
          ) : (
            sent.map((r) => (
              <RequestCard
                key={r.id}
                request={r}
                asProvider={false}
                onAction={(t) =>
                  handleAction(t, r)
                }
              />
            ))
          )}
        </TabsContent>

        {/* RECEIVED */}
        <TabsContent
          value="received"
          className="mt-6 space-y-4"
        >

          {loading ? (
            <LoadingList />
          ) : received.length === 0 ? (
            <EmptyState
              label="Aún no has recibido ninguna solicitud."
              icon={<Inbox className="h-10 w-10 text-slate-400" />}
            />
          ) : (
            received.map((r) => (
              <RequestCard
                key={r.id}
                request={r}
                asProvider
                onAction={load}
              />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* REVIEW DIALOG */}
      <Dialog
        open={!!reviewDialog}
        onOpenChange={() => setReviewDialog(null)}
      >
        <DialogContent className="rounded-3xl border border-slate-200 p-0 overflow-hidden shadow-2xl">

          <DialogHeader className="border-b bg-gradient-to-r from-yellow-50 to-white px-6 py-5">

            <DialogTitle className="text-2xl font-bold text-slate-900">
              Deja una reseña
            </DialogTitle>

            <p className="text-sm text-slate-500 mt-1">
              Por:{' '}
              <strong>
                {reviewDialog?.serviceTitle}
              </strong>
            </p>
          </DialogHeader>

          <div className="space-y-6 px-6 py-6">

            {reviewError && (
              <Alert className="border-red-200 bg-red-50 text-red-700">
                <AlertDescription>
                  {reviewError}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">

              <p className="text-base font-bold text-slate-800">
                Clasificación
              </p>

              <StarPicker
                value={rating}
                onChange={setRating}
              />
            </div>

            <Textarea
              placeholder="Comparte tu experiencia (opcional)..."
              rows={4}
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
              className="rounded-2xl border-slate-300 focus-visible:ring-2 focus-visible:ring-yellow-400"
            />
          </div>

          <DialogFooter className="border-t bg-slate-50 px-6 py-5 flex-row gap-3">

            <Button
              variant="outline"
              onClick={() =>
                setReviewDialog(null)
              }
              className="rounded-2xl px-6"
            >
              Cancelar
            </Button>

            <Button
              onClick={handleReviewSubmit}
              disabled={reviewLoading}
              className="rounded-2xl px-7 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
            >
              {reviewLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              Enviar reseña
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}