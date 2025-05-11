import { Autocomplete, Checkbox, FormControlLabel, Grid, TextField, Typography } from '@mui/material';
import type { Control } from 'react-hook-form';
import type { RegisterFormData } from '@/lib/validation';

type AddressFormProperty = {
  addressForWhat: string;
  control: Control<RegisterFormData>;
  errors: {
    street?: { message?: string };
    postcode?: { message?: string };
    country?: { message?: string };
    city?: { message?: string };
    isDefault?: { message?: string };
  };
  prefix: 'shippingAddress' | 'billingAddress';
};

type AddressFields = 'country' | 'city' | 'street' | 'postcode' | 'isDefault';
type PrefixedFields<T extends string> = `${T}.${AddressFields}`;

export default function AddressForm(props: AddressFormProperty) {
  const { addressForWhat, control, errors, prefix } = props;
  const countries = ['Belarus', 'Russia', 'Poland'];

  const fieldNames: Record<AddressFields, PrefixedFields<typeof prefix>> = {
    country: `${prefix}.country`,
    city: `${prefix}.city`,
    street: `${prefix}.street`,
    postcode: `${prefix}.postcode`,
    isDefault: `${prefix}.isDefault`,
  };

  return (
    <>
      <Typography component="p" sx={{ textAlign: 'start' }}>
        {addressForWhat}
      </Typography>
      <FormControlLabel
        control={<Checkbox {...control.register(fieldNames.isDefault)} />}
        labelPlacement="end"
        label="Use by default"
      ></FormControlLabel>
      <Grid container spacing={2} sx={{ mb: 1 }}>
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <Autocomplete
            options={countries}
            renderInput={(parameters) => (
              <TextField
                {...parameters}
                label="Country"
                {...control.register(fieldNames.country)}
                error={!!errors.country}
                helperText={errors.country?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <TextField
            type="text"
            label="City*"
            placeholder="City*"
            color="primary"
            {...control.register(fieldNames.city)}
            error={!!errors.city}
            helperText={errors.city?.message}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 8 }}>
          <TextField
            type="text"
            label="Street*"
            placeholder="Street*"
            color="primary"
            {...control.register(fieldNames.street)}
            error={!!errors.street}
            helperText={errors.street?.message}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            type="text"
            label="Postcode*"
            placeholder="Postcode*"
            color="primary"
            {...control.register(fieldNames.postcode)}
            error={!!errors.postcode}
            helperText={errors.postcode?.message}
            fullWidth
          />
        </Grid>
      </Grid>
    </>
  );
}
