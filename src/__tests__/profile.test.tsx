import { getMyProfile } from '@/lib/commercetools/profile';

type ApiResponseBody = {
  id?: string;
  firstName?: string;
  [key: string]: unknown;
};

type ExecuteReturnType = Promise<{ body: ApiResponseBody | null }>;

let executeMock: jest.Mock<ExecuteReturnType, []>;
let getMock: jest.Mock<{ execute: jest.Mock<ExecuteReturnType, []> }, []>;
let meMock: jest.Mock<{ get: jest.Mock<{ execute: jest.Mock<ExecuteReturnType, []> }, []> }, []>;

jest.mock('@/lib/commercetools/client', () => ({
  apiRoot: {
    me: () => meMock(),
  },
}));

beforeEach(() => {
  executeMock = jest.fn<ExecuteReturnType, []>();
  getMock = jest.fn(() => ({ execute: executeMock }));
  meMock = jest.fn(() => ({ get: getMock }));
  jest.clearAllMocks();
});

describe('getMyProfile', () => {
  it('Returns the response body on a successful request', async () => {
    const mockBody: ApiResponseBody = { id: 'customer-1', firstName: 'John' };
    executeMock.mockResolvedValue({ body: mockBody });

    const result = await getMyProfile();

    expect(meMock).toHaveBeenCalled();
    expect(getMock).toHaveBeenCalled();
    expect(executeMock).toHaveBeenCalled();
    expect(result).toEqual(mockBody);
  });

  it('Returns an empty object if the response body is empty', async () => {
    executeMock.mockResolvedValue({ body: {} });

    const result = await getMyProfile();

    expect(result).toEqual({});
  });

  it('Returns null if the response body is null', async () => {
    executeMock.mockResolvedValue({ body: null });

    const result = await getMyProfile();

    expect(result).toBeNull();
  });

  it('Throws a TypeError on request failure', async () => {
    executeMock.mockRejectedValue(new Error('fail'));

    await expect(getMyProfile()).rejects.toThrow(TypeError);
  });

  it('execute is called exactly once', async () => {
    executeMock.mockResolvedValue({ body: { id: 'test' } });

    await getMyProfile();

    expect(executeMock).toHaveBeenCalledTimes(1);
  });

  it('Returns the response body with additional fields', async () => {
    const mockBody: ApiResponseBody = { id: '1', firstName: 'Anna', extra: 'value' };
    executeMock.mockResolvedValue({ body: mockBody });

    const result = await getMyProfile();

    expect(result).toEqual(mockBody);
  });

  it('Throws a TypeError with the correct message', async () => {
    const errorMessage = 'network error';
    executeMock.mockRejectedValue(new Error(errorMessage));

    await expect(getMyProfile()).rejects.toThrow(TypeError);
  });
});
