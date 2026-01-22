import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './hooks/useAuth';
import { PrivateRoute } from './components/PrivateRoute';
import { NotificationListener } from './components/NotificationListener';

import { Layout } from './components/Layout';

// Lazy loading das outras páginas
const ArtistasListPage = React.lazy(() => import('./pages/ArtistasListPage'));
const ArtistaDetailPage = React.lazy(() => import('./pages/ArtistaDetailPage'));
const ArtistaFormPage = React.lazy(() => import('./pages/ArtistaFormPage'));

import React, { Suspense } from 'react';

const Loading = () => <div className="p-4 text-center text-neon-blue">Carregando...</div>;

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NotificationListener />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Navigate to="/artistas" replace />} />
                <Route path="/artistas" element={<ArtistasListPage />} />
                <Route path="/artistas/novo" element={<ArtistaFormPage />} />
                <Route path="/artistas/:id" element={<ArtistaDetailPage />} />
                <Route path="/artistas/:id/editar" element={<ArtistaFormPage />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
