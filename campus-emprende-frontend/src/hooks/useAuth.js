import { useSelector, useDispatch } from 'react-redux'; // Hooks de Redux para acceder al estado y despachar acciones
import { loginThunk, signupThunk } from '@/store/auth/authThunk'; // Thunks para llamadas async al backend (login y registro)
import { logout as logoutAction } from '@/store/auth/authSlice'; // Acción síncrona para cerrar sesión

// Función auxiliar para construir un error con formato similar a axios
function buildAxiosLikeError(payload) {
  const err = new Error(payload?.message ?? 'Request failed'); // Crea un error con mensaje del backend o genérico
  err.response = { data: payload }; // Simula la estructura de error de axios (response.data)
  return err;
}

// Hook personalizado para manejar autenticación en toda la app
export function useAuth() {
  const dispatch = useDispatch(); // Permite ejecutar acciones (thunks o actions)
  const { user, token, loading } = useSelector((state) => state.auth); // Obtiene el estado de auth desde Redux

  // Función para login que ejecuta el thunk correspondiente
  const login = async (email, password) => {
    const result = await dispatch(loginThunk({ email, password })); // Llama al thunk que hace la petición al backend
    if (loginThunk.rejected.match(result)) throw buildAxiosLikeError(result.payload); // Si falla, lanza error tipo axios
    return result.payload; // Retorna la respuesta exitosa del backend
  };

  // Función para registro de usuario
  const signup = async (formData) => {
    const result = await dispatch(signupThunk(formData)); // Ejecuta thunk de registro
    if (signupThunk.rejected.match(result)) throw buildAxiosLikeError(result.payload); // Manejo de error
    return result.payload; // Retorna datos exitosos
  };

  // Función para cerrar sesión
  const logout = () => dispatch(logoutAction()); // Limpia el estado de auth en Redux

  // Retorna todo lo necesario para usar autenticación en componentes
  return {
    user, // Información del usuario autenticado
    token, // JWT almacenado en el estado global
    loading, // Estado de carga (para spinners, etc.)
    isAuthenticated: !!token, // Indica si el usuario está autenticado
    isAdmin: user?.role === 'ROLE_ADMIN', // Verifica si el usuario tiene rol ADMIN
    login, // Función de login
    signup, // Función de registro
    logout, // Función de logout
  };
}