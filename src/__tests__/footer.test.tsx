import { render, screen } from '@testing-library/react';
import Footer from '../components/footer';

describe('Footer component', () => {
  it('renders copyright text', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2025 Next-Level Store/i)).toBeInTheDocument();
  });
});
