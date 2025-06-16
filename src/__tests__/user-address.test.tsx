import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserAddress from '@/components/profile/user-address';
import { deleteMyAddress } from '@/lib/commercetools/profile';
import type { Customer } from '@commercetools/platform-sdk';

jest.mock('notistack', () => ({
  enqueueSnackbar: jest.fn(),
}));

jest.mock('@/lib/commercetools/profile', () => ({
  deleteMyAddress: jest.fn(),
}));

const deleteMyAddressMock = jest.mocked(deleteMyAddress);

describe('UserAddress component', () => {
  const mockSetProfileState = jest.fn();
  const mockSetEditingMode = jest.fn();

  const mockCustomer = {
    id: 'mock-id',
    version: 1,
    email: '',
    firstName: '',
    lastName: '',
    createdAt: '',
    lastModifiedAt: '',
    authenticationMode: 'Password',
    addresses: [],
    shippingAddressIds: [],
    billingAddressIds: [],
    isEmailVerified: false,
    stores: [],
  } satisfies Customer;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders address and handles delete click', async () => {
    deleteMyAddressMock.mockResolvedValue(mockCustomer);

    render(
      <UserAddress
        addressId="addr-1"
        address="Main St 123"
        city="Minsk"
        country="BY"
        postcode="220000"
        isShipping={true}
        isBilling={true}
        isShippingDefault={true}
        isBillingDefault={false}
        setProfileState={mockSetProfileState}
        setEditingMode={mockSetEditingMode}
      />,
    );

    expect(screen.getByText('Main St 123')).toBeInTheDocument();
    expect(screen.getByText('Minsk, Belarus, 220000')).toBeInTheDocument();
    expect(screen.getByText('Shipping')).toBeInTheDocument();
    expect(screen.getByText('Billing')).toBeInTheDocument();
    expect(screen.getByText('Shipping Default')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('delete user address'));

    await waitFor(() => {
      expect(deleteMyAddress).toHaveBeenCalledWith('addr-1');
      expect(mockSetProfileState).toHaveBeenCalledWith(mockCustomer);
    });
  });

  it('calls setEditingMode on edit button click', () => {
    render(
      <UserAddress
        addressId="addr-1"
        address="Main St 123"
        city="Minsk"
        country="BY"
        postcode="220000"
        isShipping={false}
        isBilling={false}
        isShippingDefault={false}
        isBillingDefault={false}
        setProfileState={mockSetProfileState}
        setEditingMode={mockSetEditingMode}
      />,
    );

    fireEvent.click(screen.getByLabelText('edit user address'));
    expect(mockSetEditingMode).toHaveBeenCalledWith('editAddress---addr-1');
  });
});
