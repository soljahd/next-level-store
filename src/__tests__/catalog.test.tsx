import { render, screen } from '@testing-library/react';
import Catalog from '../app/catalog/page';

describe('Catalog page', () => {
  it('renders the page with correct title', () => {
    render(<Catalog />);
    expect(screen.getByText('Catalog page')).toBeInTheDocument();
  });
});
