import type { Metadata } from 'next';
import { Container, Typography, Stack, Link as MuiLink } from '@mui/material';
import Link from 'next/link';

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
        <MuiLink component={Link} href="/login">
          Login
        </MuiLink>
        <MuiLink component={Link} href="/register">
          Register
        </MuiLink>
        <MuiLink component={Link} href="/profile">
          Profile
        </MuiLink>
        <MuiLink component={Link} href="/catalog">
          Catalog
        </MuiLink>
        <MuiLink component={Link} href="/about">
          Authors
        </MuiLink>
        <MuiLink component={Link} href="/cart">
          Cart
        </MuiLink>
      </Stack>
    </Container>
  );
}
