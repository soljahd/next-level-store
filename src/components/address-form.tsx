import { Autocomplete, Checkbox, FormControlLabel, Grid, TextField, Typography } from '@mui/material';

type addressFormProperty = {
  addressForWhat: string;
  isDefaultAddress: boolean;
  handleDefaultAddress: (value: boolean) => void;
};

export default function AddressForm(props: addressFormProperty) {
  const { addressForWhat, isDefaultAddress, handleDefaultAddress } = props;
  const countries = ['Belarus', 'Russia', 'Poland'];
  return (
    <>
      <Typography component="p" sx={{ textAlign: 'start' }}>
        {addressForWhat}
      </Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={isDefaultAddress}
            onChange={(event) => handleDefaultAddress(event.target.checked)}
            sx={{ p: 0, pl: 1, pr: 1 / 2 }}
          />
        }
        labelPlacement="end"
        label="Use by default"
      ></FormControlLabel>
      <Grid container spacing={2} sx={{ mb: 1 }}>
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
