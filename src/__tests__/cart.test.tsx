import { render, screen } from '@testing-library/react';
import ShoppingCart from '../app/cart/page';

describe('ShoppingCart page', () => {
  it('renders the page with correct title', () => {
    render(<ShoppingCart />);
    expect(screen.getByText('Shopping cart page')).toBeInTheDocument();
  });
});
