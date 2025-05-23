import { loginCustomer, logoutCustomer } from '@/lib/commercetools/auth';

jest.mock('@/lib/commercetools/client', () => {
  return {
    apiRoot: {
      me: () => ({
        login: () => ({
          post: jest.fn().mockImplementation(() => ({
            execute: jest.fn().mockResolvedValue({ token: 'abc' }),
          })),
        }),
      }),
    },
    setPasswordApiRoot: jest.fn(),
    resetApiRoot: jest.fn(),
  };
});

import { resetApiRoot } from '@/lib/commercetools/client';

describe('enter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('successful login', async () => {
    const result = await loginCustomer({ email: 'a@b.com', password: '123' });
    expect(result).toEqual({ token: 'abc' });
  });

  test('exit', () => {
    logoutCustomer();
    expect(resetApiRoot).toHaveBeenCalled();
  });
});
