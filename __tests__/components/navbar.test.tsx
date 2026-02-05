import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Navbar } from '@/components/template/layout/navbar';
import { CartProvider } from '@/lib/cart-context';

// Mock the auth service
jest.mock('@/lib/auth-service', () => ({
  logoutUser: jest.fn().mockResolvedValue(true),
}));

// Helper to wrap components with necessary providers
const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <CartProvider>
      {component}
    </CartProvider>
  );
};

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (window.localStorage.getItem as jest.Mock).mockReturnValue(null);
  });

  describe('When user is not authenticated', () => {
    it('should render the Login button', () => {
      renderWithProviders(<Navbar />);

      expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    });

    it('should not show cart icon when user is not logged in', () => {
      renderWithProviders(<Navbar />);

      const cartButtons = screen.queryAllByRole('link', { name: /cart/i });
      expect(cartButtons.length).toBe(0);
    });

    it('should not show user profile dropdown', () => {
      renderWithProviders(<Navbar />);

      expect(screen.queryByRole('button', { name: /user menu/i })).not.toBeInTheDocument();
    });
  });

  describe('When user is authenticated', () => {
    const mockUser = {
      name: 'Test User',
      email: 'test@emobo.com',
      role: 'CUSTOMER',
      image: null,
    };

    beforeEach(() => {
      (window.localStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === 'emobo-user') return JSON.stringify(mockUser);
        if (key === 'emobo-token') return 'mock-token';
        return null;
      });
    });

    it('should show user avatar instead of Login button', async () => {
      renderWithProviders(<Navbar />);

      await waitFor(() => {
        expect(screen.queryByRole('link', { name: /login/i })).not.toBeInTheDocument();
      });
    });

    it('should show cart link for logged-in users', async () => {
      renderWithProviders(<Navbar />);

      await waitFor(() => {
        // The cart button is wrapped in a link to /cart
        const cartLink = screen.getByRole('link', { name: '' });
        expect(cartLink).toHaveAttribute('href', '/cart');
      });
    });

  });

  describe('Navigation links', () => {
    it('should render the EMOBO logo with home link', () => {
      renderWithProviders(<Navbar />);

      const homeLinks = screen.getAllByRole('link', { name: /emobo/i });
      expect(homeLinks.length).toBeGreaterThan(0);
    });

    it('should render Catalog link', () => {
      renderWithProviders(<Navbar />);

      expect(screen.getByRole('link', { name: /catalog/i })).toBeInTheDocument();
    });
  });
});
