import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getServiceDetail } from '@/api/services';
import { getServiceReviews } from '@/api/reviews';
import { sendRequest } from '@/api/requests';
import { submitReport } from '@/api/reports';
import { useAuth } from '@/context/AuthContext';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';

import { Skeleton } from '@/components/ui/skeleton';

import {
  Star,
  Flag,
  Send,
  ArrowLeft,
  Loader2,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

const CATEGORY_LABELS = {
  WEB_DEV: 'Desarrollo web',
  GRAPHIC_DESIGN: 'Diseño Gráfico',
  TECH_SUPPORT: 'Soporte técnico',
  TUTORING: 'Tutoría',
  PHOTOGRAPHY: 'Fotografía',
  OTHER: 'Otro',
};

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-4 w-4 transition-all ${
            n <= rating
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-slate-300'
          }`}
        />
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
      .then(([{ data: s }, { data: r }]) => {
        setService(s);
        setReviews(r);
      })
      .catch(() => navigate('/services'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSendRequest = async () => {
    if (!requestMsg.trim()) {
      setRequestError('Por favor, escriba un mensaje.');
      return;
    }

    setRequestLoading(true);
    setRequestError('');

    try {
      await sendRequest(Number(id), requestMsg);

      setRequestOpen(false);
      setRequestMsg('');

      navigate('/requests');
    } catch (err) {
      setRequestError(
        err.response?.data?.message ||
          'No se pudo enviar la solicitud.'
      );
    } finally {
      setRequestLoading(false);
    }
  };

  const handleReport = async () => {
    if (!reportReason.trim()) return;

    setReportLoading(true);

    try {
      await submitReport({
        targetType: 'SERVICE',
        targetId: Number(id),
        reason: reportReason,
      });

      setReportOpen(false);
      setReportReason('');
    } catch {
    } finally {
      setReportLoading(false);
    }
  };

  if (loading)
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-5">
        <Skeleton className="h-10 w-56 rounded-xl" />
        <Skeleton className="h-80 w-full rounded-3xl" />
      </div>
    );

  const isOwner = service?.providerId === user?.id;

  const avgRating = reviews.length
    ? (
        reviews.reduce((s, r) => s + r.rating, 0) /
        reviews.length
      ).toFixed(1)
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-7">

      {/* VOLVER */}
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 shadow-sm"
      >
        <Link to="/services">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a servicios
        </Link>
      </Button>

      {/* CARD PRINCIPAL */}
      <Card className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-100">

        {/* TOP */}
        <CardHeader className="relative overflow-hidden border-b bg-gradient-to-br from-slate-50 via-white to-blue-50">

          {/* Decoración */}
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-blue-100 blur-3xl opacity-60"></div>

          <div className="relative z-10 flex flex-wrap items-start justify-between gap-5">

            {/* INFO */}
            <div className="space-y-3">

              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-xs font-semibold text-blue-700">
                <Sparkles className="h-3.5 w-3.5" />
                Servicio disponible
              </div>

              <div>
                <CardTitle className="text-3xl font-black tracking-tight text-slate-900">
                  {service?.title}
                </CardTitle>

                <div className="mt-3 flex flex-wrap items-center gap-3">

                  <Badge className="rounded-full bg-slate-900 px-4 py-1.5 text-white hover:bg-slate-900">
                    {CATEGORY_LABELS[service?.category]}
                  </Badge>

                  {avgRating && (
                    <div className="flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1.5">
                      <StarRating
                        rating={Math.round(parseFloat(avgRating))}
                      />

                      <span className="text-sm font-semibold text-yellow-700">
                        {avgRating}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* BOTONES */}
            {!isOwner && isAuthenticated && (
              <div className="flex items-center gap-3">

                <Button
                  onClick={() => setRequestOpen(true)}
                  className="h-14 rounded-2xl px-7 text-base font-semibold shadow-lg shadow-blue-200 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                >
                  <Send className="mr-2 h-5 w-5" />
                  Solicitar Servicio
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setReportOpen(true)}
                  className="h-14 w-14 rounded-2xl border-slate-200 bg-white shadow-sm hover:bg-red-50 hover:border-red-200"
                >
                  <Flag className="h-5 w-5 text-slate-600" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        {/* CONTENT */}
        <CardContent className="space-y-8 p-8">

          {/* DESCRIPCION */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Descripción
            </h3>

            <p className="leading-8 text-slate-600">
              {service?.description}
            </p>
          </div>

          <Separator />

          {/* PROVIDER */}
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
              <AvatarFallback className="bg-gradient-to-br from-indigo-700 to-blue-600 text-lg font-bold text-white">
                {service?.providerName?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div>
              <h4 className="text-lg font-bold text-slate-900">
                {service?.providerName}
              </h4>

              <p className="text-sm text-slate-500">
                Proveedor de servicios
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DIALOG SOLICITAR */}
      <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
        <DialogContent className="rounded-3xl border border-slate-200 p-0 overflow-hidden shadow-2xl">

          <DialogHeader className="border-b bg-gradient-to-r from-blue-50 to-white px-6 py-5">
            <DialogTitle className="text-xl font-bold text-slate-900">
              Solicite este servicio
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 px-6 py-5">

            {requestError && (
              <Alert className="border-red-200 bg-red-50 text-red-700">
                <AlertDescription>
                  {requestError}
                </AlertDescription>
              </Alert>
            )}

            <Textarea
              placeholder="Describe lo que necesitas..."
              value={requestMsg}
              onChange={(e) => setRequestMsg(e.target.value)}
              className="min-h-[130px] rounded-2xl border-slate-300 focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>

          <DialogFooter className="border-t bg-slate-50 px-6 py-5 flex-row gap-3">

            <Button
              variant="outline"
              onClick={() => setRequestOpen(false)}
              className="rounded-2xl px-6"
            >
              Cancelar
            </Button>

            <Button
              onClick={handleSendRequest}
              disabled={requestLoading}
              className="rounded-2xl px-7 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
            >
              {requestLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar solicitud'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG REPORT */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="rounded-3xl border border-slate-200 p-0 overflow-hidden shadow-2xl">

          <DialogHeader className="border-b bg-gradient-to-r from-red-50 to-white px-6 py-5">
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <ShieldAlert className="h-5 w-5 text-red-500" />
              Reportar este servicio
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 py-5">
            <Textarea
              placeholder="Describe el problema..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="min-h-[130px] rounded-2xl border-slate-300 focus-visible:ring-2 focus-visible:ring-red-400"
            />
          </div>

          <DialogFooter className="border-t bg-slate-50 px-6 py-5 flex-row gap-3">

            <Button
              variant="outline"
              onClick={() => setReportOpen(false)}
              className="rounded-2xl px-6"
            >
              Cancelar
            </Button>

            <Button
              onClick={handleReport}
              disabled={reportLoading}
              className="rounded-2xl px-7 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white"
            >
              {reportLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar informe'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}