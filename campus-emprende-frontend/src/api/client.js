import axios from 'axios'; // Importa la librería axios para hacer peticiones HTTP al backend

// Crea una instancia personalizada de axios con configuración base
const client = axios.create({
  baseURL: 'http://localhost:8080', // URL base de tu backend Spring Boot
});

// Interceptor que se ejecuta antes de cada petición HTTP
client.interceptors.request.use((config) => {
  if (!config.skipAuth) { // Verifica si la petición requiere autenticación
    const token = localStorage.getItem('jwt'); // Obtiene el token JWT guardado en el navegador
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Agrega el token al header Authorization
    }
  }
  return config; // Retorna la configuración modificada de la petición
});

export default client; // Exporta la instancia para usarla en otros archivos de api