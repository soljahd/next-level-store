import '@testing-library/jest-dom';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import 'cross-fetch/polyfill';

const testEnvironment = dotenv.config({ path: '.env.test' });
dotenvExpand.expand(testEnvironment);

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
}));
