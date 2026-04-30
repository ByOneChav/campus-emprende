import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          <span className="font-semibold text-foreground">Campus Emprende</span>
          <span>— mercado de servicios estudiantiles</span>
        </div>
        <nav className="flex gap-6">
          <Link to="/services" className="hover:text-foreground transition-colors">Navegar</Link>
          <Link to="/auth/login" className="hover:text-foreground transition-colors">Acceso</Link>
          <Link to="/auth/register" className="hover:text-foreground transition-colors">Registro</Link>
        </nav>
        <p>© {new Date().getFullYear()} Campus Emprende</p>
      </div>
    </footer>
  );
}
