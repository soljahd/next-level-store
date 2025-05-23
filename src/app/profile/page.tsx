import type { Metadata } from 'next';
import { Container, Typography } from '@mui/material';

export const metadata: Metadata = {
  title: 'Profile | Next-Level Store',
  description: 'Manage your account, track orders, and customize your profile settings on Next-Level Store.',
  keywords: ['online store', 'shop', 'ecommerce', 'user profile', 'account settings', 'order tracking', 'user account'],
  robots: {
    index: true,
    follow: true,
  },
};

export default function Profile() {
  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{
        flex: 1,
      }}
    >
      <Typography component="h1" variant="h4" align="center">
        Profile page
      </Typography>
    </Container>
  );
}
