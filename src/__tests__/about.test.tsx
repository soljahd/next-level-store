import { render, screen } from '@testing-library/react';
import About from '../app/about/page';

describe('About page', () => {
  it('renders the page with correct title', () => {
    render(<About />);
    expect(screen.getByText('Authors page')).toBeInTheDocument();
  });
});
