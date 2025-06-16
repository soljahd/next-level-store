import type { Metadata } from 'next';
import { Container } from '@mui/material';
import Profile from '@/components/profile';

export const metadata: Metadata = {
  title: 'Profile | Next-Level Store',
  description: 'Manage your account, track orders, and customize your profile settings on Next-Level Store.',
  keywords: ['online store', 'shop', 'ecommerce', 'user profile', 'account settings', 'order tracking', 'user account'],
  robots: {
    index: true,
    follow: true,
  },
};

export default function ProfilePage() {
  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{
        // display: 'flex',
        // justifyContent: 'center',
        flex: 1,
      }}
    >
      <Profile></Profile>
    </Container>
  );
}
