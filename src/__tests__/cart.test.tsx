import { createMyCart } from '@/lib/commercetools/cart';

describe('createMyCart without mocking', () => {
  it('throws TypeError if apiRoot is misconfigured', async () => {
    await expect(createMyCart()).rejects.toThrow(TypeError);
  });
});
