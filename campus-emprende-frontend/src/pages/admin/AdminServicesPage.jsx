import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import {
  getPendingServicesThunk,
  approveServiceThunk,
  rejectServiceThunk
} from '@/store/admin/adminThunk';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';

import {
  Alert,
  AlertDescription
} from '@/components/ui/alert';

import { Skeleton } from '@/components/ui/skeleton';

import {
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
  Clock3,
  CheckCircle2
} from 'lucide-react';

const CATEGORY_LABELS = {
  WEB_DEV: 'Desarrollo web',
  GRAPHIC_DESIGN: 'Diseño Gráfico',
  TECH_SUPPORT: 'Soporte técnico',
  TUTORING: 'Tutoría',
  PHOTOGRAPHY: 'Fotografía',
  OTHER: 'Otro',
};

export default function AdminServicesPage() {

  const dispatch = useDispatch();

  const {
    pendingServices,
    loading,
    actionLoading
  } = useSelector((s) => s.admin);

  const [rejectDialog, setRejectDialog] = useState(null);

  const [reason, setReason] = useState('');

  const [error, setError] = useState('');

  useEffect(() => {

    dispatch(getPendingServicesThunk());

  }, [dispatch]);

  const handleApprove = (id) => {

    dispatch(approveServiceThunk(id));

  };

  const handleReject = async () => {

    if (!reason.trim()) {

      setError('Por favor ingrese un motivo de rechazo.');

      return;

    }

    setError('');

    try {

      await dispatch(
        rejectServiceThunk({
          id: rejectDialog.id,
          reason
        })
      ).unwrap();

      setRejectDialog(null);

      setReason('');

    } catch {

      setError('La acción ha fallado.');

    }
  };

  return (

    <div className="min-h-screen bg-[#f6f8fc] p-6">

      {/* Decoración */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">

        <div className="absolute top-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-blue-100 blur-3xl opacity-40" />

        <div className="absolute bottom-[-120px] left-[-120px] h-[320px] w-[320px] rounded-full bg-yellow-100 blur-3xl opacity-40" />

      </div>

      <div className="relative space-y-8">

        {/* Header */}
        <div className="space-y-5">

          <div className="flex items-center gap-3">

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="rounded-xl"
            >

              <Link to="/admin">

                <ArrowLeft className="mr-2 h-4 w-4" />

                Administrador

              </Link>

            </Button>

          </div>

          <div className="space-y-3">

            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-4 py-1.5 text-xs font-semibold text-yellow-700">

              <Clock3 className="h-3.5 w-3.5" />

              Revisión administrativa pendiente

            </div>

            <div className="flex items-center gap-3 flex-wrap">

              <h1 className="text-4xl font-black tracking-tight text-slate-900">
                Servicios pendientes
              </h1>

              <Badge className="h-8 px-3 rounded-xl bg-yellow-500 text-white text-sm shadow-md">

                {pendingServices.length}

              </Badge>

            </div>

            <p className="text-slate-500 text-[15px] max-w-2xl">
              Revisa cuidadosamente los servicios antes de aprobarlos para su publicación.
            </p>

          </div>

        </div>

        {/* Loading */}
        {loading ? (

          <div className="grid gap-4">

            {[...Array(4)].map((_, i) => (

              <Skeleton
                key={i}
                className="h-36 rounded-3xl"
              />

            ))}

          </div>

        ) : pendingServices.length === 0 ? (

          <div className="rounded-[32px] border border-slate-200 bg-white shadow-xl py-24 text-center">

            <CheckCircle className="h-14 w-14 mx-auto text-green-500 mb-5" />

            <h2 className="text-2xl font-black text-slate-900 mb-2">
              No hay servicios pendientes
            </h2>

            <p className="text-slate-500">
              Todo está actualizado por ahora.
            </p>

          </div>

        ) : (

          <div className="grid gap-5">

            {pendingServices.map((s, index) => (

              <Card
                key={s.id}
                className="group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-lg shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-yellow-200/40"
              >

                {/* Glow */}
                <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-yellow-100 blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />

                {/* Barra lateral */}
                <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-yellow-400 to-orange-500" />

                <CardContent className="relative p-6">

                  <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

                    {/* Información */}
                    <div className="flex items-start gap-5 flex-1">

                      {/* Número */}
                      <div className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-black shadow-lg shadow-yellow-300/40">

                        {index + 1}

                      </div>

                      {/* Textos */}
                      <div className="space-y-3 flex-1">

                        <div className="space-y-2">

                          <Link
                            to={`/services/${s.id}`}
                            className="block text-2xl font-black tracking-tight text-slate-900 hover:text-[#0A84FF] transition-colors"
                          >

                            {s.title}

                          </Link>

                          <div className="flex flex-wrap items-center gap-2">

                            <Badge className="rounded-xl bg-yellow-100 text-yellow-700 border border-yellow-200 px-3 py-1">

                              PENDIENTE

                            </Badge>

                            <Badge className="rounded-xl bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1">

                              {CATEGORY_LABELS[s.category]}

                            </Badge>

                          </div>

                        </div>

                        <div className="text-sm text-slate-500">

                          Por{' '}

                          <Link
                            to={`/profiles/${s.providerId}`}
                            className="font-semibold text-slate-700 hover:text-[#0A84FF]"
                          >

                            {s.providerName}

                          </Link>

                        </div>

                        <p className="text-slate-600 leading-relaxed line-clamp-3">

                          {s.description}

                        </p>

                      </div>

                    </div>

                    {/* Botones */}
                    <div className="flex items-center gap-3">

                      {/* Aprobar */}
                      <Button
                        disabled={actionLoading}
                        onClick={() => handleApprove(s.id)}
                        className="h-12 rounded-2xl px-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-300/40 hover:scale-105 hover:shadow-xl transition-all duration-300"
                      >

                        {actionLoading ? (

                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                        ) : (

                          <CheckCircle2 className="mr-2 h-4 w-4" />

                        )}

                        Aprobar

                      </Button>

                      {/* Rechazar */}
                      <Button
                        variant="outline"
                        disabled={actionLoading}
                        onClick={() => {

                          setRejectDialog(s);

                          setReason('');

                          setError('');

                        }}
                        className="h-12 rounded-2xl px-6 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300 hover:scale-105 transition-all duration-300"
                      >

                        <XCircle className="mr-2 h-4 w-4" />

                        Rechazar

                      </Button>

                    </div>

                  </div>

                </CardContent>

              </Card>

            ))}

          </div>

        )}

      </div>

      {/* Modal */}
      <Dialog
        open={!!rejectDialog}
        onOpenChange={() => setRejectDialog(null)}
      >

        <DialogContent className="sm:max-w-[520px] rounded-[28px] border-0 bg-white shadow-2xl p-0 overflow-hidden">

          {/* Header */}
          <div className="relative bg-gradient-to-r from-red-500 to-rose-500 px-8 py-6 text-white">

            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/10 blur-3xl" />

            <DialogHeader>

              <DialogTitle className="text-2xl font-black">
                Rechazar servicio
              </DialogTitle>

            </DialogHeader>

            <p className="mt-2 text-red-100">
              Esta acción notificará al proveedor.
            </p>

          </div>

          {/* Body */}
          <div className="space-y-6 px-8 py-7">

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

              <p className="text-sm text-slate-500 mb-1">
                Servicio seleccionado
              </p>

              <h3 className="text-lg font-bold text-slate-900">

                {rejectDialog?.title}

              </h3>

            </div>

            {error && (

              <Alert variant="destructive">

                <AlertDescription>
                  {error}
                </AlertDescription>

              </Alert>

            )}

            <div className="space-y-3">

              <p className="text-sm font-semibold text-slate-700">
                Motivo del rechazo
              </p>

              <Textarea
                placeholder="Explique por qué se rechaza este servicio..."
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="rounded-2xl border-slate-200 focus:border-red-400 focus:ring-red-400"
              />

            </div>

          </div>

          {/* Footer */}
          <DialogFooter className="flex justify-end gap-3 border-t border-slate-100 px-8 py-5 bg-slate-50">

            <Button
              variant="outline"
              onClick={() => setRejectDialog(null)}
              className="h-12 rounded-2xl px-6"
            >

              Cancelar

            </Button>

            <Button
              onClick={handleReject}
              disabled={actionLoading}
              className="h-12 rounded-2xl px-6 bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-300/40 hover:scale-105 transition-all duration-300"
            >

              {actionLoading && (

                <Loader2 className="mr-2 h-4 w-4 animate-spin" />

              )}

              <XCircle className="mr-2 h-4 w-4" />

              Rechazar servicio

            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>

    </div>

  );
}