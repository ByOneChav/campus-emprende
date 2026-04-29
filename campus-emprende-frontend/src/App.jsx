import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Toaster } from '@/components/ui/sonner';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import AdminRoute from '@/components/layout/AdminRoute';

import HomePage from '@/pages/home/HomePage';
import NotFoundPage from '@/pages/NotFoundPage';

import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';

import MyProfilePage from '@/pages/profile/MyProfilePage';
import PublicProfilePage from '@/pages/profile/PublicProfilePage';

import ServicesPage from '@/pages/services/ServicesPage';
import ServiceDetailPage from '@/pages/services/ServiceDetailPage';
import CreateServicePage from '@/pages/services/CreateServicePage';
import EditServicePage from '@/pages/services/EditServicePage';

import DashboardPage from '@/pages/dashboard/DashboardPage';
import RequestsPage from '@/pages/requests/RequestsPage';

import AdminLayout from '@/components/layout/AdminLayout';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminAllServicesPage from '@/pages/admin/AdminAllServicesPage';
import AdminServicesPage from '@/pages/admin/AdminServicesPage';
import AdminActiveServicesPage from '@/pages/admin/AdminActiveServicesPage';
import AdminRejectedServicesPage from '@/pages/admin/AdminRejectedServicesPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminStudentsPage from '@/pages/admin/AdminStudentsPage';
import AdminReportsPage from '@/pages/admin/AdminReportsPage';
import AdminReviewsPage from '@/pages/admin/AdminReviewsPage';
import AdminGoodReviewsPage from '@/pages/admin/AdminGoodReviewsPage';
import AdminBadReviewsPage from '@/pages/admin/AdminBadReviewsPage';
import { initialize } from './store/auth/authSlice';

function AppInitializer() {
  const dispatch = useDispatch();
  useEffect(() => { dispatch(initialize()); }, [dispatch]);
  return null;
}

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInitializer />
      <Routes>
        {/* Auth pages — no navbar/footer */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route path="/profiles/:userId" element={<PublicProfilePage />} />

          {/* Protected — any authenticated user */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/profiles/me" element={<ProtectedRoute><MyProfilePage /></ProtectedRoute>} />
          <Route path="/services/create" element={<ProtectedRoute><CreateServicePage /></ProtectedRoute>} />
          <Route path="/services/:id/edit" element={<ProtectedRoute><EditServicePage /></ProtectedRoute>} />
          <Route path="/requests" element={<ProtectedRoute><RequestsPage /></ProtectedRoute>} />


          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin — separate layout with sidebar */}
        <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/services" element={<AdminAllServicesPage />} />
          <Route path="/admin/services/pending" element={<AdminServicesPage />} />
          <Route path="/admin/services/active" element={<AdminActiveServicesPage />} />
          <Route path="/admin/services/rejected" element={<AdminRejectedServicesPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/users/students" element={<AdminStudentsPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
          <Route path="/admin/reviews" element={<AdminReviewsPage />} />
          <Route path="/admin/reviews/good" element={<AdminGoodReviewsPage />} />
          <Route path="/admin/reviews/bad" element={<AdminBadReviewsPage />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
