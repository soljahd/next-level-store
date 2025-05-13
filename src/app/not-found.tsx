import type { Metadata } from 'next';
import { Button, Container, Typography, Box } from '@mui/material';
import { Home } from '@mui/icons-material';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found | Next-Level Store',
  description: 'The requested page doesn’t exist. Browse our store instead.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        flexgrow: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 2,
          pt: 8,
        }}
      >
        <Typography variant="h1" component="h1" sx={{ fontSize: '4rem', fontWeight: 700 }}>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" component="p" color="text.secondary">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </Typography>
        <Button component={Link} href="/main" variant="contained" startIcon={<Home />} size="large" sx={{ mt: 3 }}>
          Return to Home
        </Button>
      </Box>
    </Container>
  );
}
