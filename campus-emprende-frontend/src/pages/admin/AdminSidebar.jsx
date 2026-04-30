import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  CheckCircle,
  Clock,
  XCircle,
  Users,
  GraduationCap,
  BarChart3,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  User,
  LogOut,
  GraduationCap as Logo,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const navigation = [
  {
    title: 'Descripción general',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, end: true },
    ],
  },
  {
    title: 'Servicios',
    items: [
      { name: 'Todos los servicios', href: '/admin/services', icon: Briefcase, end: true },
      { name: 'Servicios activos', href: '/admin/services/active', icon: CheckCircle },
      { name: 'Servicios pendientes', href: '/admin/services/pending', icon: Clock },
      { name: 'Servicios rechazados', href: '/admin/services/rejected', icon: XCircle },
    ],
  },
  {
    title: 'Usuarios',
    items: [
      { name: 'Todos los usuarios', href: '/admin/users', icon: Users },
      { name: 'Estudiantes', href: '/admin/users/students', icon: GraduationCap },
    ],
  },
  {
    title: 'Informes y reseñas',
    items: [
      { name: 'Informes', href: '/admin/reports', icon: BarChart3 },
      { name: 'Reseñas', href: '/admin/reviews', icon: MessageSquare, end: true },
      { name: 'Buenas críticas', href: '/admin/reviews/good', icon: ThumbsUp },
      { name: 'Malas críticas', href: '/admin/reviews/bad', icon: ThumbsDown },
    ],
  },
  {
    title: 'Cuenta',
    items: [
      { name: 'Perfil', href: '/profiles/me', icon: User },
    ],
  },
];

export default function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-background border-r shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-16 border-b font-bold text-lg">
        <Logo className="h-5 w-5 text-primary" />
        <span>Panel de administración</span>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {navigation.map((group) => (
          <div key={group.title}>
            <p className="px-2 mb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map(({ name, href, icon: Icon, end }) => (
                <li key={name}>
                  <NavLink
                    to={href}
                    end={end}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2.5 rounded-md px-2 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
