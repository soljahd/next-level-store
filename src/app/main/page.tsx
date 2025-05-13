import type { Metadata } from 'next';
import { Container, Typography } from '@mui/material';

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
      component="main"
      maxWidth={false}
      sx={{
        flexGrow: 1,
      }}
    >
      <Typography component="h1" variant="h4" align="center">
        Main page
      </Typography>
    </Container>
  );
}
