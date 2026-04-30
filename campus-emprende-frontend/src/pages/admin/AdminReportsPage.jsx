import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getReportsThunk, resolveReportThunk } from '@/store/report/reportThunk';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Loader2 } from 'lucide-react';

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  REVIEWED: 'bg-blue-100 text-blue-700',
  RESOLVED: 'bg-green-100 text-green-700',
};

const SkeletonList = () => (
  <div className="space-y-3 mt-4">
    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
  </div>
);

function ReportList({ reports, onResolve }) {
  if (reports.length === 0)
    return <div className="py-12 text-center text-muted-foreground text-sm">No se encontraron informes.</div>;

  return (
    <div className="space-y-3 mt-4">
      {reports.map((r) => (
        <Card key={r.id}>
          <CardContent className="pt-4 space-y-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{r.targetType}</Badge>
                  <span className="text-sm text-muted-foreground">ID #{r.targetId}</span>
                  <Badge className={STATUS_COLORS[r.status]}>{r.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Por {r.reporterName}</p>
              </div>
              {r.status !== 'RESOLVED' && (
                <Button size="sm" onClick={() => onResolve(r)}>Resolver</Button>
              )}
            </div>
            <p className="text-sm border-l-2 pl-3 text-muted-foreground">{r.reason}</p>
            {r.adminNotes && (
              <p className="text-xs text-muted-foreground"><strong>Notas administrativas:</strong> {r.adminNotes}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function AdminReportsPage() {
  const dispatch = useDispatch();
  const { items: reports, loading } = useSelector((s) => s.report);
  const [resolveDialog, setResolveDialog] = useState(null);
  const [notes, setNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { dispatch(getReportsThunk()); }, [dispatch]);

  const handleTabChange = (tab) => {
    dispatch(getReportsThunk(tab === 'ALL' ? undefined : tab));
  };

  const openResolve = (r) => { setResolveDialog(r); setNotes(''); setError(''); };

  const handleResolve = async () => {
    setActionLoading(true);
    setError('');
    try {
      await dispatch(resolveReportThunk({ id: resolveDialog.id, reason: notes })).unwrap();
      setResolveDialog(null);
    } catch {
      setError('Failed to resolve report.');
    } finally {
      setActionLoading(false);
    }
  };

  const tabContent = loading
    ? <SkeletonList />
    : <ReportList reports={reports} onResolve={openResolve} />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link to="/admin"><ArrowLeft className="mr-2 h-4 w-4" />Administrador</Link>
        </Button>
        <h1 className="text-2xl font-bold">Informes</h1>
      </div>

      <Tabs defaultValue="ALL" onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="ALL">Todo</TabsTrigger>
          <TabsTrigger value="PENDING">Pendiente</TabsTrigger>
          <TabsTrigger value="RESOLVED">Resuelto</TabsTrigger>
        </TabsList>
        <TabsContent value="ALL">{tabContent}</TabsContent>
        <TabsContent value="PENDING">{tabContent}</TabsContent>
        <TabsContent value="RESOLVED">{tabContent}</TabsContent>
      </Tabs>

      <Dialog open={!!resolveDialog} onOpenChange={() => setResolveDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Resolver informe</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Informe sobre <Badge variant="outline">{resolveDialog?.targetType}</Badge> #{resolveDialog?.targetId}
            </p>
            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
            <Textarea
              placeholder="Notas del administrador (opcional)…"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResolveDialog(null)}>Cancelar</Button>
            <Button onClick={handleResolve} disabled={actionLoading}>
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Marcar resuelto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
