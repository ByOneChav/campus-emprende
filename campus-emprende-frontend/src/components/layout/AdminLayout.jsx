import { Outlet } from 'react-router-dom';
import { useState } from 'react';

import AdminSidebar from '@/pages/admin/AdminSidebar';

import { useAuth } from '@/context/AuthContext';

import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';

import { Menu, X } from 'lucide-react';

export default function AdminLayout() {

  const { user } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const initials = user?.fullName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (

    <div className="flex min-h-screen overflow-hidden bg-slate-50">

      {/* =========================
          MOBILE OVERLAY
      ========================== */}

      {mobileMenuOpen && (

        <div
          className="
            fixed
            inset-0
            z-40
            bg-black/40
            backdrop-blur-sm
            md:hidden
          "
          onClick={() => setMobileMenuOpen(false)}
        />

      )}

      {/* =========================
          SIDEBAR
      ========================== */}

      <div
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          transform
          transition-transform
          duration-300
          md:relative
          md:translate-x-0
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >

        <AdminSidebar />

      </div>

      {/* =========================
          MAIN
      ========================== */}

      <div className="flex flex-col flex-1 min-w-0 w-full">

        {/* =========================
            TOPBAR
        ========================== */}

        <header
          className="
            sticky
            top-0
            z-30
            h-16
            border-b
            bg-white/95
            backdrop-blur
            flex
            items-center
            justify-between
            px-4
            md:px-6
          "
        >

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="
              md:hidden
              flex
              items-center
              justify-center
              h-10
              w-10
              rounded-xl
              border
              border-slate-200
              bg-white
              text-slate-700
              shadow-sm
            "
          >

            <Menu className="h-5 w-5" />

          </button>

          {/* USER INFO */}
          <div className="ml-auto flex items-center gap-3 min-w-0">

            <div className="text-right min-w-0">

              <p className="text-sm font-medium leading-none truncate">
                {user?.fullName}
              </p>

              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {user?.email}
              </p>

            </div>

            <Avatar className="h-8 w-8 shrink-0">

              <AvatarFallback className="bg-primary text-primary-foreground text-xs">

                {initials || 'A'}

              </AvatarFallback>

            </Avatar>

          </div>

        </header>

        {/* =========================
            PAGE CONTENT
        ========================== */}

        <main
          className="
            flex-1
            overflow-x-hidden
            overflow-y-auto
            p-4
            md:p-6
          "
        >

          <Outlet />

        </main>

      </div>

    </div>

  );
}