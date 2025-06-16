import { render, screen, waitFor, act } from '@testing-library/react';
import RegisterPage from '../app/register/page';

describe('RegisterPage', () => {
  it('renders the page and contains RegisterForm', async () => {
    act(() => {
      render(<RegisterPage />);
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
    });
  });
});
