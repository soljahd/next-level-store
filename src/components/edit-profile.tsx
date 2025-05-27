'use client';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { DateField, LocalizationProvider } from '@mui/x-date-pickers';
import { Controller, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { profileEditFormData } from '@/lib/validation';
import { profileEditScheme } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';

type EditProfileProps = {
  setEditingMode: (mode: string | null) => void;
};

export default function EditProfile(props: EditProfileProps) {
  const { setEditingMode } = props;
  const {
    control,
    register,
    // handleSubmit,
    // watch,
    formState: { errors },
  } = useForm<profileEditFormData>({
    resolver: zodResolver(profileEditScheme),
    shouldUnregister: true,
    mode: 'onSubmit',
  });
  // const onSubmit = (data: any) => {
  //   // Обработка
  //   console.log(data);
  // };

  return (
    <Stack
      component="form"
      // onSubmit={(event) => void handleSubmit(onSubmit)(event)}
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
