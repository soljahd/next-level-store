'use client';

import { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  FormControlLabel,
  FormControl,
  Checkbox,
  Button,
  Box,
  IconButton,
  InputAdornment,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const validateEmail = (email: string) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
};

const validatePassword = (password: string): boolean => {
  const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  return passwordPattern.test(password);
};

export default function LoginForm() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');

    if (savedEmail) {
      setEmail(savedEmail);

      setRememberMe(true);
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword((previous) => !previous);
  };

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();

    let isValid = true;

    if (validateEmail(email) === false) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (validatePassword(password) === false) {
      setPasswordError(
        'Password must be at least 6 characters long, contain at least one uppercase letter, one digit, and one special character.',
      );
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (isValid) {
      // код для отправки данных (например, API запрос)
    }

    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }
  };

  return (
    <Box
      component="main"
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        // justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        mt: 8,
      }}
    >
      <Image
        src="/books.png"
        alt="Login Image"
        width={100}
        height={100}
        style={{ backgroundColor: 'white', marginBottom: '8px' }}
      />
      <Typography component="h1" variant="h4" sx={{ mb: 1 }}>
        Log in
      </Typography>
      <Typography variant="body1" color="textDisabled" sx={{ mb: '25px' }}>
        Welcome user, please log in to continue
      </Typography>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <TextField
          slotProps={{
            inputLabel: { shrink: true },
          }}
          variant="outlined"
          size="medium"
          label="email"
          placeholder="Email"
          color="primary"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={!!emailError}
          helperText={emailError}
          sx={{
            mb: 5,
            width: 300,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'primary.main',
              },
              '&:hover fieldset': {
                borderColor: 'primary.dark',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
        <TextField
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          size="medium"
          label="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={!!passwordError}
          helperText={passwordError}
          slotProps={{
            input: {
              endAdornment:
                password.length > 0 ? (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ) : null,
            },
            inputLabel: { shrink: true },
          }}
          sx={{
            mb: '31px',
            width: 300,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'primary.main',
              },
              '&:hover fieldset': {
                borderColor: 'primary.dark',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />

        <FormControl sx={{ mb: '30px', ml: '-125px' }}>
          <FormControlLabel
            control={<Checkbox checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />}
            label="Remember me"
          />
        </FormControl>
        <Button type="submit" size="large" color="primary" variant="contained" sx={{ mb: 5, width: 300 }}>
          Login
        </Button>
      </form>
      <Typography variant="body1" color="textDisabled">
        Don&apos;t have an account?
        <Link href="/register" style={{ color: '#1976d2', textDecoration: 'underline', marginLeft: '8px' }}>
          Register
        </Link>
      </Typography>
    </Box>
  );
}
