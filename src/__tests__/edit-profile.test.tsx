import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import EditProfile from '@/components/profile/edit-profile';
import { enqueueSnackbar } from 'notistack';
import * as profileApi from '@/lib/commercetools/profile';
import * as authStore from '@/lib/store/auth-store';
import type { Customer } from '@commercetools/platform-sdk';

jest.mock('notistack', () => ({
  enqueueSnackbar: jest.fn(),
}));

jest.mock('@/lib/commercetools/profile');
jest.mock('@/lib/store/auth-store');

jest.mock('@/lib/commercetools/cart', () => ({
  getActiveCart: jest.fn(() => Promise.resolve({ lineItems: [] })),
}));

const mockSetProfileState = jest.fn();
const mockSetEditingMode = jest.fn();

const mockCustomer: Customer = {
  id: '123',
  version: 1,
  createdAt: new Date().toISOString(),
  lastModifiedAt: new Date().toISOString(),
  email: 'newemail@example.com',
  firstName: 'Jane',
  lastName: 'Smith',
  dateOfBirth: '1990-01-01',
  addresses: [],
  billingAddressIds: [],
  shippingAddressIds: [],
  authenticationMode: 'Password',
  isEmailVerified: true,
  customerNumber: '',
  key: '',
  stores: [],
  middleName: undefined,
  salutation: undefined,
  title: undefined,
  vatId: undefined,
  locale: undefined,
  defaultBillingAddressId: undefined,
  defaultShippingAddressId: undefined,
  externalId: undefined,
  customerGroup: undefined,
  companyName: undefined,
};

describe('EditProfile component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(profileApi.updateMyProfile).mockResolvedValue(mockCustomer);
    jest.mocked(authStore.useAuthStore).mockReturnValue({
      setLoginState: jest.fn(),
      user: { email: 'test@example.com', password: 'testpassword' },
    });
  });

  it('submits the form and updates profile', async () => {
    act(() => {
      render(
        <EditProfile
          profileState={mockCustomer}
          setProfileState={mockSetProfileState}
          setEditingMode={mockSetEditingMode}
        />,
      );
    });

    act(() => {
      fireEvent.change(screen.getByLabelText(/First name/i), {
        target: { value: 'Jane' },
      });
      fireEvent.change(screen.getByLabelText(/Last name/i), {
        target: { value: 'Smith' },
      });
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: 'newemail@example.com' },
      });
    });

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /Save changes/i }));
    });

    await waitFor(() => {
      expect(profileApi.updateMyProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'newemail@example.com',
        }),
      );
      expect(mockSetProfileState).toHaveBeenCalledWith(mockCustomer);
      expect(mockSetEditingMode).toHaveBeenCalledWith(null);
      expect(enqueueSnackbar).toHaveBeenCalledWith('Profile successfully updated', { variant: 'success' });
    });
  });

  it('cancels editing mode when Cancel is clicked', () => {
    act(() => {
      render(
        <EditProfile
          profileState={mockCustomer}
          setProfileState={mockSetProfileState}
          setEditingMode={mockSetEditingMode}
        />,
      );
    });

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    });

    expect(mockSetEditingMode).toHaveBeenCalledWith(null);
  });
});
