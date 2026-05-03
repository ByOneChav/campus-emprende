import { useEffect } from 'react'; // Hook para ejecutar lógica al montar componentes
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'; // Librería de enrutamiento
import { useDispatch } from 'react-redux'; // Hook para despachar acciones a Redux

import { Toaster } from '@/components/ui/sonner'; // Componente para mostrar notificaciones (toasts)

import Navbar from '@/components/layout/Navbar'; // Barra de navegación superior
import Footer from '@/components/layout/Footer'; // Pie de página
import ProtectedRoute from '@/components/layout/ProtectedRoute'; // Protege rutas autenticadas
import AdminRoute from '@/components/layout/AdminRoute'; // Protege rutas solo ADMIN

import HomePage from '@/pages/home/HomePage'; // Página principal
import NotFoundPage from '@/pages/NotFoundPage'; // Página 404

import LoginPage from '@/pages/auth/LoginPage'; // Login
import RegisterPage from '@/pages/auth/RegisterPage'; // Registro
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage'; // Verificación de correo
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'; // Recuperar contraseña
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage'; // Resetear contraseña

import MyProfilePage from '@/pages/profile/MyProfilePage'; // Perfil propio
import PublicProfilePage from '@/pages/profile/PublicProfilePage'; // Perfil público

import ServicesPage from '@/pages/services/ServicesPage'; // Lista de servicios
import ServiceDetailPage from '@/pages/services/ServiceDetailPage'; // Detalle de servicio
import CreateServicePage from '@/pages/services/CreateServicePage'; // Crear servicio
import EditServicePage from '@/pages/services/EditServicePage'; // Editar servicio

import DashboardPage from '@/pages/dashboard/DashboardPage'; // Dashboard usuario
import RequestsPage from '@/pages/requests/RequestsPage'; // Solicitudes

import AdminLayout from '@/components/layout/AdminLayout'; // Layout especial para admin (con sidebar)
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'; // Dashboard admin
import AdminAllServicesPage from '@/pages/admin/AdminAllServicesPage'; // Todos los servicios
import AdminServicesPage from '@/pages/admin/AdminServicesPage'; // Servicios pendientes
import AdminActiveServicesPage from '@/pages/admin/AdminActiveServicesPage'; // Servicios activos
import AdminRejectedServicesPage from '@/pages/admin/AdminRejectedServicesPage'; // Servicios rechazados
import AdminUsersPage from '@/pages/admin/AdminUsersPage'; // Gestión de usuarios
import AdminStudentsPage from '@/pages/admin/AdminStudentsPage'; // Estudiantes
import AdminReportsPage from '@/pages/admin/AdminReportsPage'; // Reportes
import AdminReviewsPage from '@/pages/admin/AdminReviewsPage'; // Reseñas
import AdminGoodReviewsPage from '@/pages/admin/AdminGoodReviewsPage'; // Reseñas positivas
import AdminBadReviewsPage from '@/pages/admin/AdminBadReviewsPage'; // Reseñas negativas
import { initialize } from './store/auth/authSlice'; // Acción para inicializar auth desde localStorage

// Componente que inicializa el estado de autenticación al cargar la app
function AppInitializer() {
  const dispatch = useDispatch(); // Permite ejecutar acciones Redux
  useEffect(() => { dispatch(initialize()); }, [dispatch]); // Ejecuta initialize al montar
  return null; // No renderiza nada
}

// Layout principal con navbar y footer
function Layout() {
  return (
    <div className="min-h-screen flex flex-col"> {/* Contenedor principal */}
      <Navbar /> {/* Barra superior */}
      <main className="flex-1"> {/* Contenido dinámico */}
        <Outlet /> {/* Aquí se renderizan las páginas */}
      </main>
      <Footer /> {/* Pie de página */}
    </div>
  );
}

// Componente principal de la app
export default function App() {
  return (
    <BrowserRouter> {/* Habilita el sistema de rutas */}
      <AppInitializer /> {/* Inicializa el estado de auth */}
      <Routes> {/* Define todas las rutas */}

        {/* Auth pages — no navbar/footer */}
        <Route path="/auth/login" element={<LoginPage />} /> {/* Ruta login */}
        <Route path="/auth/register" element={<RegisterPage />} /> {/* Ruta registro */}
        <Route path="/auth/verify-email" element={<VerifyEmailPage />} /> {/* Verificar email */}
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} /> {/* Recuperar contraseña */}
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} /> {/* Resetear contraseña */}

        <Route element={<Layout />}> {/* Rutas con layout (navbar + footer) */}
          <Route path="/" element={<HomePage />} /> {/* Home */}
          <Route path="/services" element={<ServicesPage />} /> {/* Lista de servicios */}
          <Route path="/services/:id" element={<ServiceDetailPage />} /> {/* Detalle */}
          <Route path="/profiles/:userId" element={<PublicProfilePage />} /> {/* Perfil público */}

          {/* Protected — any authenticated user */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} /> {/* Dashboard protegido */}
          <Route path="/profiles/me" element={<ProtectedRoute><MyProfilePage /></ProtectedRoute>} /> {/* Perfil propio protegido */}
          <Route path="/services/create" element={<ProtectedRoute><CreateServicePage /></ProtectedRoute>} /> {/* Crear servicio */}
          <Route path="/services/:id/edit" element={<ProtectedRoute><EditServicePage /></ProtectedRoute>} /> {/* Editar servicio */}
          <Route path="/requests" element={<ProtectedRoute><RequestsPage /></ProtectedRoute>} /> {/* Solicitudes */}

          <Route path="*" element={<NotFoundPage />} /> {/* Ruta 404 */}
        </Route>

        {/* Admin — separate layout with sidebar */}
        <Route element={<AdminRoute><AdminLayout /></AdminRoute>}> {/* Protege todo el layout admin */}
          <Route path="/admin" element={<AdminDashboardPage />} /> {/* Dashboard admin */}
          <Route path="/admin/services" element={<AdminAllServicesPage />} /> {/* Servicios */}
          <Route path="/admin/services/pending" element={<AdminServicesPage />} /> {/* Pendientes */}
          <Route path="/admin/services/active" element={<AdminActiveServicesPage />} /> {/* Activos */}
          <Route path="/admin/services/rejected" element={<AdminRejectedServicesPage />} /> {/* Rechazados */}
          <Route path="/admin/users" element={<AdminUsersPage />} /> {/* Usuarios */}
          <Route path="/admin/users/students" element={<AdminStudentsPage />} /> {/* Estudiantes */}
          <Route path="/admin/reports" element={<AdminReportsPage />} /> {/* Reportes */}
          <Route path="/admin/reviews" element={<AdminReviewsPage />} /> {/* Reseñas */}
          <Route path="/admin/reviews/good" element={<AdminGoodReviewsPage />} /> {/* Buenas reseñas */}
          <Route path="/admin/reviews/bad" element={<AdminBadReviewsPage />} /> {/* Malas reseñas */}
        </Route>

      </Routes>
      <Toaster /> {/* Componente global de notificaciones */}
    </BrowserRouter>
  );
}