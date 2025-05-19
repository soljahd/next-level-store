import { useAuthStore } from '../lib/store/auth-store';

describe('Auth Store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sets the isLoggedIn state when logging in', () => {
    const { setLoginState } = useAuthStore.getState();

    const loginData = {
      email: 'test@example.com',
      password: '1234',
    };

    expect(useAuthStore.getState().isLoggedIn).toBe(false);

    setLoginState(loginData);

    expect(useAuthStore.getState().isLoggedIn).toBe(true);
  });
});
