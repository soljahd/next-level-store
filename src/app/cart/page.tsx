import type { Metadata } from 'next';
import { Container } from '@mui/material';
import ShoppingCart from '@/components/cart/index';

export const metadata: Metadata = {
  title: 'Shopping Cart | Next-Level Store',
  description:
    'View your selected books and complete your purchase at Next-Level Store. Your one-stop online bookstore.',
  keywords: [
    'online store',
    'shop',
    'ecommerce',
    'shopping cart',
    'checkout',
    'buy books',
    'online shopping',
    'bookstore',
    'order books',
    'purchase online',
    'cart',
  ],
  robots: {
    index: true,
    follow: true,
  },
};

export default function ShoppingCartPage() {
  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{
        flex: 1,
        paddingX: { xs: 2, md: 8, xl: 20 },
        paddingY: 2,
      }}
    >
      <ShoppingCart></ShoppingCart>
    </Container>
  );
}
