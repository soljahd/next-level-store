import { Delete, Edit } from '@mui/icons-material';
import { Chip, IconButton, Paper, Stack, Typography } from '@mui/material';

type UserAddressProps = {
  address: string;
  city: string;
  country: string;
  postcode: number;
  isShipping: boolean;
  isShippingDefault: boolean;
  isBilling: boolean;
  isBillingDefault: boolean;
};

export default function UserAddress(props: UserAddressProps) {
  const { address, city, country, postcode, isShipping, isBilling, isShippingDefault, isBillingDefault } = props;

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
      <Typography>{address}</Typography>
      <Typography color="text.secondary">{`${city}, ${country}, ${postcode}`}</Typography>
      <Stack spacing={1} direction="row">
        {isShipping && <Chip label="Shipping" color="primary" />}
        {isBilling && <Chip label="Billing" color="primary" />}
        {isShipping && isShippingDefault && <Chip label="Shipping Default" color="secondary" />}
        {isBilling && isBillingDefault && <Chip label="Billing Default" color="secondary" />}
      </Stack>
      <IconButton
        color="secondary"
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
        color="secondary"
        aria-label="edit user address"
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
