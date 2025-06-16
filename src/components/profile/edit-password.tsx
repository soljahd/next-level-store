'use client';
import { changeMyPassword } from '@/lib/commercetools/profile';
import type { passwordChangeFormData } from '@/lib/validation';
import { passwordChangeScheme } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import type { Dispatch, SetStateAction } from 'react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/lib/store/auth-store';
import type { Customer } from '@commercetools/platform-sdk';
import { loginCustomer, logoutCustomer } from '@/lib/commercetools/auth';
import { enqueueSnackbar } from 'notistack';

type EditPasswordProps = {
  setProfileState: Dispatch<SetStateAction<Customer | null>>;
  setEditingMode: (mode: string | null) => void;
};

export default function EditPassword(props: EditPasswordProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handleCloseError = () => setErrorMessage(null);

  useEffect(() => {
    if (errorMessage) {
      enqueueSnackbar(errorMessage, {
        variant: 'error',
        onClose: handleCloseError,
      });
    }
  }, [errorMessage]);
  const { setProfileState, setEditingMode } = props;
  const { setLoginState, user } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const onSubmit = async (data: passwordChangeFormData) => {
    try {
      const response = await changeMyPassword(data);
      if (!response) {
        throw new Error('Ошибка запроса изменения адреса');
      }
      setProfileState(response);
      // updateProfileState({
      //   password: data.newPassword,
      // });
      if (!user) {
        throw new Error('Данные профиля не найдены');
      }
      setLoginState({
        email: user.email,
        password: data.newPassword,
      });
      logoutCustomer();
      await loginCustomer({ ...user, password: data.newPassword });
      setEditingMode(null);
      enqueueSnackbar('Password successfully updated', { variant: 'success' });
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  };
  const {
    // control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<passwordChangeFormData>({
    resolver: zodResolver(passwordChangeScheme),
    shouldUnregister: true,
    mode: 'onSubmit',
  });
  return (
    <Stack
      component="form"
      onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      noValidate
      autoComplete="off"
      gap={3}
      paddingTop={2}
    >
      <Typography component="h1" variant="h4">
        Change Password
      </Typography>
      <TextField
        type={showPassword ? 'text' : 'password'}
        label="Current password*"
        placeholder="Current password*"
        {...register('currentPassword')}
        error={!!errors.currentPassword}
        helperText={errors.currentPassword?.message}
        fullWidth
        slotProps={{
          input: {
            endAdornment:
              watch('currentPassword')?.length > 0 ? (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ) : null,
          },
        }}
      />
      <TextField
        type={showPassword ? 'text' : 'password'}
        label="New password*"
        placeholder="New password*"
        {...register('newPassword')}
        error={!!errors.newPassword}
        helperText={errors.newPassword?.message}
        fullWidth
        slotProps={{
          input: {
            endAdornment:
              watch('newPassword')?.length > 0 ? (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ) : null,
          },
        }}
      />
      <TextField
        type={showPassword ? 'text' : 'password'}
        label="Repeat password*"
        placeholder="Repeat password*"
        {...register('repeatPassword')}
        error={!!errors.repeatPassword}
        helperText={errors.repeatPassword?.message}
        fullWidth
        slotProps={{
          input: {
            endAdornment:
              watch('repeatPassword')?.length > 0 ? (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ) : null,
          },
        }}
      />
      <Stack gap={2} alignItems="center">
        <Button type="submit" variant="contained" fullWidth sx={{ alignSelf: 'center', maxWidth: '396px' }}>
          Save changes
        </Button>
        <Button type="button" onClick={() => setEditingMode(null)}>
          Cancel
        </Button>
      </Stack>
    </Stack>
  );
}
