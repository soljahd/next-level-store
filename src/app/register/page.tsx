import type { Metadata } from 'next';
import { Container } from '@mui/material';
import RegisterForm from '@/components/register-form';
// import RegisterForm from '@/components/register-form-my';

export const metadata: Metadata = {
  title: 'Register | Next-Level Store',
  description: 'Create an account to access exclusive deals and manage orders',
  keywords: ['register', 'sign up', 'create account', 'store account'],
  robots: {
    index: false,
    follow: true,
  },
};

export default function RegisterPage() {
  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{
        minHeight: '100vh',
      }}
    >
      <RegisterForm />
    </Container>
  );
}
