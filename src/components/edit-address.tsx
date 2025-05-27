import type { addressEditFormData } from '@/lib/validation';
import { addressEditScheme } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SelectChangeEvent } from '@mui/material';
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type EditAddressProps = {
  isNewAddress?: boolean;
  setEditingMode: (mode: string | null) => void;
};

export default function EditAddress(props: EditAddressProps) {
  const { setEditingMode, isNewAddress } = props;
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [isShippingDefault, setShippingDefault] = useState<boolean>(false);
  const [isBillingDefault, setBillingDefault] = useState<boolean>(false);

  const handleAddressType = (event: SelectChangeEvent<typeof selectedValues>) => {
    const {
      target: { value },
    } = event;

    const newValue = typeof value === 'string' ? value.split(',') : value;
    const isShippingNowSelected = newValue.includes('shipping');
    const isBillingNowSelected = newValue.includes('billing');

    if (!isShippingNowSelected) {
      setShippingDefault(false);
    }
    if (!isBillingNowSelected) {
      setBillingDefault(false);
    }
    setSelectedValues(newValue);
  };

  const {
    control,
    setValue,
    // register,
    // handleSubmit,
    // watch,
    formState: { errors },
  } = useForm<addressEditFormData>({
    resolver: zodResolver(addressEditScheme),
    shouldUnregister: true,
    mode: 'onSubmit',
  });
  const handleDefaultChange = (value: string) => {
    const currentValues = selectedValues;
    if (value === 'shipping') {
      if (!currentValues.includes('shipping')) {
        setSelectedValues([...currentValues, 'shipping']);
        setValue('addressType', [...currentValues, 'shipping']);
      }
      setShippingDefault(!isShippingDefault);
    } else if (value === 'billing') {
      if (!currentValues.includes('billing')) {
        setSelectedValues([...currentValues, 'billing']);
        setValue('addressType', [...currentValues, 'billing']);
      }
      setBillingDefault(!isBillingDefault);
    }
  };
  return (
    <Stack
      component="form"
      //   onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      noValidate
      autoComplete="off"
      gap={3}
      paddingTop={2}
    >
      <Typography component="h1" variant="h4">
        {isNewAddress ? 'Add Address' : 'Edit Address'}
      </Typography>
      <FormControl fullWidth>
        <InputLabel id="select-chips-label">Address option</InputLabel>
        <Select
          multiple
          value={selectedValues}
          onChange={handleAddressType}
          input={<OutlinedInput label="Address option" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          <MenuItem value="shipping">Shipping</MenuItem>
          <MenuItem value="billing">Billing</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth error={!!errors.country}>
        <InputLabel>Country</InputLabel>
        <Select label="Country" {...control.register('country')} defaultValue="">
          <MenuItem value="BY">Belarus</MenuItem>
          <MenuItem value="RU">Russia</MenuItem>
        </Select>
        {errors.country && <FormHelperText>{errors.country.message}</FormHelperText>}
      </FormControl>
      <TextField
        type="text"
        label="City*"
        placeholder="City*"
        color="primary"
        {...control.register('city')}
        error={!!errors.city}
        helperText={errors.city?.message}
        fullWidth
      />
      <TextField
        type="text"
        label="Street*"
        placeholder="Street*"
        color="primary"
        {...control.register('streetName')}
        error={!!errors.streetName}
        helperText={errors.streetName?.message}
        fullWidth
      />
      <TextField
        type="text"
        label="Postcode*"
        placeholder="Postcode*"
        color="primary"
        {...control.register('postalCode')}
        error={!!errors.postalCode}
        helperText={errors.postalCode?.message}
        fullWidth
      />
      <FormControlLabel
        control={
          <Switch
            checked={isShippingDefault}
            {...control.register('isShippingDefault')}
            onChange={() => handleDefaultChange('shipping')}
          />
        }
        label="Use as shipping default"
        labelPlacement="end"
        sx={{ width: 'fit-content', m: 0 }}
      />
      <FormControlLabel
        control={
          <Switch
            checked={isBillingDefault}
            {...control.register('isBillingDefault')}
            onChange={() => handleDefaultChange('billing')}
          />
        }
        label="Use as billing default"
        labelPlacement="end"
        sx={{ width: 'fit-content', m: 0 }}
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
