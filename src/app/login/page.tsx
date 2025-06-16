import type { Metadata } from 'next';
import { Container } from '@mui/material';
import LoginForm from '@/components/login-form';

export const metadata: Metadata = {
  title: 'Login | Next-Level Store',
  description: 'Sign in to your account to manage orders and preferences',
  keywords: ['store', 'online', 'books'],
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginPage() {
  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        flex: 1,
      }}
    >
      <LoginForm />
    </Container>
  );
}
