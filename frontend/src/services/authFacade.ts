import { BehaviorSubject } from 'rxjs';
import api from './api';

export interface User {
  username: string;
  roles: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
};

const authSubject = new BehaviorSubject<AuthState>(initialState);

export const authService = {
  auth$: authSubject.asObservable(),

  get value() {
    return authSubject.value;
  },

  login: async (username: string, password: string): Promise<void> => {
    const response = await api.post('/auth/login', { username, password });
    const { accessToken, refreshToken, user } = response.data;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    // Decodificar token para pegar user se o backend não retornar o objeto user completo
    // Aqui assumimos que o backend retorna user info no login response ou extraimos do token
    // Simplificação: backend retorna user
    
    authSubject.next({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    authSubject.next({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  refreshToken: async (): Promise<string | null> => {
    const { refreshToken } = authSubject.value;
    if (!refreshToken) return null;

    try {
      const response = await api.post('/auth/refresh', { refreshToken });
      const { accessToken: newAccessToken } = response.data;
      
      localStorage.setItem('accessToken', newAccessToken);
      
      authSubject.next({
        ...authSubject.value,
        accessToken: newAccessToken,
      });
      
      return newAccessToken;
    } catch {
      authService.logout();
      return null;
    }
  }
};

// Interceptor para injetar token e refresh
api.interceptors.request.use((config) => {
  const token = authService.value.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await authService.refreshToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);
