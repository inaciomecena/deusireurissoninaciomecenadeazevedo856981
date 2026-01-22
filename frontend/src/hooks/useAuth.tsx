import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, type User } from '../services/authFacade';
import { Subscription } from 'rxjs';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (u: string, p: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(authService.value.user);
  const [isAuthenticated, setIsAuthenticated] = useState(authService.value.isAuthenticated);

  useEffect(() => {
    const sub: Subscription = authService.auth$.subscribe((state) => {
      setUser(state.user);
      setIsAuthenticated(state.isAuthenticated);
    });
    return () => sub.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login: authService.login, 
      logout: authService.logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
