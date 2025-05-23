import { render, screen } from '@testing-library/react';
import Home from '../app/main/page';

describe('Home page', () => {
  it('renders the page with correct title', () => {
    render(<Home />);
    expect(screen.getByText('Main page')).toBeInTheDocument();
  });
});
