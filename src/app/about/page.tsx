import type { Metadata } from 'next';
import { Container, Typography } from '@mui/material';

export const metadata: Metadata = {
  title: 'About Us | Next-Level Store',
  description:
    'Learn about our story, mission, and values. Discover how Next-Level Store became your favorite bookstore.',
  keywords: [
    'online store',
    'shop',
    'ecommerce',
    'about us',
    'company',
    'bookstore',
    'online store',
    'our mission',
    'team',
  ],
  robots: {
    index: true,
    follow: true,
  },
};

export default function About() {
  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{
        flex: 1,
      }}
    >
      <Typography component="h1" variant="h4" align="center">
        Authors page
      </Typography>
    </Container>
  );
}
