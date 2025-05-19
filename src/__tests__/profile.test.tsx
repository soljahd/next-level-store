import { render, screen } from '@testing-library/react';
import Profile from '../app/profile/page';

describe('Profile page', () => {
  it('renders the page with correct title', () => {
    render(<Profile />);
    expect(screen.getByText('Profile page')).toBeInTheDocument();
  });
});
