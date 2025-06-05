'use client';
import { Stack, Typography } from '@mui/material';

type FieldProps = {
  label: string;
  value: string;
};

export default function UserField(props: FieldProps) {
  const { label, value } = props;

  return (
    <Stack direction="row" spacing={2}>
      <Typography component="p" variant="body2" sx={{ minWidth: '80px' }}>
        {label}
      </Typography>
      <Typography component="p" variant="body2" color="text.secondary">
        {value}
      </Typography>
    </Stack>
  );
}
