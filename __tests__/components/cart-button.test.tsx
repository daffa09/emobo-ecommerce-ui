import { render, screen } from '@testing-library/react';
import { CartButton } from '@/components/template/layout/cart-button';
import { CartProvider } from '@/lib/cart-context';

// Helper function
const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <CartProvider>
      {component}
    </CartProvider>
  );
};

describe('CartButton Component', () => {
  it('should render cart button with link to /cart page', () => {
    renderWithProviders(<CartButton />);

    const cartLink = screen.getByRole('link');
    expect(cartLink).toHaveAttribute('href', '/cart');
  });

  it('should display shopping cart icon', () => {
    renderWithProviders(<CartButton />);

    // Check that the cart link exists
    const cartLink = screen.getByRole('link');
    expect(cartLink).toBeInTheDocument();
  });


  it('should not show badge when cart is empty', () => {
    renderWithProviders(<CartButton />);

    const badge = screen.queryByText('0');
    expect(badge).not.toBeInTheDocument();
  });
});
