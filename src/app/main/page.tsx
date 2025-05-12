import type { Metadata } from 'next';
import { Container } from '@mui/material';
import Header from '@/components/header';

export const metadata: Metadata = {
  title: 'Home | Next-Level Store',
  description: 'Welcom to our store',
  keywords: ['online store', 'shop', 'ecommerce'],
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  return (
    <Container
      component="div"
      maxWidth={false}
      disableGutters
      sx={{
        minHeight: '100vh',
      }}
    >
      <Header />
    </Container>
  );
}
