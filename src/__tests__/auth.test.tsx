import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { loginCustomer, logoutCustomer, registerCustomer } from '@/lib/commercetools/auth';
import { setPasswordApiRoot, resetApiRoot } from '@/lib/commercetools/client';
import type { LoginFormData, RegisterFormData } from '@/lib/validation';

jest.mock('@/lib/commercetools/client', () => {
  const executeMock = jest.fn().mockResolvedValue({ body: 'mocked response' });

  const me = () => ({
    login: () => ({
      post: () => ({
        execute: executeMock,
      }),
    }),
    signup: () => ({
      post: () => ({
        execute: executeMock,
      }),
    }),
  });

  return {
    apiRoot: { me },
    setPasswordApiRoot: jest.fn(),
    resetApiRoot: jest.fn(),
  };
});

describe('auth-api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loginCustomer calls api and sets password', async () => {
    const loginData: LoginFormData = {
      email: 'test@example.com',
      password: 'securePassword123',
    };

    const result = await loginCustomer(loginData);

    expect(setPasswordApiRoot).toHaveBeenCalledWith(loginData.email, loginData.password);
    expect(result).toEqual({ body: 'mocked response' });
  });

  it('registerCustomer calls api and sets password', async () => {
    const mockDate: Dayjs = dayjs('2000-01-01');

    const registerData: RegisterFormData = {
      email: 'user@example.com',
      password: 'pass1234',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: mockDate,
      shippingAddress: {
        country: 'DE',
        city: 'Berlin',
        streetName: 'Street',
        postalCode: '12345',
        isDefault: true,
      },
      billingAddress: {
        country: 'DE',
        city: 'Berlin',
        streetName: 'Street',
        postalCode: '12345',
        isDefault: true,
      },
    };

    const result = await registerCustomer(registerData);

    expect(setPasswordApiRoot).toHaveBeenCalledWith(registerData.email, registerData.password);
    expect(result).toEqual({ body: 'mocked response' });
  });

  it('logoutCustomer resets api root', () => {
    logoutCustomer();
    expect(resetApiRoot).toHaveBeenCalled();
  });
});
