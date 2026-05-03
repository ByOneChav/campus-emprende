import { Navigate } from 'react-router-dom'; // Importa componente para redireccionar rutas
import { useAuth } from '@/context/AuthContext'; // Hook de autenticación (usa Redux internamente)

export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth(); // Obtiene estado de autenticación, rol y carga

  if (loading) return null; // Mientras se carga el estado (ej: desde localStorage), no renderiza nada
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />; // Si no está logueado, redirige al login
  if (!isAdmin) return <Navigate to="/dashboard" replace />; // Si no es ADMIN, lo manda al dashboard
  return children; // Si es ADMIN, permite acceso a la ruta protegida
}