import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import {
  Code2, Palette, Cpu, BookOpen, Camera, Layers,
  Star, Shield, Zap, GraduationCap, ArrowRight
} from 'lucide-react';

const categories = [
  { icon: Code2, label: 'Desarrollo web', color: 'bg-blue-100 text-blue-700' },
  { icon: Palette, label: 'Diseño Gráfico', color: 'bg-pink-100 text-pink-700' },
  { icon: Cpu, label: 'Soporte técnico', color: 'bg-purple-100 text-purple-700' },
  { icon: BookOpen, label: 'Tutoría', color: 'bg-green-100 text-green-700' },
  { icon: Camera, label: 'Fotografía', color: 'bg-orange-100 text-orange-700' },
  { icon: Layers, label: 'Otro', color: 'bg-gray-100 text-gray-700' },
];

const features = [
  { icon: Shield, title: 'Estudiantes verificados', desc: 'Todos los proveedores son estudiantes universitarios verificados con correos electrónicos institucionales.' },
  { icon: Star, title: 'Revisiones por pares', desc: 'Lee las opiniones auténticas de compañeros de clase que han utilizado cada servicio.' },
  { icon: Zap, title: 'Solicitudes rápidas', desc: 'Envía una solicitud de servicio en segundos y obtén una respuesta el mismo día.' },
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-muted/30 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge variant="secondary" className="mb-2">Mercado estudiantil
</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Contrata talento de <span className="text-primary">tu campus</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Explora los servicios que ofrecen otros estudiantes: desarrollo web, diseño, tutorías, fotografía y más.
            Contrata o ofrece tus propias habilidades.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button size="lg" asChild>
              <Link to="/services">Explorar servicios <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            {!isAuthenticated && (
              <Button size="lg" variant="outline" asChild>
                <Link to="/auth/register">Ofrezca sus habilidades</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Navegar por categoría</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map(({ icon: Icon, label, color }) => (
              <Link
                key={label}
                to={`/services?category=${label.toUpperCase().replace(' ', '_')}`}
                className="group"
              >
                <Card className="hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer">
                  <CardContent className="flex flex-col items-center gap-2 py-6">
                    <div className={`p-3 rounded-full ${color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium text-center">{label}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">¿Por qué Campus Emprende?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-full bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-muted-foreground text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="py-20 px-4 bg-primary text-primary-foreground">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <GraduationCap className="h-12 w-12 mx-auto opacity-80" />
            <h2 className="text-3xl font-bold">¿Listo para empezar?</h2>
            <p className="opacity-80">Únete a miles de estudiantes que compran y venden servicios en el campus.</p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/auth/register">Crear cuenta gratuita</Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
