import type { passwordChangeFormData } from '@/lib/validation';
import { passwordChangeScheme } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type EditPasswordProps = {
  setEditingMode: (mode: string | null) => void;
};

export default function EditPassword(props: EditPasswordProps) {
  const { setEditingMode } = props;
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  // const onSubmit = (data: any) => {
  //   // Обработка
  //   console.log(data);
  // };
  const {
    // control,
    register,
    // handleSubmit,
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
      // onSubmit={(event) => handleSubmit(onSubmit)(event)}
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
