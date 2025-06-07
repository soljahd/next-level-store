'use client';

import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  Link as MuiLink,
  IconButton,
  InputAdornment,
  Stack,
  Switch,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { DateField } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerScheme, type RegisterFormData } from '@/lib/validation';
import { loginCustomer, registerCustomer } from '@/lib/commercetools/auth';
import { useAuthStore } from '@/lib/store/auth-store';
import { enqueueSnackbar } from 'notistack';
import AddressForm from '@/components/register-form/address-form';

export default function RegisterForm() {
  const [isBillingSameAsDelivery, setIsBillingSameAsDelivery] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCloseError = () => setErrorMessage(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const { isLoggedIn, setLoginState } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/main');
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (errorMessage) {
      enqueueSnackbar(errorMessage, {
        variant: 'error',
        onClose: handleCloseError,
      });
    }
  }, [errorMessage]);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerScheme),
    shouldUnregister: true,
    mode: 'onSubmit',
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { email, password } = data;
      await registerCustomer(data);
      await loginCustomer({ email, password });
      setLoginState({ email, password });
      enqueueSnackbar('Account successfully created', { variant: 'success' });
      router.replace('/main');
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Registration failed: There is already an existing customer with the provided email.') {
          setErrorMessage('This email is already used by another customer. Please use another email.');
        } else setErrorMessage(error.message);
      }
    }
  };

  if (isLoggedIn) {
    return null;
  }

  return (
    <Stack
      component="form"
      onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      noValidate
      autoComplete="off"
      gap={4}
      paddingTop={8}
    >
      <Stack gap={1} alignItems={'center'}>
        <Button component={Link} href="/main" sx={{ display: 'flex' }}>
          <Box component="img" src="/logo.svg" alt="Logo" sx={{ width: 60, height: 60 }} />
        </Button>
        <Typography component="h1" variant="h4">
          Register
        </Typography>
        <Typography component="h2" variant="body1" color="textSecondary">
          Welcome user, please register to continue
        </Typography>
      </Stack>

      <Stack gap={1}>
        <Typography component="p" sx={{ textAlign: 'start' }}>
          User
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 9 / 2 }}>
            <TextField
              type="text"
              label="First name*"
              placeholder="First name*"
              color="primary"
              {...register('firstName')}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 9 / 2 }}>
            <TextField
              type="text"
              label="Last name*"
              placeholder="Last name*"
              color="primary"
              {...register('lastName')}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }} flexGrow={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <DateField
                    {...field}
                    label="Date of Birth*"
                    fullWidth
                    value={field.value ? dayjs(field.value) : null}
                    slotProps={{
                      textField: {
                        error: !!errors.dateOfBirth,
                        helperText: errors.dateOfBirth?.message,
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
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
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
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
          </Grid>
        </Grid>
      </Stack>

      <Stack gap={2}>
        <AddressForm
          addressForWhat={'Delivery address'}
          control={control}
          errors={{
            streetName: errors.shippingAddress?.streetName,
            postalCode: errors.shippingAddress?.postalCode,
            country: errors.shippingAddress?.country,
            city: errors.shippingAddress?.city,
            isDefault: errors.shippingAddress?.isDefault,
          }}
          prefix={'shippingAddress'}
        />

        <FormControlLabel
          control={
            <Switch
              checked={isBillingSameAsDelivery}
              onChange={(event) => setIsBillingSameAsDelivery(event.target.checked)}
            />
          }
          labelPlacement="end"
          label="Use delivery address as billing"
          sx={{ width: 'fit-content', mr: 0 }}
        />

        {!isBillingSameAsDelivery && (
          <AddressForm
            addressForWhat={'Billing address'}
            control={control}
            errors={{
              streetName: errors.billingAddress?.streetName,
              postalCode: errors.billingAddress?.postalCode,
              country: errors.billingAddress?.country,
              city: errors.billingAddress?.city,
              isDefault: errors.billingAddress?.isDefault,
            }}
            prefix={'billingAddress'}
          />
        )}
      </Stack>

      <Stack gap={2} alignItems="center">
        <Button type="submit" variant="contained" fullWidth sx={{ alignSelf: 'center', maxWidth: '396px' }}>
          Register
        </Button>
        <Typography variant="body1" color="text.secondary">
          Already have an account?{' '}
          <MuiLink component={Link} href="/login">
            Login
          </MuiLink>
        </Typography>
      </Stack>
    </Stack>
  );
}
