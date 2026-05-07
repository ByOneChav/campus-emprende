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
  Sparkles,
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

    <aside
      className="
        relative
        flex
        flex-col
        w-72
        min-h-screen
        shrink-0
        border-r
        border-slate-200
        bg-white
        shadow-xl
        shadow-slate-200/40
        overflow-hidden
      "
    >

      {/* Glow decorativo */}
      <div className="absolute -top-20 left-[-60px] h-56 w-56 rounded-full bg-blue-100 blur-3xl opacity-70" />

      {/* Barra superior */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#0A84FF] via-[#5AA9FF] to-[#B7D8FF]" />

      {/* =========================
          HEADER
      ========================== */}

      <div className="relative px-6 py-7 border-b border-slate-100">

        {/* Badge */}
        <div
          className="
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-blue-200
            bg-blue-50
            px-4
            py-1.5
            text-xs
            font-semibold
            text-[#0A84FF]
            shadow-sm
          "
        >

          <Sparkles className="h-3.5 w-3.5" />

          Administración

        </div>

        {/* Logo + texto */}
        <div className="mt-5 flex items-center gap-4">

          {/* Icon */}
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-gradient-to-br
              from-[#0A84FF]
              to-[#5AA9FF]
              shadow-lg
              shadow-blue-500/30
            "
          >

            <Logo className="h-7 w-7 text-white" />

          </div>

          {/* Texto */}
          <div>

            <h1
              className="
                text-2xl
                font-black
                leading-tight
                tracking-tight
                text-slate-900
              "
            >
              Panel de administración
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Campus Emprende
            </p>

          </div>

        </div>

      </div>

      {/* =========================
          NAVIGATION
      ========================== */}

      <nav
        className="
          relative
          flex-1
          overflow-y-auto
          px-4
          py-6
          space-y-5
        "
      >

        {navigation.map((group) => (

          <div key={group.title}>

            {/* Título sección */}
            <p
              className="
                px-3
                mb-3
                text-xs
                font-bold
                uppercase
                tracking-[0.14em]
                text-slate-400
              "
            >
              {group.title}
            </p>

            {/* Links */}
            <ul className="space-y-1">

              {group.items.map(({ name, href, icon: Icon, end }) => (

                <li key={name}>

                  <NavLink
                    to={href}
                    end={end}

                    className={({ isActive }) =>
                      cn(

                        `
                          group
                          relative
                          flex
                          items-center
                          gap-3
                          overflow-hidden
                          rounded-2xl
                          px-4
                          py-2.5
                          text-[15px]
                          font-medium
                          transition-all
                          duration-300
                        `,

                        isActive
                          ? `
                            bg-gradient-to-r
                            from-[#0A84FF]
                            to-[#339CFF]
                            text-white
                            shadow-lg
                            shadow-blue-500/30
                          `
                          : `
                            text-slate-600
                            hover:bg-slate-100
                            hover:text-slate-900
                          `
                      )
                    }
                  >

                    {/* Icon box */}
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-white/10
                        transition-all
                        duration-300
                        group-hover:scale-105
                      "
                    >

                      <Icon className="h-5 w-5 shrink-0" />

                    </div>

                    {/* Label */}
                    <span className="truncate">
                      {name}
                    </span>

                  </NavLink>

                </li>

              ))}

            </ul>

          </div>

        ))}

      </nav>

      {/* =========================
          FOOTER
      ========================== */}

      <div className="border-t border-slate-100 p-4">

        <button
          onClick={handleLogout}

          className="
            group
            flex
            w-full
            items-center
            gap-3
            rounded-2xl
            px-4
            py-2.5
            text-[15px]
            font-medium
            text-slate-600
            transition-all
            duration-300
            hover:bg-red-50
            hover:text-red-600
          "
        >

          {/* Icon */}
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-slate-100
              transition-all
              duration-300
              group-hover:bg-red-100
            "
          >

            <LogOut className="h-5 w-5 shrink-0" />

          </div>

          {/* Texto */}
          <span>
            Cerrar sesión
          </span>

        </button>

      </div>

    </aside>

  );
}