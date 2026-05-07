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

  <div className="min-h-screen bg-[#f5f7fb] px-4 py-10">

    {/* Glow decorativo */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none">

      <div className="absolute top-[-120px] left-[-120px] h-[320px] w-[320px] rounded-full bg-blue-100 blur-3xl opacity-60" />

      <div className="absolute bottom-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-slate-200 blur-3xl opacity-60" />

    </div>

    <div className="relative max-w-4xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-3">

            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>

            Perfil profesional

          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Mi perfil
          </h1>

          <p className="text-slate-500 mt-1">
            Personaliza tu información profesional y tu presencia en Campus Emprende.
          </p>

        </div>

        <Button
          variant="outline"
          onClick={handleExport}
          disabled={exporting}
          className="h-14 px-6 rounded-2xl border-slate-200 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-blue-50 hover:border-blue-200 transition-all duration-300"
        >

          {exporting
            ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            : <Download className="mr-2 h-4 w-4" />
          }

          Exportar PDF

        </Button>

      </div>

      {/* Card principal */}
      <Card className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-2xl shadow-slate-300/20">

        {/* Top gradient */}
        <div className="h-2 w-full bg-gradient-to-r from-[#0A0F5C] via-[#3B82F6] to-[#93C5FD]" />

        <CardHeader className="pb-8 pt-8">

          <div className="flex flex-col sm:flex-row sm:items-center gap-6">

            {/* Avatar */}
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
                className="relative h-28 w-28 rounded-full overflow-hidden border-4 border-white shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                disabled={avatarUploading}
              >

                {form.avatarUrl ? (

                  <img
                    src={form.avatarUrl}
                    alt="avatar"
                    className="h-full w-full object-cover"
                  />

                ) : (

                  <Avatar className="h-28 w-28">

                    <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-[#0A0F5C] to-[#2563EB] text-white">

                      {initials || 'U'}

                    </AvatarFallback>

                  </Avatar>

                )}

                {/* Hover */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">

                  {avatarUploading
                    ? <Loader2 className="h-6 w-6 text-white animate-spin" />
                    : <Camera className="h-6 w-6 text-white" />
                  }

                </div>

              </button>

            </div>

            {/* Info */}
            <div className="flex-1">

              <CardTitle className="text-3xl font-black text-slate-900">
                {user?.fullName}
              </CardTitle>

              <CardDescription className="text-base text-slate-500 mt-1">
                {user?.email}
              </CardDescription>

              <div className="flex flex-wrap gap-2 mt-4">

                <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100">
                  Campus Emprende
                </div>

                <div className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                  Perfil estudiantil
                </div>

              </div>

              {avatarError && (
                <p className="text-xs text-red-500 mt-3">
                  {avatarError}
                </p>
              )}

            </div>

          </div>

        </CardHeader>

        <Separator />

        <CardContent className="pt-8 pb-8">

          <form onSubmit={handleSave} className="space-y-6">

            {/* Alert */}
            {message && (

              <Alert
                variant={message.type === 'error' ? 'destructive' : 'default'}
                className={`rounded-2xl border ${
                  message.type === 'error'
                    ? 'border-red-200 bg-red-50'
                    : 'border-blue-200 bg-blue-50'
                }`}
              >

                <AlertDescription className="font-medium">
                  {message.text}
                </AlertDescription>

              </Alert>

            )}

            {/* Biografía */}
            <div className="space-y-2">

              <Label className="text-sm font-bold text-slate-700">
                Biografía
              </Label>

              <Textarea
                placeholder="Cuéntales a los demás sobre ti, tus habilidades y tu experiencia..."
                rows={5}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="rounded-2xl border-slate-200 bg-white/80 shadow-sm focus-visible:ring-4 focus-visible:ring-blue-100 focus-visible:border-blue-400 transition-all duration-300"
              />

            </div>

            {/* Carrera */}
            <div className="space-y-2">

              <Label className="text-sm font-bold text-slate-700">
                Carrera / Especialidad
              </Label>

              <Input
                placeholder="e.g. Computer Science"
                value={form.career}
                onChange={(e) => setForm({ ...form, career: e.target.value })}
                className="h-14 rounded-2xl border-slate-200 bg-white/80 shadow-sm focus-visible:ring-4 focus-visible:ring-blue-100 focus-visible:border-blue-400 transition-all duration-300"
              />

            </div>

            {/* Linkedin */}
            <div className="space-y-2">

              <Label className="text-sm font-bold text-slate-700">
                LinkedIn URL (opcional)
              </Label>

              <Input
                placeholder="https://linkedin.com/in/..."
                value={form.linkedinUrl}
                onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                className="h-14 rounded-2xl border-slate-200 bg-white/80 shadow-sm focus-visible:ring-4 focus-visible:ring-blue-100 focus-visible:border-blue-400 transition-all duration-300"
              />

            </div>

            {/* Botón */}
            <Button
              type="submit"
              disabled={saving || avatarUploading}
              className="h-14 px-8 rounded-2xl bg-[#2084F3] hover:bg-[#1877e6] text-white font-semibold shadow-xl shadow-blue-300/40 transition-all duration-300 hover:scale-[1.02]"
            >

              {saving
                ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                : <Save className="mr-2 h-4 w-4" />
              }

              Guardar perfil

            </Button>

          </form>

        </CardContent>

      </Card>

    </div>

  </div>

);
}
