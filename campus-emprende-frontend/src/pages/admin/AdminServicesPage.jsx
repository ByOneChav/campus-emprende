import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getPendingServicesThunk, approveServiceThunk, rejectServiceThunk } from '@/store/admin/adminThunk';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';

const CATEGORY_LABELS = {
  WEB_DEV: 'Desarrollo web', GRAPHIC_DESIGN: 'Diseño Gráfico',
  TECH_SUPPORT: 'Soporte técnico', TUTORING: 'Tutoría',
  PHOTOGRAPHY: 'Fotografía', OTHER: 'Otro',
};

export default function AdminServicesPage() {
  const dispatch = useDispatch();
  const { pendingServices, loading, actionLoading } = useSelector((s) => s.admin);
  const [rejectDialog, setRejectDialog] = useState(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { dispatch(getPendingServicesThunk()); }, [dispatch]);

  const handleApprove = (id) => {
    dispatch(approveServiceThunk(id));
  };

  const handleReject = async () => {
    if (!reason.trim()) { setError('Please provide a rejection reason.'); return; }
    setError('');
    try {
      await dispatch(rejectServiceThunk({ id: rejectDialog.id, reason })).unwrap();
      setRejectDialog(null);
      setReason('');
    } catch {
      setError('Action failed.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link to="/admin"><ArrowLeft className="mr-2 h-4 w-4" />Administrador</Link>
        </Button>
        <h1 className="text-2xl font-bold">Servicios pendientes</h1>
        <Badge variant="secondary">{pendingServices.length}</Badge>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}</div>
      ) : pendingServices.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <CheckCircle className="h-10 w-10 mx-auto mb-3 text-green-500" />
          <p>No hay servicios pendientes: ¡estás al día!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingServices.map((s) => (
            <Card key={s.id}>
              <CardContent className="pt-4 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <Link to={`/services/${s.id}`} className="font-semibold hover:underline">{s.title}</Link>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {CATEGORY_LABELS[s.category]} · Por{' '}
                      <Link to={`/profiles/${s.providerId}`} className="hover:underline">{s.providerName}</Link>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" disabled={actionLoading} onClick={() => handleApprove(s.id)}>
                      {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="mr-1 h-4 w-4" />}
                      Aprobar
                    </Button>
                    <Button size="sm" variant="destructive" disabled={actionLoading} onClick={() => { setRejectDialog(s); setReason(''); setError(''); }}>
                      <XCircle className="mr-1 h-4 w-4" />Rechazar
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{s.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!rejectDialog} onOpenChange={() => setRejectDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Rechazar servicio</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Rechazando: <strong>{rejectDialog?.title}</strong></p>
            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
            <Textarea
              placeholder="Explique por qué se rechaza este servicio…"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleReject} disabled={actionLoading}>
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Rechazar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
