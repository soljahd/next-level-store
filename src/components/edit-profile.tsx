'use client';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { DateField, LocalizationProvider } from '@mui/x-date-pickers';
import { Controller, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { profileEditFormData } from '@/lib/validation';
import { profileEditScheme } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateMyProfile } from '@/lib/commercetools/profile';
import { useAuthStore } from '@/lib/store/auth-store';
import type { Customer } from '@commercetools/platform-sdk';
import type { Dispatch, SetStateAction } from 'react';

type EditProfileProps = {
  setProfileState: Dispatch<SetStateAction<Customer | null>>;
  setEditingMode: (mode: string | null) => void;
};

export default function EditProfile(props: EditProfileProps) {
  const { setProfileState, setEditingMode } = props;
  const { setLoginState, user } = useAuthStore();
  const {
    control,
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm<profileEditFormData>({
    resolver: zodResolver(profileEditScheme),
    shouldUnregister: true,
    mode: 'onSubmit',
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
    } catch (error) {
      if (error instanceof Error) {
        console.error('Ошибка обновления профиля:', error.message);
      }
    }
  };

  return (
    <Stack
      component="form"
      onSubmit={() => handleSubmit(onSubmit)}
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
