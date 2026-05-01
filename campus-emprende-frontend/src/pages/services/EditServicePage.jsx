import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getServiceDetail, updateService, deactivateService } from '@/api/services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ArrowLeft, Loader2 } from 'lucide-react';

const CATEGORIES = [
  { value: 'WEB_DEV', label: 'Desarrollo Web' },
  { value: 'GRAPHIC_DESIGN', label: 'Diseño Gráfico' },
  { value: 'TECH_SUPPORT', label: 'Soporte técnico' },
  { value: 'TUTORING', label: 'Tutoría' },
  { value: 'PHOTOGRAPHY', label: 'Fotografía' },
  { value: 'OTHER', label: 'Otro' },
];

const STATUS_COLORS = {
  PENDIENTE: 'bg-yellow-100 text-yellow-700',
  APROVADO: 'bg-green-100 text-green-700',
  RECHAZADO: 'bg-red-100 text-red-700',
  INACTIVO: 'bg-gray-100 text-gray-700',
};

export default function EditServicePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: '' });
  const [status, setStatus] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deactivateOpen, setDeactivateOpen] = useState(false);

  useEffect(() => {
    getServiceDetail(id)
      .then(({ data }) => {
        setForm({ title: data.title, description: data.description, category: data.category });
        setStatus(data.status);
        setRejectionReason(data.rejectionReason || '');
      })
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updateService(id, form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo actualizar el servicio.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    try {
      await deactivateService(id);
      navigate('/dashboard');
    } catch {}
  };

  if (loading) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Button variant="ghost" size="sm" asChild className="-ml-2 mb-6">
        <Link to="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" />Volver al Dashboard</Link>
      </Button>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Editar servicio</CardTitle>
              <CardDescription>Los cambios requerirán que el servicio se vuelva a enviar para su revisión.</CardDescription>
            </div>
            <Badge className={STATUS_COLORS[status]}>{status}</Badge>
          </div>
          {status === 'RECHAZADO' && rejectionReason && (
            <Alert variant="destructive" className="mt-3">
              <AlertDescription><strong>Motivo del rechazo:</strong> {rejectionReason}</AlertDescription>
            </Alert>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required maxLength={150} />
            </div>
            <div className="space-y-1.5">
              <Label>Categoria</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea rows={6} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Guardar cambios
              </Button>
              {status !== 'INACTIVO' && (
                <Button type="button" variant="destructive" onClick={() => setDeactivateOpen(true)}>
                  Desactivar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog open={deactivateOpen} onOpenChange={setDeactivateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>¿Desactivar el servicio?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Esto ocultará el servicio del mercado. Puedes editarlo para volver a enviarlo.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeactivateOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeactivate}>Desactivar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
