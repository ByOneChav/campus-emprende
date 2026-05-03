import { Navigate, useLocation } from 'react-router-dom'; // Importa herramientas para redirección y ubicación actual
import { useAuth } from '@/context/AuthContext'; // Hook de autenticación (usa Redux por debajo)

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth(); // Obtiene estado de autenticación y carga
  const location = useLocation(); // Obtiene la ruta actual (para redirigir después del login)

  if (loading) return null; // Mientras se inicializa el estado (ej: leyendo localStorage), no renderiza nada
  if (!isAuthenticated) return <Navigate to="/auth/login" state={{ from: location }} replace />; // Si no está autenticado, redirige al login
  return children; // Si está autenticado, renderiza la página protegida
}