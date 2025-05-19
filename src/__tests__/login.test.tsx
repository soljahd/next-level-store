import { render, screen } from '@testing-library/react';
import LoginPage from '../app/login/page';

describe('LoginPage', () => {
  it('renders the page and contains LoginForm', () => {
    render(<LoginPage />);
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });
});
