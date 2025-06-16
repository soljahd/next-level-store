import {
  Box,
  Switch,
  FormControlLabel,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Stack,
  Typography,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import type { Control } from 'react-hook-form';
import type { RegisterFormData } from '@/lib/validation';

type AddressFormProperty = {
  addressForWhat: string;
  control: Control<RegisterFormData>;
  errors: {
    streetName?: { message?: string };
    postalCode?: { message?: string };
    country?: { message?: string };
    city?: { message?: string };
    isDefault?: { message?: string };
  };
  prefix: 'shippingAddress' | 'billingAddress';
};

type AddressFields = 'country' | 'city' | 'streetName' | 'postalCode' | 'isDefault';
type PrefixedFields<T extends string> = `${T}.${AddressFields}`;

export default function AddressForm(props: AddressFormProperty) {
  const { addressForWhat, control, errors, prefix } = props;

  const fieldNames: Record<AddressFields, PrefixedFields<typeof prefix>> = {
    country: `${prefix}.country`,
    city: `${prefix}.city`,
    streetName: `${prefix}.streetName`,
    postalCode: `${prefix}.postalCode`,
    isDefault: `${prefix}.isDefault`,
  };

  return (
    <Stack>
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
        <Typography component="p">{addressForWhat}</Typography>
        <FormControlLabel
          control={<Switch defaultChecked {...control.register(fieldNames.isDefault)} />}
          label="Set default"
          labelPlacement="start"
          sx={{ width: 'fit-content', m: 0 }}
        />
      </Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <FormControl fullWidth error={!!errors.country}>
            <InputLabel>Country</InputLabel>
            <Select label="Country" {...control.register(fieldNames.country)} defaultValue="">
              <MenuItem value="BY">Belarussia</MenuItem>
              <MenuItem value="RU">Russia</MenuItem>
            </Select>
            {errors.country && <FormHelperText>{errors.country.message}</FormHelperText>}
          </FormControl>
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
            {...control.register(fieldNames.streetName)}
            error={!!errors.streetName}
            helperText={errors.streetName?.message}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            type="text"
            label="Postcode*"
            placeholder="Postcode*"
            color="primary"
            {...control.register(fieldNames.postalCode)}
            error={!!errors.postalCode}
            helperText={errors.postalCode?.message}
            fullWidth
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
