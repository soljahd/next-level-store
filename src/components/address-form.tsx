import { Autocomplete, Grid, TextField, Typography } from '@mui/material';
import React from 'react';

type addressFormProperty = {
  addressForWhat: string;
};

export default function AddressForm({ addressForWhat }: addressFormProperty) {
  const countries = ['Belarus', 'Russia', 'USA'];
  return (
    <>
      <Typography component="p" sx={{ textAlign: 'start' }}>
        {addressForWhat}
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <Autocomplete
            options={countries}
            renderInput={(parameters) => <TextField {...parameters} label="Country" required />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <TextField type="text" fullWidth required label="City" variant="outlined" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 8 }}>
          <TextField type="text" fullWidth required label="Street" variant="outlined" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField fullWidth required label="Postcode" variant="outlined" />
        </Grid>
      </Grid>
    </>
  );
}
