import { render, fireEvent } from '@testing-library/react';
import MenuLink from '../components/header/menu-link';

type RouterMock = {
  push: jest.Mock;
};

const mockUseRouter = jest.fn<RouterMock, []>();

jest.mock('next/navigation', () => ({
  useRouter: () => mockUseRouter(),
}));

describe('MenuLink', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    mockUseRouter.mockReturnValue({ push: mockPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders children correctly', () => {
    const { getByText } = render(<MenuLink href="/test">Test Link</MenuLink>);
    expect(getByText('Test Link')).toBeInTheDocument();
  });

  test('calls router.push with href on click', () => {
    const { getByText } = render(<MenuLink href="/test">Test Link</MenuLink>);
    const link = getByText('Test Link');

    fireEvent.click(link);
    expect(mockPush).toHaveBeenCalledWith('/test');
  });

  test('calls handler if provided', () => {
    const mockHandler = jest.fn();
    const { getByText } = render(
      <MenuLink href="/test" handler={mockHandler}>
        Test Link
      </MenuLink>,
    );
    const link = getByText('Test Link');

    fireEvent.click(link);
    expect(mockHandler).toHaveBeenCalled();
  });
});
