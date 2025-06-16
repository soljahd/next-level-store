import { apiRoot, setPasswordApiRoot, resetApiRoot } from '@/lib/commercetools/client';
import type { LoginFormData, RegisterFormData } from '@/lib/validation';

export async function loginCustomer({ email, password }: LoginFormData) {
  try {
    const customer = {
      email,
      password,
      activeCartSignInMode: 'MergeWithExistingCustomerCart',
      updateProductData: false,
    };
    const response = await apiRoot.me().login().post({ body: customer }).execute();
    setPasswordApiRoot(email, password);
    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new TypeError(`Login failed: ${error.message}`);
    }
  }
}

export function logoutCustomer() {
  resetApiRoot();
}

export async function registerCustomer({
  email,
  password,
  firstName,
  lastName,
  dateOfBirth,
  shippingAddress,
  billingAddress,
}: RegisterFormData) {
  const addresses = [shippingAddress];
  if (billingAddress) {
    addresses.push(billingAddress);
  }

  const shippingAddressIndex = 0;
  const billingAddressIndex = addresses.length > 1 ? 1 : 0;
  const defaultShippingAddressIndex = shippingAddress.isDefault ? 0 : undefined;
  let defaultBillingAddressIndex: number | undefined;
  if (addresses.length > 1 && billingAddress?.isDefault) {
    defaultBillingAddressIndex = 1;
  } else if (addresses.length === 1 && shippingAddress?.isDefault) defaultBillingAddressIndex = 0;

  try {
    const newCustomer = {
      email,
      password,
      firstName,
      lastName,
      dateOfBirth: dateOfBirth.format('YYYY-MM-DD'),
      addresses,
      shippingAddresses: [shippingAddressIndex],
      billingAddresses: [billingAddressIndex],
      defaultShippingAddress: defaultShippingAddressIndex,
      defaultBillingAddress: defaultBillingAddressIndex,
    };

    const response = await apiRoot.me().signup().post({ body: newCustomer }).execute();
    setPasswordApiRoot(email, password);
    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new TypeError(`Registration failed: ${error.message}`);
    }
  }
}
