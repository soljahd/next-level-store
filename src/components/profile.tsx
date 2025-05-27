import { Button, IconButton, Paper, Stack, Typography } from '@mui/material';
import UserField from './user-field';
import { Add, Edit } from '@mui/icons-material';
import UserAddress from './user-address';

type ProfileProps = {
  addressData: {
    address: string;
    city: string;
    country: string;
    postcode: number;
    isShipping: boolean;
    isShippingDefault: boolean;
    isBilling: boolean;
    isBillingDefault: boolean;
  }[];
  setEditingMode: (mode: string | null) => void;
};

export default function Profile(props: ProfileProps) {
  const { addressData, setEditingMode } = props;

  return (
    <Stack spacing={2}>
      <Typography component="h1" variant="h4">
        My Profile
      </Typography>
      <Stack spacing={0.5}>
        <Typography component="span" variant="body2">
          User
        </Typography>
        <Paper
          component="div"
          variant="outlined"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            position: 'relative',
            border: '2px solid',
            borderColor: 'primary.light',
            p: 3 / 2,
          }}
        >
          <UserField label="First Name: " value="Petr"></UserField>
          <UserField label="Last Name: " value="Petrov"></UserField>
          <UserField label="Date of Birth: " value="01/01/2000"></UserField>
          <UserField label="Email: " value="pet@pet.pe"></UserField>
          <IconButton
            onClick={() => setEditingMode('profile')}
            color="primary"
            aria-label="edit user info"
            sx={{
              position: 'absolute',
              right: 1,
              top: 1,
            }}
          >
            <Edit />
          </IconButton>
        </Paper>
      </Stack>
      <Stack spacing={0.5}>
        <Typography component="span" variant="body2">
          Password
        </Typography>
        <Paper
          component="div"
          variant="outlined"
          sx={{
            position: 'relative',
            border: '2px solid',
            borderColor: 'primary.light',
            p: 3 / 2,
          }}
        >
          <UserField label="Password: " value={'*'}></UserField>
          <IconButton
            color="primary"
            aria-label="edit password"
            onClick={() => setEditingMode('password')}
            sx={{
              position: 'absolute',
              right: 1,
              top: 1,
            }}
          >
            <Edit />
          </IconButton>
        </Paper>
      </Stack>
      <Stack spacing={0.5} sx={{ position: 'relative' }}>
        <Typography component="p" variant="body2">
          Address
        </Typography>
        <Stack spacing={1}>
          {addressData.map((data, index) => {
            return (
              <UserAddress
                key={`addressData${index}`}
                address={data.address}
                city={data.city}
                country={data.country}
                postcode={data.postcode}
                isShipping={data.isShipping}
                isShippingDefault={data.isShippingDefault}
                isBilling={data.isBilling}
                isBillingDefault={data.isBillingDefault}
                setEditingMode={setEditingMode}
              ></UserAddress>
            );
          })}
          <Button
            variant="outlined"
            onClick={() => setEditingMode('addNewAddress')}
            sx={{ border: '2px solid', borderColor: 'primary.light' }}
          >
            <Add />
            <Typography>Add new address</Typography>
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
