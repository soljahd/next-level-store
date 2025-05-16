'use client';

import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { SnackbarProvider, closeSnackbar } from 'notistack';
import type { ReactNode } from 'react';

export default function NotistackProvider({ children }: { children: ReactNode }) {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={4000}
      action={(key) => (
        <IconButton size="small" onClick={() => closeSnackbar(key)}>
          <Close fontSize="small" />
        </IconButton>
      )}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
    >
      {children}
    </SnackbarProvider>
  );
}
