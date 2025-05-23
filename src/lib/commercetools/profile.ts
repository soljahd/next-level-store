import type { MyCustomerUpdateAction } from '@commercetools/platform-sdk';
import { apiRoot } from '@/lib/commercetools/client';
import type { profileEditFormData, passwordChangeFormData, addressEditFormData } from '@/lib/validation';

export async function getMyProfile() {
  try {
    const response = await apiRoot.me().get().execute();
    return response.body;
  } catch (error) {
    if (error instanceof Error) {
      throw new TypeError(error.message);
    }
  }
}

export async function updateMyProfile({ firstName, lastName, dateOfBirth, email }: profileEditFormData) {
  try {
    const customer = await apiRoot.me().get().execute();
    const version = customer.body.version;

    const response = await apiRoot
      .me()
      .post({
        body: {
          version,
          actions: [
            { action: 'setFirstName', firstName: firstName },
            { action: 'setLastName', lastName: lastName },
            { action: 'setDateOfBirth', dateOfBirth: dateOfBirth.format('YYYY-MM-DD') },
            { action: 'changeEmail', email: email },
          ],
        },
      })
      .execute();

    return response.body;
  } catch (error) {
    if (error instanceof Error) {
      throw new TypeError(error.message);
    }
  }
}

export async function changeMyPassword({ currentPassword, newPassword }: passwordChangeFormData) {
  try {
    const customer = await apiRoot.me().get().execute();
    const version = customer.body.version;

    const response = await apiRoot.me().password().post({ body: { version, currentPassword, newPassword } }).execute();

    return response.body;
  } catch (error) {
    if (error instanceof Error) {
      throw new TypeError(error.message);
    }
  }
}

export async function updateMyAddress(
  addressId: string,
  { addressType, streetName, postalCode, country, city, isShippingDefault, isBillingDefault }: addressEditFormData,
) {
  try {
    const customer = await apiRoot.me().get().execute();
    const version = customer.body.version;
    const currentShippingIds = customer.body.shippingAddressIds || [];
    const currentBillingIds = customer.body.billingAddressIds || [];
    const isCurrentlyShipping = currentShippingIds.includes(addressId);
    const isCurrentlyBilling = currentBillingIds.includes(addressId);
    const isCurrentlyShippingDefault = customer.body.defaultShippingAddressId === addressId;
    const isCurrentlyBillingDefault = customer.body.defaultBillingAddressId === addressId;
    const newAddress = { streetName, postalCode, country, city };
    const actions: MyCustomerUpdateAction[] = [{ action: 'changeAddress', addressId, address: newAddress }];

    const wantsShipping = addressType.includes('shipping');
    if (wantsShipping && !isCurrentlyShipping) {
      actions.push({ action: 'addShippingAddressId', addressId });
    } else if (!wantsShipping && isCurrentlyShipping) {
      actions.push({ action: 'removeShippingAddressId', addressId });
    }

    const wantsBilling = addressType.includes('billing');
    if (wantsBilling && !isCurrentlyBilling) {
      actions.push({ action: 'addBillingAddressId', addressId });
    } else if (!wantsBilling && isCurrentlyBilling) {
      actions.push({ action: 'removeBillingAddressId', addressId });
    }

    if (isShippingDefault) {
      actions.push({ action: 'setDefaultShippingAddress', addressId });
    } else if (isCurrentlyShippingDefault) {
      actions.push({ action: 'setDefaultShippingAddress' });
    }

    if (isBillingDefault) {
      actions.push({ action: 'setDefaultBillingAddress', addressId });
    } else if (isCurrentlyBillingDefault) {
      actions.push({ action: 'setDefaultBillingAddress' });
    }

    const response = await apiRoot.me().post({ body: { version, actions } }).execute();

    return response.body;
  } catch (error) {
    if (error instanceof Error) {
      throw new TypeError(error.message);
    }
  }
}
