'use client';

import { Typography, TextField, Button, Box, IconButton, InputAdornment, Link as MuiLink } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginScheme, type LoginFormData } from '@/lib/validation';
import { loginCustomer } from '@/lib/commercetools/auth';
import { useAuthStore } from '@/lib/store/auth-store';
import { enqueueSnackbar } from 'notistack';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCloseError = () => setErrorMessage(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const { setLoginState } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (errorMessage) {
      enqueueSnackbar(errorMessage, {
        variant: 'error',
        onClose: handleCloseError,
      });
    }
  }, [errorMessage]);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginScheme),
    mode: 'onSubmit',
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginCustomer(data.email, data.password);
      setLoginState(data.email);
      router.push('/main');
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Login failed: Account with the given credentials not found.') {
          setError('email', {
            type: 'manual',
            message: 'Invalid credentials',
          });
          setError('password', {
            type: 'manual',
            message: 'Invalid credentials',
          });
        } else setErrorMessage(error.message);
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      noValidate
      autoComplete="off"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        pt: 8,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Button component={Link} href="/main" sx={{ display: 'flex' }}>
          <Box component="img" src="/logo.svg" alt="Logo" sx={{ width: 60, height: 60 }} />
        </Button>
        <Typography component="h1" variant="h4">
          Log in
        </Typography>
        <Typography component="h2" variant="body1" color="text.secondary">
          Welcome user, please log in to continue
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <TextField
          type="text"
          label="Email*"
          placeholder="Email*"
          color="primary"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
          fullWidth
        />
        <TextField
          type={showPassword ? 'text' : 'password'}
          label="Password*"
          placeholder="Password*"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
          fullWidth
          slotProps={{
            input: {
              endAdornment:
                watch('password')?.length > 0 ? (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ) : null,
            },
          }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Button type="submit" variant="contained" fullWidth>
          Login
        </Button>
        <Typography variant="body1" color="text.secondary">
          Don&apos;t have an account?{' '}
          <MuiLink component={Link} href="/register">
            Register
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
}
