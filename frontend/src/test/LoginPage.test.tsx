import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoginPage from '../pages/LoginPage';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../hooks/useAuth';

describe('LoginPage', () => {
  it('renders correctly', () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </AuthProvider>
    );
    expect(screen.getByText('SOUNDWAVE')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Seu nome de usuário')).toBeInTheDocument();
  });
});
