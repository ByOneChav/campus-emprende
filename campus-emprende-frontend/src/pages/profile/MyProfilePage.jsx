import { useRef, useState, useEffect } from 'react';
import { getMyProfile, upsertProfile, exportPdf } from '@/api/profile';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Loader2, Download, Save, Camera } from 'lucide-react';

export default function MyProfilePage() {
  const { user } = useAuth();
  const avatarInputRef = useRef(null);
  const [form, setForm] = useState({ bio: '', career: '', avatarUrl: '', linkedinUrl: '' });
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    getMyProfile()
      .then(({ data }) => setForm({
        bio: data.bio || '',
        career: data.career || '',
        avatarUrl: data.avatarUrl || '',
        linkedinUrl: data.linkedinUrl || '',
      }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarError('');
    setAvatarUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setForm((prev) => ({ ...prev, avatarUrl: url }));
    } catch (err) {
      setAvatarError(err.message || 'Error al subir la imagen.');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await upsertProfile(form);
      setMessage({ type: 'success', text: 'Perfil guardado exitosamente.' });
    } catch {
      setMessage({ type: 'error', text: 'No se pudo guardar el perfil.' });
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const { data } = await exportPdf();
      const url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'portafolio.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setMessage({ type: 'error', text: 'No se pudo exportar el PDF.' });
    } finally {
      setExporting(false);
    }
  };

  const initials = user?.fullName?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mi perfil</h1>
        <Button variant="outline" onClick={handleExport} disabled={exporting}>
          {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          Exportar PDF
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative group shrink-0">
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="relative h-16 w-16 rounded-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                disabled={avatarUploading}
              >
                {form.avatarUrl ? (
                  <img src={form.avatarUrl} alt="avatar" className="h-16 w-16 object-cover" />
                ) : (
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                      {initials || 'U'}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  {avatarUploading
                    ? <Loader2 className="h-5 w-5 text-white animate-spin" />
                    : <Camera className="h-5 w-5 text-white" />
                  }
                </div>
              </button>
            </div>
            <div>
              <CardTitle>{user?.fullName}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
              {avatarError && <p className="text-xs text-destructive mt-1">{avatarError}</p>}
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <form onSubmit={handleSave} className="space-y-4">
            {message && (
              <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-1.5">
              <Label>Biografía</Label>
              <Textarea
                placeholder="Cuéntales a los demás sobre ti, tus habilidades y tu experiencia…"
                rows={4}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Carrera / Especialidad</Label>
              <Input
                placeholder="e.g. Computer Science"
                value={form.career}
                onChange={(e) => setForm({ ...form, career: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>LinkedIn URL (opcional)</Label>
              <Input
                placeholder="https://linkedin.com/in/..."
                value={form.linkedinUrl}
                onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
              />
            </div>
            <Button type="submit" disabled={saving || avatarUploading}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Guardar perfil
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
