import axios from 'axios'; // Importa la librería axios para hacer peticiones HTTP al backend


// Se crea una instancia personalizada de Axios
// para reutilizar configuración en todas las peticiones HTTP
const client = axios.create({

  // URL base del backend Spring Boot
  // Todas las solicitudes partirán desde esta URL
  baseURL: 'http://localhost:8080',
});

// Interceptor que se ejecuta ANTES de cada petición HTTP
client.interceptors.request.use((config) => {

  // Verifica si la petición NO tiene la propiedad skipAuth
  // Si no existe, entonces intentará enviar el JWT
  if (!config.skipAuth) {

    // Obtiene el token JWT guardado en el navegador
    const token = localStorage.getItem('jwt');

    // Si existe token...
    if (token) {

      // Agrega el token al header Authorization
      // para autenticar al usuario en el backend
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // Retorna la configuración modificada de la petición
  return config;
});

// Exporta la instancia personalizada de Axios
// para poder usarla en todo el proyecto
export default client;
