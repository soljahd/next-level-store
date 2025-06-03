'use client';
import { Button, IconButton, Paper, Stack, Typography } from '@mui/material';
import UserField from './user-field';
import { Add, Edit } from '@mui/icons-material';
import UserAddress from './user-address';
import type { Customer } from '@commercetools/platform-sdk';
import { useEffect, useState } from 'react';
import { getMyProfile } from '@/lib/commercetools/profile';
import EditPassword from './edit-password';
import EditProfile from './edit-profile';
import EditAddress from './edit-address';
import { useAuthStore } from '@/lib/store/auth-store';
import { useRouter } from 'next/navigation';
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

  const { isLoggedIn } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/login');
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
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
  }, []);

  if (!isLoggedIn) {
    return null;
  }

  if (loading) {
    return null;
  }

  if (
    !profileState ||
    !profileState.addresses ||
    !profileState.firstName ||
    !profileState.lastName ||
    !profileState.email ||
    !profileState.dateOfBirth
  ) {
    return null;
  } else {
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
                <UserField label="First Name: " value={profileState.firstName || ''}></UserField>
                <UserField label="Last Name: " value={profileState.lastName || ''}></UserField>
                <UserField label="Date of Birth: " value={profileState.dateOfBirth || ''}></UserField>
                <UserField label="Email: " value={profileState.email}></UserField>
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
                  // const addressId = address.id ? address.id : '';
                  // const shippingAddressIds = profileState.shippingAddressIds ? profileState.shippingAddressIds : [];
                  // const billingAddressesIds = profileState.billingAddressIds ? profileState.billingAddressIds : [];
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
  }
}
