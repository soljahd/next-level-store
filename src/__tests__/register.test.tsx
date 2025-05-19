import { render, screen } from '@testing-library/react';
import RegisterPage from '../app/register/page';

describe('RegisterPage', () => {
  it('renders the page and contains RegisterForm', () => {
    render(<RegisterPage />);
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
  });
});
