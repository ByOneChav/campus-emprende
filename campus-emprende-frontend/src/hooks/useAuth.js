import { useSelector, useDispatch } from 'react-redux';
import { loginThunk, signupThunk } from '@/store/auth/authThunk';
import { logout as logoutAction } from '@/store/auth/authSlice';

function buildAxiosLikeError(payload) {
  const err = new Error(payload?.message ?? 'Request failed');
  err.response = { data: payload };
  return err;
}

export function useAuth() {
  const dispatch = useDispatch();
  const { user, token, loading } = useSelector((state) => state.auth);

  const login = async (email, password) => {
    const result = await dispatch(loginThunk({ email, password }));
    if (loginThunk.rejected.match(result)) throw buildAxiosLikeError(result.payload);
    return result.payload;
  };

  const signup = async (formData) => {
    const result = await dispatch(signupThunk(formData));
    if (signupThunk.rejected.match(result)) throw buildAxiosLikeError(result.payload);
    return result.payload;
  };

  const logout = () => dispatch(logoutAction());

  return {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'ROLE_ADMIN',
    login,
    signup,
    logout,
  };
}
