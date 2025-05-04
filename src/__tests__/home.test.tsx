import { render, screen } from '@testing-library/react';
import Home from '../app/page';

describe('Home', () => {
  it('renders the correct text', () => {
    render(<Home />);
    const heading = screen.getByText(/Hello it is Next-Level Store!/i);
    expect(heading).toBeInTheDocument();
  });
});
