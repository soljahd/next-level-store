import React from 'react';
import { render, screen } from '@testing-library/react';
import EditAddress from '@/components/profile/edit-address';
import type { Customer } from '@commercetools/platform-sdk';

jest.mock('@/lib/commercetools/profile', () => ({
  addMyNewAddress: jest.fn(),
  updateMyAddress: jest.fn(),
}));

jest.mock('notistack', () => ({
  enqueueSnackbar: jest.fn(),
}));

describe('EditAddress', () => {
  const mockSetProfileState = jest.fn();
  const mockSetEditingMode = jest.fn();

  const mockProfileState: Customer = {
    id: 'customer1',
    version: 1,
    addresses: [],
    shippingAddressIds: [],
    billingAddressIds: [],
    defaultShippingAddressId: '',
    defaultBillingAddressId: '',
    email: '',
    firstName: '',
    lastName: '',
    createdAt: '',
    lastModifiedAt: '',
    authenticationMode: 'Password',
    customerNumber: '',
    key: '',
    middleName: '',
    salutation: '',
    stores: [],
    title: '',
    vatId: '',
    locale: '',
    externalId: '',
    isEmailVerified: false,
  };

  it('renders Add Address title when isNewAddress is true', () => {
    render(
      <EditAddress
        isNewAddress={true}
        profileState={mockProfileState}
        setProfileState={mockSetProfileState}
        setEditingMode={mockSetEditingMode}
      />,
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Add Address');
  });

  it('renders Edit Address title when isNewAddress is false', () => {
    render(
      <EditAddress
        isNewAddress={false}
        editModeWithAddressId="id---fakeid"
        profileState={{
          ...mockProfileState,
          addresses: [{ id: 'fakeid', country: '', city: '', streetName: '', postalCode: '' }],
          shippingAddressIds: [],
          billingAddressIds: [],
        }}
        setProfileState={mockSetProfileState}
        setEditingMode={mockSetEditingMode}
      />,
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Edit Address');
  });
});
