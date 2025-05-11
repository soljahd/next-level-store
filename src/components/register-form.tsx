'use client';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  Link as MuiLink,
  IconButton,
  InputAdornment,
  Snackbar,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { DateField } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerScheme, type RegisterFormData } from '@/lib/validation';
import { loginCustomer, registerCustomer } from '@/lib/commercetools/auth';
import AddressForm from '@/components/address-form';

export default function RegisterForm() {
  const [isBillingSameAsDelivery, setIsBillingSameAsDelivery] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCloseError = () => setErrorMessage(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerScheme),
    mode: 'onSubmit',
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const userData = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth.format('YYYY-MM-DD'),
        addresses: [
          {
            country: data.shippingAddress.country,
            streetName: data.shippingAddress.street,
            postalCode: data.shippingAddress.postcode,
            city: data.shippingAddress.city,
          },
        ],
      };
      await registerCustomer(userData);
      await loginCustomer(data.email, data.password);
      router.push('/main');
      console.log(data);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
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
          Register
        </Typography>
        <Typography component="h2" variant="body1" color="textSecondary">
          Welcome user, please register to continue
        </Typography>
      </Box>

      <Box component="div" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography component="p" sx={{ textAlign: 'start' }}>
          User
        </Typography>

        <Grid container spacing={2} maxWidth="md" sx={{ margin: '0 auto 10px' }}>
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
              type="email"
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
      </Box>

      <Box component="div" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <AddressForm
          addressForWhat={'Delivery address'}
          control={control}
          errors={{
            street: errors.shippingAddress?.street,
            postcode: errors.shippingAddress?.postcode,
            country: errors.shippingAddress?.country,
            city: errors.shippingAddress?.city,
            isDefault: errors.shippingAddress?.isDefault,
          }}
          prefix={'shippingAddress'}
        ></AddressForm>
        <FormControlLabel
          control={
            <Checkbox
              checked={isBillingSameAsDelivery}
              onChange={(event) => setIsBillingSameAsDelivery(event.target.checked)}
            />
          }
          labelPlacement="end"
          label="Use delivery address as billing address"
        ></FormControlLabel>
        {isBillingSameAsDelivery ? (
          ''
        ) : (
          <AddressForm
            addressForWhat={'Billing address'}
            control={control}
            errors={{
              street: errors.billingAddress?.street,
              postcode: errors.billingAddress?.postcode,
              country: errors.billingAddress?.country,
              city: errors.billingAddress?.city,
              isDefault: errors.billingAddress?.isDefault,
            }}
            prefix={'billingAddress'}
          ></AddressForm>
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Button type="submit" variant="contained" fullWidth sx={{ alignSelf: 'center', maxWidth: '396px' }}>
          Register
        </Button>
        <Typography variant="body1" color="text.secondary">
          Already have an account?{' '}
          <MuiLink component={Link} href="/login">
            Login
          </MuiLink>
        </Typography>
      </Box>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={4000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={handleCloseError}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
