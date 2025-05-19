import { render, screen, fireEvent } from '@testing-library/react';
import RegisterForm from '../components/register-form';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock('@/lib/store/auth-store', () => ({
  useAuthStore: () => ({ setLoginState: jest.fn() }),
}));
jest.mock('@/lib/commercetools/auth', () => ({
  registerCustomer: jest.fn(() => Promise.resolve()),
  loginCustomer: jest.fn(() => Promise.resolve()),
}));
jest.mock('notistack', () => ({
  enqueueSnackbar: jest.fn(),
}));

describe('RegisterForm', () => {
  test('renders form elements and submits', () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText(/First name\*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last name\*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email\*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password\*/i)).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: /Register/i });
    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton);
  });
});
