import type { Metadata } from 'next';
import { Container } from '@mui/material';
import CatalogPage from '@/components/catalog';

export const metadata: Metadata = {
  title: 'Catalog | Next-Level Store',
  description:
    'Discover a wide selection of books in various genres. Buy novels, textbooks, bestsellers, and more at Next-Level Store.',
  keywords: [
    'online store',
    'shop',
    'ecommerce',
    'books',
    'bookstore',
    'buy books online',
    'novels',
    'bestsellers',
    'online book shop',
    'literature',
  ],
  robots: {
    index: true,
    follow: true,
  },
};

export default function Catalog() {
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
      <CatalogPage />
    </Container>
  );
}
