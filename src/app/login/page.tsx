import LoginForm from '@/components/login-form';
import { Container } from '@mui/material';

export default function LoginPage() {
  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <LoginForm />;
    </Container>
  );
}
