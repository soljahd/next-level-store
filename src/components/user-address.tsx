// import { deleteMyAddress } from '@/lib/commercetools/profile';
import type { Customer } from '@commercetools/platform-sdk';
import { Delete, Edit } from '@mui/icons-material';
import { Chip, IconButton, Paper, Stack, Typography } from '@mui/material';
import type { Dispatch, SetStateAction } from 'react';

type UserAddressProps = {
  addressId: string;
  address: string;
  city: string;
  country: string;
  postcode: string;
  isShipping: boolean;
  isShippingDefault: boolean;
  isBilling: boolean;
  isBillingDefault: boolean;
  setProfileState: Dispatch<SetStateAction<Customer | null>>;
  setEditingMode: (mode: string | null) => void;
};

export default function UserAddress(props: UserAddressProps) {
  const {
    addressId,
    address,
    city,
    country,
    postcode,
    isShipping,
    isBilling,
    isShippingDefault,
    isBillingDefault,
    // setProfileState,
    setEditingMode,
  } = props;

  const fullCountryName = country === 'BY' ? 'Belarus' : 'Russia';

  return (
    <Paper
      component="div"
      variant="outlined"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        position: 'relative',
        border: '2px solid',
        borderColor: 'primary.light',
        p: 3 / 2,
      }}
    >
      <Typography variant="body1">{address}</Typography>
      <Typography color="text.secondary">{`${city}, ${fullCountryName}, ${postcode}`}</Typography>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {isShipping && <Chip label="Shipping" color="primary" />}
        {isBilling && <Chip label="Billing" color="primary" />}
        {isShipping && isShippingDefault && <Chip label="Shipping Default" color="secondary" />}
        {isBilling && isBillingDefault && <Chip label="Billing Default" color="secondary" />}
      </Stack>
      <IconButton
        onClick={() => {
          setEditingMode(`editAddress---${addressId}`);
        }}
        color="primary"
        aria-label="edit user address"
        sx={{
          position: 'absolute',
          right: '40px',
          top: 1,
        }}
      >
        <Edit />
      </IconButton>
      <IconButton
        // onClick={async () => {
        //   try {
        //     const response = await deleteMyAddress(addressId);
        //     if (!response) {
        //       throw new Error('Ошибка удаления адреса');
        //     }
        //     setProfileState(response);
        //   } catch (error) {
        //     if (error instanceof Error) {
        //       console.error('Ошибка удаления адреса', error.message);
        //     }
        //   }
        // }}
        color="primary"
        aria-label="delete user address"
        sx={{
          position: 'absolute',
          right: 1,
          top: 1,
        }}
      >
        <Delete />
      </IconButton>
    </Paper>
  );
}
