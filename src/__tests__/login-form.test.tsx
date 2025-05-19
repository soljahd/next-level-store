import { render, screen } from '@testing-library/react';
import React from 'react';
import LoginForm from '../components/login-form';

// Мокаем модули
jest.mock('@/lib/commercetools/auth', () => ({
  loginCustomer: jest.fn(),
}));
jest.mock('@/lib/store/auth-store', () => ({
  useAuthStore: () => ({ setLoginState: jest.fn() }),
}));
jest.mock('notistack', () => ({
  enqueueSnackbar: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe('test for LoginForm', () => {
  test('the form and login button are displayed', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/Email\*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password\*/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });
});
