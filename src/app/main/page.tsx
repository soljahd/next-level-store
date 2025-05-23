import type { Metadata } from 'next';
import { Container, Typography, Stack, Link as MuiLink } from '@mui/material';

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
        flex: 1,
      }}
    >
      <Typography component="h1" variant="h4" align="center">
        Main page
      </Typography>
      <Stack gap={2}>
        <MuiLink href="/login">Login</MuiLink>
        <MuiLink href="/register">Register</MuiLink>
        <MuiLink href="/profile">Profile</MuiLink>
        <MuiLink href="/catalog">Catalog</MuiLink>
        <MuiLink href="/about">Authors</MuiLink>
        <MuiLink href="/cart">Cart</MuiLink>
      </Stack>
    </Container>
  );
}
