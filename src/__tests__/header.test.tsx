import { render, screen, fireEvent, act } from '@testing-library/react';
import Header from '@/components/header/index';
import { useAuthStore } from '@/lib/store/auth-store';
import { useCartStore } from '@/lib/store/cart-store';
import { useRouter } from 'next/navigation';
import { mocked } from 'jest-mock';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/lib/store/auth-store', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('@/lib/store/cart-store', () => ({
  useCartStore: jest.fn(),
}));

describe('Header', () => {
  const mockLogout = jest.fn();
  const mockPush = jest.fn();
  const mockInitializeCart = jest.fn(async () => {});

  beforeEach(() => {
    jest.clearAllMocks();

    mocked(useRouter).mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    });

    mocked(useAuthStore).mockReturnValue({
      isLoggedIn: false,
      setLogoutState: mockLogout,
    });

    mocked(useCartStore).mockReturnValue({
      cartCount: 0,
      initializeCart: mockInitializeCart,
      updateCartCount: jest.fn(),
    });
  });

  it('renders the logo and main elements', () => {
    render(<Header />);
    expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
    expect(screen.getByText(/catalog/i)).toBeInTheDocument();
    expect(screen.getByText(/authors/i)).toBeInTheDocument();
    expect(screen.getByText(/account/i)).toBeInTheDocument();
    expect(screen.getByText(/cart/i)).toBeInTheDocument();
  });

  it('shows Sign In / Sign Up if not logged in', () => {
    render(<Header />);
    act(() => {
      fireEvent.click(screen.getByText(/account/i));
    });
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  it('shows My Profile / Sign Out if logged in', () => {
    mocked(useAuthStore).mockReturnValue({
      isLoggedIn: true,
      setLogoutState: mockLogout,
    });

    mocked(useCartStore).mockReturnValue({
      cartCount: 3,
      initializeCart: mockInitializeCart,
      updateCartCount: jest.fn(),
    });

    render(<Header />);
    act(() => {
      fireEvent.click(screen.getByText(/account/i));
    });
    expect(screen.getByText(/my profile/i)).toBeInTheDocument();
    expect(screen.getByText(/sign out/i)).toBeInTheDocument();
  });

  it('causes logout when clicking Sign Out', () => {
    mocked(useAuthStore).mockReturnValue({
      isLoggedIn: true,
      setLogoutState: mockLogout,
    });

    mocked(useCartStore).mockReturnValue({
      cartCount: 3,
      initializeCart: mockInitializeCart,
      updateCartCount: jest.fn(),
    });

    render(<Header />);
    act(() => {
      fireEvent.click(screen.getByText(/account/i));
    });
    act(() => {
      fireEvent.click(screen.getByText(/sign out/i));
    });
    expect(mockLogout).toHaveBeenCalled();
  });

  it('contains correct links for navigation', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: /logo/i })).toHaveAttribute('href', '/main');
    expect(screen.getByRole('link', { name: /catalog/i })).toHaveAttribute('href', '/catalog');
    expect(screen.getByRole('link', { name: /authors/i })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: /cart/i })).toHaveAttribute('href', '/cart');
  });
});
