'use client';
import { addMyNewAddress, updateMyAddress } from '@/lib/commercetools/profile';
import type { addressEditFormData } from '@/lib/validation';
import { addressEditScheme } from '@/lib/validation';
import type { Customer } from '@commercetools/platform-sdk';
import { zodResolver } from '@hookform/resolvers/zod';
// import type { SelectChangeEvent } from '@mui/material';
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { type Dispatch, type SetStateAction, useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';

type EditAddressProps = {
  isNewAddress: boolean;
  editModeWithAddressId?: string;
  profileState: Customer;
  setProfileState: Dispatch<SetStateAction<Customer | null>>;
  setEditingMode: (mode: string | null) => void;
};

export default function EditAddress(props: EditAddressProps) {
  const { setEditingMode, isNewAddress, profileState, setProfileState, editModeWithAddressId } = props;
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  // const [isShippingDefault, setShippingDefault] = useState<boolean>(false);
  // const [isBillingDefault, setBillingDefault] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handleCloseError = () => setErrorMessage(null);

  useEffect(() => {
    if (errorMessage) {
      enqueueSnackbar(errorMessage, {
        variant: 'error',
        onClose: handleCloseError,
      });
    }
  }, [errorMessage]);

  const addressId = editModeWithAddressId?.split('---')[1].trim();
  const addressData = profileState.addresses.find((address) => address.id === addressId);
  const isShipping = addressId ? (profileState.shippingAddressIds?.includes(addressId) ?? false) : false;
  const isBilling = addressId ? (profileState.billingAddressIds?.includes(addressId) ?? false) : false;
  const addressTypes: string[] = [];
  if (isShipping) addressTypes.push('shipping');
  if (isBilling) addressTypes.push('billing');
  const isShippingDefault = addressId ? profileState.defaultShippingAddressId === addressId : false;
  const isBillingDefault = addressId ? profileState.defaultBillingAddressId === addressId : false;

  const {
    control,
    // setValue,
    handleSubmit,
    // reset,
    formState: { errors },
  } = useForm<addressEditFormData>({
    resolver: zodResolver(addressEditScheme),
    shouldUnregister: true,
    mode: 'onSubmit',
    defaultValues: {
      addressType: editModeWithAddressId ? addressTypes : [],
      country: editModeWithAddressId ? addressData?.country : '',
      city: editModeWithAddressId ? addressData?.city : '',
      streetName: editModeWithAddressId ? addressData?.streetName : '',
      postalCode: editModeWithAddressId ? addressData?.postalCode : '',
      isShippingDefault: editModeWithAddressId ? isShippingDefault : false,
      isBillingDefault: editModeWithAddressId ? isBillingDefault : false,
    },
  });

  const onSubmit = async (data: addressEditFormData) => {
    try {
      if (isNewAddress === true) {
        const response = await addMyNewAddress(data);
        if (!response) {
          throw new Error('Ошибка добавления адреса');
        }
        setProfileState(response);
      } else {
        const addressId = editModeWithAddressId!.split('---')[1].trim();
        const response = await updateMyAddress(addressId, data);
        if (!response) {
          throw new Error('Ошибка обновления адреса');
        }
        setProfileState(response);
      }
      setEditingMode(null);
      enqueueSnackbar('Addresses successfully updated', { variant: 'success' });
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  };

  // const handleAddressType = (event: SelectChangeEvent<typeof selectedValues>) => {
  //   const {
  //     target: { value },
  //   } = event;

  //   const newValue = typeof value === 'string' ? value.split(',') : value;
  //   const isShippingNowSelected = newValue.includes('shipping');
  //   const isBillingNowSelected = newValue.includes('billing');
  //   // console.log('новое',newValue)
  //   setSelectedValues(newValue);
  //   // console.log('после установки', selectedValues)

  //   if (!isShippingNowSelected) {
  //     setShippingDefault(false);
  //     reset({
  //       isShippingDefault: false,
  //     });
  //   }
  //   if (!isBillingNowSelected) {
  //     setBillingDefault(false);
  //     reset({
  //       isBillingDefault: false,
  //     });
  //   }
  //   // console.log('посл нов', newValue)
  // };

  // const handleDefaultChange = (value: string) => {
  //   const currentValues = selectedValues;
  //   if (value === 'shipping') {
  //     if (!currentValues.includes('shipping')) {
  //       setSelectedValues([...currentValues, 'shipping']);
  //       setValue('addressType', [...currentValues, 'shipping']);
  //     }
  //     setShippingDefault(!isShippingDefault);
  //   } else if (value === 'billing') {
  //     if (!currentValues.includes('billing')) {
  //       setSelectedValues([...currentValues, 'billing']);
  //       setValue('addressType', [...currentValues, 'billing']);
  //     }
  //     setBillingDefault(!isBillingDefault);
  //   }
  // };

  // useEffect(() => {
  //   if (profileState) {
  //     const addressId = editModeWithAddressId!.split('---')[1].trim();
  //     const addressData = profileState.addresses.find((address) => address.id === addressId);
  //     const isShippingDefault = profileState.shippingAddressIds?.includes(addressId) || false;
  //     const isBillingDefault = profileState.billingAddressIds?.includes(addressId) || false;
  //     const initialAddressTypes: string[] = [];
  //     if (profileState.shippingAddressIds?.includes(addressId)) initialAddressTypes.push('shipping');
  //     if (profileState.billingAddressIds?.includes(addressId)) initialAddressTypes.push('billing');
  //     const country = addressData?.country.trim();

  //     if (addressData) {
  //       reset({
  //         addressType: initialAddressTypes,
  //         country: country || '',
  //         city: addressData.city || '',
  //         streetName: addressData.streetName || '',
  //         postalCode: addressData.postalCode || '',
  //         isShippingDefault,
  //         isBillingDefault,
  //       });
  //     }
  //   }
  // }, [profileState, editModeWithAddressId, reset]);

  return (
    <Stack
      component="form"
      onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      noValidate
      autoComplete="off"
      gap={3}
      paddingTop={2}
    >
      <Typography component="h1" variant="h4">
        {isNewAddress ? 'Add Address' : 'Edit Address'}
      </Typography>
      <Controller
        name="addressType"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth>
            <InputLabel id="select-chips-label">Address option</InputLabel>
            <Select
              multiple
              {...field}
              value={field.value || []}
              onChange={(event) => {
                const value = event.target.value;
                // console.log(value)
                field.onChange(value);
                if (Array.isArray(value)) {
                  setSelectedValues(value);
                  // console.log('средняя', value)
                } else if (typeof value === 'string') {
                  setSelectedValues([...selectedValues, value]);
                  // console.log('последняя', value)
                } // при необходимости, если нужны локальные состояния
                // handleAddressType(event);
              }}
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
        )}
      />

      {/* <FormControl fullWidth>
        <InputLabel id="select-chips-label">Address option</InputLabel>
        <Select
          {...register('addressType')}
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
      </FormControl> */}

      <Controller
        name="country"
        control={control}
        render={({ field }) => (
          <FormControl>
            <InputLabel>Country</InputLabel>
            <Select
              label="Country"
              {...field}
              value={field.value || ''}
              onChange={(event) => field.onChange(event.target.value)}
            >
              <MenuItem value="BY">Belarus</MenuItem>
              <MenuItem value="RU">Russia</MenuItem>
            </Select>
          </FormControl>
        )}
      />
      {/* <FormControl fullWidth error={!!errors.country}>
        <InputLabel>Country</InputLabel>
        <Select label="Country" {...control.register('country')}>
          <MenuItem value="BY">Belarus</MenuItem>
          <MenuItem value="RU">Russia</MenuItem>
        </Select>
        {errors.country && <FormHelperText>{errors.country.message}</FormHelperText>}
      </FormControl> */}
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
      <Controller
        control={control}
        name="isShippingDefault"
        render={({ field }) => (
          <FormControlLabel
            control={
              <Switch
                checked={field.value || false}
                onChange={(event) => {
                  field.onChange(event.target.checked);
                  // handleDefaultChange('shipping');
                }}
              />
            }
            label="Use as shipping default"
            labelPlacement="end"
            sx={{ width: 'fit-content', m: 0 }}
          />
        )}
      />
      <Controller
        control={control}
        name="isBillingDefault"
        render={({ field }) => (
          <FormControlLabel
            control={
              <Switch
                checked={field.value || false}
                onChange={(event) => {
                  field.onChange(event.target.checked);
                  // handleDefaultChange('billing');
                }}
              />
            }
            label="Use as billing default"
            labelPlacement="end"
            sx={{ width: 'fit-content', m: 0 }}
          />
        )}
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
