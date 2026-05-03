import { createSlice } from "@reduxjs/toolkit"; // Importa la función para crear slices de Redux Toolkit
import { loginThunk, signupThunk } from "./authThunk"; // Importa los thunks para login y registro


// Crea el slice de autenticación (estado + reducers)
const authSlice = createSlice({
  name: 'auth', // Nombre del slice en el store global
  initialState: {
    user: null, // Información del usuario autenticado
    token: null, // JWT del usuario
    loading: true, // Estado de carga inicial (útil para inicializar sesión)
  },
  reducers: {
    // Inicializa el estado leyendo datos desde localStorage
    initialize(state) {
      const token = localStorage.getItem('jwt'); // Obtiene el token almacenado
      const user = localStorage.getItem('user'); // Obtiene el usuario almacenado
      if (token && user) {
        state.token = token; // Restaura el token en el estado
        state.user = JSON.parse(user); // Convierte el usuario de string a objeto
      }
      state.loading = false; // Finaliza el estado de carga
    },
    // Cierra sesión del usuario
    logout(state) {
      localStorage.removeItem('jwt'); // Elimina el token del almacenamiento
      localStorage.removeItem('user'); // Elimina el usuario del almacenamiento
      state.user = null; // Limpia el usuario del estado
      state.token = null; // Limpia el token del estado
    },
  },
  extraReducers: (builder) => {
    builder
      // Maneja el caso cuando el login es exitoso
      .addCase(loginThunk.fulfilled, (state, { payload }) => {
        state.user = payload.user; // Guarda el usuario recibido del backend
        state.token = payload.jwt; // Guarda el token JWT recibido
      })
      // Maneja el caso cuando el registro es exitoso
      .addCase(signupThunk.fulfilled, (state, { payload }) => {
        state.user = payload.user; // Guarda el usuario nuevo
        state.token = payload.jwt; // Guarda el token JWT
      });
  },
});

// Exporta las acciones (initialize y logout)
export const { initialize, logout } = authSlice.actions;

// Exporta el reducer para usarlo en el store global
export default authSlice.reducer;