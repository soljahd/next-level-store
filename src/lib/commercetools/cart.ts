import { apiRoot } from '@/lib/commercetools/client';

export async function getMyCart() {
  try {
    const response = await apiRoot.me().activeCart().get().execute();
    return response.body;
  } catch (error) {
    if (error instanceof Error) {
      throw new TypeError(error.message);
    }
  }
}

export async function createMyCart() {
  try {
    const response = await apiRoot
      .me()
      .carts()
      .post({ body: { currency: 'EUR' } })
      .execute();
    return response.body;
  } catch (error) {
    if (error instanceof Error) {
      throw new TypeError(error.message);
    }
  }
}

export async function addToCart(productId: string, quantity: number = 1) {
  try {
    const cart = await getActiveCart();
    if (!cart) throw new TypeError('No Active Cart');
    const version = cart.version;

    const response = await apiRoot
      .me()
      .carts()
      .withId({ ID: cart.id })
      .post({
        body: {
          version,
          actions: [
            {
              action: 'addLineItem',
              productId,
              quantity,
            },
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

export async function removeFromCart(lineItemId: string, quantity?: number) {
  try {
    const cart = await getActiveCart();
    if (!cart) throw new TypeError('No Active Cart');
    const version = cart.version;

    const response = await apiRoot
      .me()
      .carts()
      .withId({ ID: cart.id })
      .post({
        body: {
          version,
          actions: [
            {
              action: 'removeLineItem',
              lineItemId,
              quantity,
            },
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

export async function updateLineItemQuantity(lineItemId: string, quantity: number) {
  try {
    const cart = await getActiveCart();
    if (!cart) throw new TypeError('No Active Cart');
    const version = cart.version;

    const response = await apiRoot
      .me()
      .carts()
      .withId({ ID: cart.id })
      .post({
        body: {
          version,
          actions: [
            {
              action: 'changeLineItemQuantity',
              lineItemId,
              quantity,
            },
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

export async function applyDiscountCode(code: string) {
  try {
    const cart = await getActiveCart();
    if (!cart) throw new TypeError('No Active Cart');
    const version = cart.version;

    const response = await apiRoot
      .me()
      .carts()
      .withId({ ID: cart.id })
      .post({
        body: {
          version,
          actions: [
            {
              action: 'addDiscountCode',
              code,
            },
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

export async function removeDiscountCode(discountCodeId: string) {
  try {
    const cart = await getActiveCart();
    if (!cart) throw new TypeError('No Active Cart');
    const version = cart.version;

    const response = await apiRoot
      .me()
      .carts()
      .withId({ ID: cart.id })
      .post({
        body: {
          version,
          actions: [
            {
              action: 'removeDiscountCode',
              discountCode: {
                typeId: 'discount-code',
                id: discountCodeId,
              },
            },
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

export async function recalculateCart() {
  try {
    const cart = await getActiveCart();
    if (!cart) throw new TypeError('No Active Cart');
    const version = cart.version;

    const response = await apiRoot
      .me()
      .carts()
      .withId({ ID: cart.id })
      .post({
        body: {
          version,
          actions: [
            {
              action: 'recalculate',
            },
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

export async function getActiveCart() {
  try {
    const response = await apiRoot.me().activeCart().get().execute();
    return response.body;
  } catch (error) {
    if (error instanceof Error && (error.message.includes('404') || error.message.includes('not found'))) {
      const newCart = await createMyCart();
      return newCart;
    }
    throw error;
  }
}
