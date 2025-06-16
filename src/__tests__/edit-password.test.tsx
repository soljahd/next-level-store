import React from 'react';
import { render, screen } from '@testing-library/react';
import EditPassword from '@/components/profile/edit-password';

jest.mock('@/lib/commercetools/profile', () => ({
  changeMyPassword: jest.fn(),
}));
jest.mock('@/lib/commercetools/auth', () => ({
  loginCustomer: jest.fn(),
  logoutCustomer: jest.fn(),
}));
jest.mock('notistack', () => ({
  enqueueSnackbar: jest.fn(),
}));

jest.mock('@/lib/store/auth-store', () => ({
  useAuthStore: () => ({
    setLoginState: jest.fn(),
    user: { email: 'test@example.com', password: 'oldPass' },
  }),
}));

describe('EditPassword component', () => {
  const mockSetProfileState = jest.fn();
  const mockSetEditingMode = jest.fn();

  it('renders title', () => {
    render(<EditPassword setProfileState={mockSetProfileState} setEditingMode={mockSetEditingMode} />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Change Password');
    expect(screen.getByLabelText(/Current password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/New password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Repeat password/i)).toBeInTheDocument();
  });
});
