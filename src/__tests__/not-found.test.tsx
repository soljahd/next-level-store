import { render, screen } from '@testing-library/react';
import NotFound from '../app/not-found';

describe('NotFound page', () => {
  it('renders the 404 message and return link', () => {
    render(<NotFound />);

    expect(screen.getByText('404')).toBeInTheDocument();

    expect(screen.getByText('Page Not Found')).toBeInTheDocument();

    expect(screen.getByText(/The page you're looking for doesn't exist or has been moved./i)).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /Return to Home/i })).toBeInTheDocument();
  });
});
