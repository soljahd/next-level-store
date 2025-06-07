'use client';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { DateField, LocalizationProvider } from '@mui/x-date-pickers';
import { Controller, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { type profileEditFormData, profileEditScheme } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateMyProfile } from '@/lib/commercetools/profile';
import { useAuthStore } from '@/lib/store/auth-store';
import type { Customer } from '@commercetools/platform-sdk';
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';

type EditProfileProps = {
  profileState: Customer | null;
  setProfileState: Dispatch<SetStateAction<Customer | null>>;
  setEditingMode: (mode: string | null) => void;
};

export default function EditProfile(props: EditProfileProps) {
  const { profileState, setProfileState, setEditingMode } = props;
  const { setLoginState, user } = useAuthStore();
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

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<profileEditFormData>({
    resolver: zodResolver(profileEditScheme),
    shouldUnregister: true,
    mode: 'onSubmit',
    defaultValues: {
      email: profileState?.email,
      firstName: profileState?.firstName,
      lastName: profileState?.lastName,
      dateOfBirth: dayjs(profileState?.dateOfBirth, 'YYYY-MM-DD'),
    },
  });
  const onSubmit = async (data: profileEditFormData) => {
    try {
      const response = await updateMyProfile(data);
      if (!response) {
        throw new Error('Данные профиля не найдены');
      }
      setProfileState(response);
      // updateProfileState({
      //   email: data.email,
      // });
      if (!user) {
        throw new Error('Данные профиля не найдены');
      }
      setLoginState({
        email: data.email,
        password: user.password,
      });
      setEditingMode(null);
      enqueueSnackbar('Profile successfully updated', { variant: 'success' });
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  };

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
        Edit Profile
      </Typography>
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
