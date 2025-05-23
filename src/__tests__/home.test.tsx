import { render, screen } from '@testing-library/react';
import { useAuthStore } from '@/lib/store/auth-store';
import Home from '@/app/main/page';
import Header from '@/components/header';
import Footer from '@/components/footer';

jest.mock('@/lib/store/auth-store');

describe('Main Page', () => {
  const mockUseAuthStore = jest.mocked(useAuthStore);

  beforeEach(() => {
    mockUseAuthStore.mockReturnValue({
      isLoggedIn: false,
      setLogoutState: jest.fn(),
    });
  });

  it('renders the main page with header, content and footer', () => {
    render(
      <>
        <Header />
        <Home />
        <Footer />
      </>,
    );

    expect(screen.getByRole('heading', { level: 1, name: /main page/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /logo/i })).toBeInTheDocument();
    expect(screen.getByText(/© 2025 Next-Level Store/i)).toBeInTheDocument();
  });
});
