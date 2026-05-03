import { createAsyncThunk } from '@reduxjs/toolkit'; // Permite crear acciones asíncronas (thunks) en Redux
import * as authApi from '@/api/auth'; // Importa todas las funciones del archivo auth.js (login, signup, etc.)

// Thunk para iniciar sesión
export const loginThunk = createAsyncThunk(
  'auth/login', // Nombre de la acción en Redux
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await authApi.login(email, password); // Llama al endpoint /auth/login del backend
      localStorage.setItem('jwt', data.jwt); // Guarda el token JWT en el navegador
      localStorage.setItem('user', JSON.stringify(data.user)); // Guarda el usuario en formato string
      return data; // Retorna los datos al reducer (authSlice)
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { message: 'error de inicio de sesion' }); // Maneja errores del backend
    }
  }
);

// Thunk para registrar un usuario
export const signupThunk = createAsyncThunk(
  'auth/signup', // Nombre de la acción en Redux
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await authApi.signup(formData); // Llama al endpoint /auth/signup
      localStorage.setItem('jwt', data.jwt); // Guarda el token JWT
      localStorage.setItem('user', JSON.stringify(data.user)); // Guarda el usuario
      return data; // Retorna datos al reducer
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { message: 'Error de registro' }); // Manejo de errores
    }
  }
);