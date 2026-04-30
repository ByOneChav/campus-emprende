import { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createService } from '@/api/services';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Loader2, ImageIcon, Upload, X } from 'lucide-react';

const CATEGORIES = [
  { value: 'WEB_DEV', label: 'Desarrollo web' },
  { value: 'GRAPHIC_DESIGN', label: 'Diseño Gráfico' },
  { value: 'TECH_SUPPORT', label: 'Soporte técnico' },
  { value: 'TUTORING', label: 'Tutoría' },
  { value: 'PHOTOGRAPHY', label: 'Fotografía' },
  { value: 'OTHER', label: 'Otro' },
];

export default function CreateServicePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({ title: '', description: '', category: '', imageUrl: '' });
  const [imagePreview, setImagePreview] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError('');
    setImagePreview(URL.createObjectURL(file));
    setImageUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setForm((prev) => ({ ...prev, imageUrl: url }));
    } catch (err) {
      setImageError(err.message || 'Error al cargar la imagen.');
      setImagePreview('');
      setForm((prev) => ({ ...prev, imageUrl: '' }));
    } finally {
      setImageUploading(false);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setForm((prev) => ({ ...prev, imageUrl: '' }));
    setImageError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) { setError('Por favor, seleccione una categoría.'); return; }
    if (imageUploading) { setError('Por favor, espere a que la imagen termine de cargarse.'); return; }
    setError('');
    setLoading(true);
    try {
      await createService({ ...form, imageUrl: form.imageUrl || null });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo crear el servicio.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Button variant="ghost" size="sm" asChild className="-ml-2 mb-6">
        <Link to="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" />Volver al  Dashboard</Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Ofrecer un servicio</CardTitle>
          <CardDescription>Tu servicio será revisado antes de su lanzamiento.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

            <div className="space-y-1.5">
              <Label>Título</Label>
              <Input
                placeholder="Desarrollo de sitios web con React."
                value={form.title}
                onChange={set('title')}
                required
                maxLength={150}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Categoría</Label>
              <Select  value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Selecciona una categoría" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Descripción</Label>
              <Textarea
                placeholder="Describe lo que ofreces, tu experiencia, plazos y precios…"
                rows={6}
                value={form.description}
                onChange={set('description')}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5" />
                Imagen de portada
                <span className="text-muted-foreground font-normal text-xs">(opcional)</span>
              </Label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {imagePreview ? (
                <div className="relative w-full aspect-video rounded-md border overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  {imageUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 text-white text-sm">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Subiendo…
                    </div>
                  )}
                  {!imageUploading && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-video rounded-md border-2 border-dashed border-muted-foreground/30 hover:border-muted-foreground/60 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors bg-muted/20"
                >
                  <Upload className="h-7 w-7" />
                  <span className="text-sm font-medium">Haga clic para subir la imagen</span>
                  <span className="text-xs">PNG, JPG, WEBP hasta 10 MB</span>
                </button>
              )}

              {imageError && (
                <p className="text-xs text-destructive">{imageError}</p>
              )}
            </div>

            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enviar para revisión
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
