import type { Metadata } from 'next';
import { Container } from '@mui/material';
import Profile from '@/components/profile';

export const metadata: Metadata = {
  title: 'Profile | Next-Level Store',
  description: 'Manage your account, track orders, and customize your profile settings on Next-Level Store.',
  keywords: ['online store', 'shop', 'ecommerce', 'user profile', 'account settings', 'order tracking', 'user account'],
  robots: {
    index: true,
    follow: true,
  },
};

export default function ProfilePage() {
  const addressData = [
    {
      address: 'Lenina 12/42',
      city: 'city',
      country: 'country',
      postcode: 333_333,
      isShipping: true,
      isShippingDefault: false,
      isBilling: true,
      isBillingDefault: true,
    },
    {
      address: 'hello',
      city: 'Hola',
      country: 'Bel',
      postcode: 333_333,
      isShipping: false,
      isShippingDefault: false,
      isBilling: true,
      isBillingDefault: false,
    },
    {
      address: 'address',
      city: 'city',
      country: 'country',
      postcode: 333_333,
      isShipping: true,
      isShippingDefault: true,
      isBilling: true,
      isBillingDefault: false,
    },
  ];
  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{
        flex: 1,
      }}
    >
      <Profile addressData={addressData}></Profile>
    </Container>
  );
}
