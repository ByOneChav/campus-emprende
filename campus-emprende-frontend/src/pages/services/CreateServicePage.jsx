import { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createService } from '@/api/services';
import { uploadToCloudinary } from '@/lib/cloudinary';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';

import {
  Alert,
  AlertDescription
} from '@/components/ui/alert';

import {
  ArrowLeft,
  Loader2,
  ImageIcon,
  Upload,
  X,
  Sparkles
} from 'lucide-react';

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

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    imageUrl: ''
  });

  const [imagePreview, setImagePreview] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) =>
    setForm({ ...form, [key]: e.target.value });

  // Maneja subida de imagen
  const handleFileChange = async (e) => {

    const file = e.target.files?.[0];

    if (!file) return;

    setImageError('');
    setImagePreview(URL.createObjectURL(file));
    setImageUploading(true);

    try {

      const url = await uploadToCloudinary(file);

      setForm((prev) => ({
        ...prev,
        imageUrl: url
      }));

    } catch (err) {

      setImageError(err.message || 'Error al cargar la imagen.');
      setImagePreview('');

      setForm((prev) => ({
        ...prev,
        imageUrl: ''
      }));

    } finally {
      setImageUploading(false);
    }
  };

  // Elimina imagen
  const removeImage = () => {

    setImagePreview('');

    setForm((prev) => ({
      ...prev,
      imageUrl: ''
    }));

    setImageError('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Enviar formulario
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!form.category) {
      setError('Por favor, seleccione una categoría.');
      return;
    }

    if (imageUploading) {
      setError('Por favor, espere a que la imagen termine de cargarse.');
      return;
    }

    setError('');
    setLoading(true);

    try {

      await createService({
        ...form,
        imageUrl: form.imageUrl || null
      });

      navigate('/dashboard');

    } catch (err) {

      setError(
        err.response?.data?.message ||
        'No se pudo crear el servicio.'
      );

    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-[#f5f7fb] py-10">

      {/* Contenedor principal */}
      <div className="max-w-3xl mx-auto px-4">

        {/* Botón volver */}
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="mb-6 rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-sm hover:bg-slate-50 hover:shadow-md transition-all duration-200"
        >
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Dashboard
          </Link>
        </Button>

        {/* Card principal */}
        <Card className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-300/30">

          {/* Barra superior */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#0A84FF] via-[#5AA9FF] to-[#B7D8FF]" />

          {/* Glow decorativo */}
          <div className="absolute -top-20 right-[-60px] h-56 w-56 rounded-full bg-blue-100 blur-3xl opacity-60" />

          {/* Header */}
          <CardHeader className="relative space-y-4 px-8 pt-8">

            {/* Icono decorativo */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0A84FF] shadow-lg shadow-blue-500/30">

              <Sparkles className="h-7 w-7 text-white" />

            </div>

            <div>
              <CardTitle className="text-4xl font-extrabold tracking-tight text-slate-900">
                Ofrecer un servicio
              </CardTitle>

              <CardDescription className="mt-2 text-[16px] leading-relaxed text-slate-500">
                Publica tu servicio de manera profesional y llega a más estudiantes.
              </CardDescription>
            </div>

          </CardHeader>

          {/* Contenido */}
          <CardContent className="relative px-8 pb-8">

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Error */}
              {error && (
                <Alert
                  variant="destructive"
                  className="rounded-2xl border-red-200"
                >
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Campo título */}
              <div className="space-y-2">

                <Label className="text-[15px] font-semibold text-slate-800">
                  Título
                </Label>

                <Input
                  placeholder="Desarrollo de sitios web con React."
                  value={form.title}
                  onChange={set('title')}
                  required
                  maxLength={150}
                  className="h-14 rounded-2xl border-slate-200 bg-slate-50/70 text-[15px] shadow-sm transition-all duration-200 focus:border-[#0A84FF] focus:ring-4 focus:ring-blue-100"
                />

              </div>

              {/* Campo categoría */}
              <div className="space-y-2">

                <Label className="text-[15px] font-semibold text-slate-800">
                  Categoría
                </Label>

                <Select
                  value={form.category}
                  onValueChange={(v) =>
                    setForm({ ...form, category: v })
                  }
                >

                  {/* Trigger select */}
                  <SelectTrigger className="h-14 w-full rounded-2xl border-slate-200 bg-slate-50/70 px-4 text-[15px] shadow-sm transition-all duration-200 focus:border-[#0A84FF] focus:ring-4 focus:ring-blue-100">

                    <SelectValue placeholder="Selecciona una categoría" />

                  </SelectTrigger>

                  {/* Dropdown */}
                  <SelectContent className="rounded-2xl border border-slate-200 bg-white shadow-2xl">

                    {CATEGORIES.map((c) => (

                      <SelectItem
                        key={c.value}
                        value={c.value}
                        className="cursor-pointer rounded-xl py-3 text-[15px] transition-colors focus:bg-blue-50 focus:text-[#0A84FF]"
                      >
                        {c.label}
                      </SelectItem>

                    ))}

                  </SelectContent>

                </Select>

              </div>

              {/* Campo descripción */}
              <div className="space-y-2">

                <Label className="text-[15px] font-semibold text-slate-800">
                  Descripción
                </Label>

                <Textarea
                  placeholder="Describe lo que ofreces, tu experiencia, plazos y precios…"
                  rows={6}
                  value={form.description}
                  onChange={set('description')}
                  required
                  className="min-h-[170px] rounded-2xl border-slate-200 bg-slate-50/70 p-4 text-[15px] shadow-sm transition-all duration-200 focus:border-[#0A84FF] focus:ring-4 focus:ring-blue-100"
                />

              </div>

              {/* Imagen */}
              <div className="space-y-3">

                <Label className="flex items-center gap-2 text-[15px] font-semibold text-slate-800">

                  <ImageIcon className="h-4 w-4" />

                  Imagen de portada

                  <span className="text-xs font-normal text-slate-500">
                    (opcional)
                  </span>

                </Label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {/* Preview imagen */}
                {imagePreview ? (

                  <div className="relative w-full overflow-hidden rounded-3xl border border-slate-200 shadow-lg">

                    <img
                      src={imagePreview}
                      alt="preview"
                      className="h-full w-full object-cover"
                    />

                    {/* Overlay loading */}
                    {imageUploading && (

                      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 text-sm text-white backdrop-blur-sm">

                        <Loader2 className="h-5 w-5 animate-spin" />

                        Subiendo…

                      </div>

                    )}

                    {/* Botón eliminar */}
                    {!imageUploading && (

                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white backdrop-blur-md transition-all hover:bg-black/80"
                      >

                        <X className="h-4 w-4" />

                      </button>

                    )}

                  </div>

                ) : (

                  /* Upload Box */
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="group w-full rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50/50 px-6 py-20 transition-all duration-300 hover:border-[#0A84FF] hover:bg-blue-50/40"
                  >

                    <div className="flex flex-col items-center justify-center text-center">

                      {/* Icono */}
                      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">

                        <Upload className="h-8 w-8 text-[#0A84FF]" />

                      </div>

                      <span className="text-lg font-semibold text-slate-800">
                        Haga clic para subir la imagen
                      </span>

                      <span className="mt-2 text-sm text-slate-500">
                        PNG, JPG, WEBP hasta 10 MB
                      </span>

                    </div>

                  </button>

                )}

                {/* Error imagen */}
                {imageError && (
                  <p className="text-sm text-red-500">
                    {imageError}
                  </p>
                )}

              </div>

              {/* Botón submit */}
              <Button
                type="submit"
                disabled={loading}
                className="h-14 rounded-2xl bg-[#0A84FF] px-8 text-[16px] font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:-translate-y-[1px] hover:bg-[#339CFF] hover:shadow-xl hover:shadow-blue-500/40"
              >

                {loading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}

                Enviar para revisión

              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}