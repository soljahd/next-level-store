import type { Metadata } from 'next';
import { Container, Typography } from '@mui/material';

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

export default function ShoppingCart() {
  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{
        flex: 1,
      }}
    >
      <Typography component="h1" variant="h4" align="center">
        Shopping cart page
      </Typography>
    </Container>
  );
}
