import apiRoot from '@/lib/commercetools/client';
import type { MyCustomerSignin, CustomerDraft } from '@commercetools/platform-sdk';

export async function loginCustomer(email: string, password: string) {
  try {
    const customer: MyCustomerSignin = {
      email,
      password,
      activeCartSignInMode: 'MergeWithExistingCustomerCart',
      updateProductData: false,
    };
    const response = await apiRoot
      .me()
      .login()
      .post({
        body: customer,
      })
      .execute();

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new TypeError(`Login failed: ${error.message}`);
    }
  }
}

export async function registerCustomer({
  email,
  password,
  firstName,
  lastName,
  dateOfBirth,
  addresses,
}: CustomerDraft) {
  try {
    const newCustomer: CustomerDraft = {
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      addresses,
      // defaultShippingAddress: 0,
      // defaultBillingAddress: 0,
    };

    const response = await apiRoot
      .customers()
      .post({
        body: newCustomer,
      })
      .execute();

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new TypeError(`Registration failed: ${error.message}`);
    }
  }
}
