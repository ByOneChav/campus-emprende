import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { GraduationCap, LayoutDashboard, LogOut, User, ShieldCheck } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.fullName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="navbar-glass">
      <div className="navbar-container max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 navbar-logo">
          <GraduationCap className="h-10 w-10 text-blue-700 drop-shadow-sm" />
          Campus Emprende
        </Link>

        {/* NAV */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/services" className="navbar-link">
            Explorar servicios
          </Link>

          {isAuthenticated && (
            <>
              <Link to="/dashboard" className="navbar-link">
                Dashboard
              </Link>

              <Link to="/requests" className="navbar-link">
                Mis solicitudes
              </Link>

              {isAdmin && (
                <Link to="/admin" className="navbar-link flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4" /> Admin
                </Link>
              )}
            </>
          )}
        </nav>

        {/* USER */}
        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <Button variant="ghost" asChild>
                <Link to="/auth/login">Acceso</Link>
              </Button>
              <Button asChild>
                <Link to="/auth/register">Registro</Link>
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="navbar-avatar h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-700 text-white text-xs">
                      {initials || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              {/* 🔥 FIX DEL BUG DEL DROPDOWN */}
              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-56 z-[9999]"
              >
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.fullName}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" /> Mi perfil
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                </DropdownMenuItem>

                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" /> Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-500 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" /> Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}