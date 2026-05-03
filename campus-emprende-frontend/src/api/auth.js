import client from './client'; // Importa la instancia de axios configurada (con baseURL y JWT interceptor)

// Configuración para indicar que estas peticiones NO requieren token (login, registro, etc.)
const noAuth = { skipAuth: true };

// Función para iniciar sesión enviando email y password al backend
export const login = (email, password) =>
  client.post('/auth/login', { email, password }, noAuth);

// Función para registrar un nuevo usuario enviando los datos al backend
export const signup = (data) =>
  client.post('/auth/signup', data, noAuth);

// Función para solicitar recuperación de contraseña enviando el email
export const forgotPassword = (email) =>
  client.post('/auth/forgot-password', { email }, noAuth);

// Función para resetear la contraseña usando token y nueva password
export const resetPassword = (token, password) =>
  client.post('/auth/reset-password', { token, password }, noAuth);

// Función para verificar el email del usuario mediante un token
export const verifyEmail = (token) =>
  client.get('/auth/verify-email', { params: { token }, ...noAuth });

// Función para reenviar el correo de verificación
export const resendVerification = (email) =>
  client.post('/auth/resend-verification', null, { params: { email }, ...noAuth });