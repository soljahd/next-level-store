'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, IconButton, Paper, Stack, Typography } from '@mui/material';
import { Add, Edit } from '@mui/icons-material';
import type { Customer } from '@commercetools/platform-sdk';
import UserAddress from '@/components/user-address';
import EditPassword from '@/components/edit-password';
import EditProfile from '@/components/edit-profile';
import EditAddress from '@/components/edit-address';
import { getMyProfile } from '@/lib/commercetools/profile';
import { useAuthStore } from '@/lib/store/auth-store';
import { enqueueSnackbar } from 'notistack';

export default function Profile() {
  const [editingMode, setEditingMode] = useState<string | null>(null);
  const [profileState, setProfileState] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
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

  const { isLoggedIn, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace('/login');
    }
  }, [isLoading, isLoggedIn, router]);

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        if (!data) {
          throw new Error('Данные профиля не найдены');
        }
        setProfileState(data);
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile().catch(() => {
      setLoading(false);
    });
  }, [isLoggedIn]);

  if (!isLoggedIn || loading || isLoading) {
    return null;
  }

  if (profileState) {
    return (
      <>
        {editingMode === null ? (
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
                <UserField label="First Name: " value={profileState.firstName || ''} />
                <UserField label="Last Name: " value={profileState.lastName || ''} />
                <UserField label="Date of Birth: " value={profileState.dateOfBirth || ''} />
                <UserField label="Email: " value={profileState.email || ''} />
                <IconButton
                  onClick={() => setEditingMode('editProfile')}
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
                <UserField
                  label="Password: "
                  value={'*'.repeat(profileState.password ? profileState.password.length : 5)}
                ></UserField>
                <IconButton
                  color="primary"
                  aria-label="edit password"
                  onClick={() => setEditingMode('editPassword')}
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
                {profileState.addresses.map((address) => {
                  let addressId = '';
                  if (address.id) {
                    addressId = address.id;
                  } else {
                    addressId = '';
                  }

                  let shippingAddressIds: string[] = [];
                  if (profileState.shippingAddressIds) {
                    shippingAddressIds = profileState.shippingAddressIds;
                  } else {
                    shippingAddressIds = [];
                  }

                  let billingAddressesIds: string[] = [];
                  if (profileState.billingAddressIds) {
                    billingAddressesIds = profileState.billingAddressIds;
                  } else {
                    billingAddressesIds = [];
                  }

                  const isShipping = shippingAddressIds.includes(addressId);
                  const isShippingDefault = profileState.defaultShippingAddressId === addressId;
                  const isBilling = billingAddressesIds.includes(addressId);
                  const isBillingDefault = profileState.defaultBillingAddressId === addressId;
                  return (
                    <UserAddress
                      key={address.id}
                      addressId={address.id || ''}
                      address={address.streetName || ''}
                      city={address.city || ''}
                      country={address.country}
                      postcode={address.postalCode || ''}
                      isShipping={isShipping}
                      isShippingDefault={isShippingDefault}
                      isBilling={isBilling}
                      isBillingDefault={isBillingDefault}
                      setEditingMode={setEditingMode}
                      setProfileState={setProfileState}
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
        ) : editingMode === 'editPassword' ? (
          <EditPassword setEditingMode={setEditingMode} setProfileState={setProfileState} />
        ) : editingMode === 'editProfile' ? (
          <EditProfile profileState={profileState} setEditingMode={setEditingMode} setProfileState={setProfileState} />
        ) : editingMode.includes('editAddress') ? (
          <EditAddress
            setEditingMode={setEditingMode}
            isNewAddress={false}
            profileState={profileState}
            setProfileState={setProfileState}
            editModeWithAddressId={editingMode}
          />
        ) : (
          <EditAddress
            profileState={profileState}
            setEditingMode={setEditingMode}
            isNewAddress={true}
            setProfileState={setProfileState}
          />
        )}
      </>
    );
  } else {
    return null;
  }
}

type FieldProps = {
  label: string;
  value: string;
};

function UserField(props: FieldProps) {
  const { label, value } = props;

  return (
    <Stack direction="row" spacing={2}>
      <Typography component="p" variant="body2" sx={{ minWidth: '80px' }}>
        {label}
      </Typography>
      <Typography component="p" variant="body2" color="text.secondary">
        {value}
      </Typography>
    </Stack>
  );
}
