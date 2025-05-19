import { render, screen } from '@testing-library/react';
import IconButtonLink from '@/components/icon-button-link';
import '@testing-library/jest-dom';

describe('IconButtonLink', () => {
  const mockIcon = <span data-testid="mock-icon">Icon</span>;
  const mockText = 'Test Button';

  it('renders as a button with an icon and text', () => {
    render(<IconButtonLink icon={mockIcon} text={mockText} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    expect(screen.getByText(mockText)).toBeInTheDocument();
  });

  it('the text has the correct Typography class', () => {
    render(<IconButtonLink icon={mockIcon} text={mockText} />);

    const textElement = screen.getByText(mockText);
    expect(textElement).toHaveClass('MuiTypography-button');
  });

  it('renders as a link if href is present', () => {
    const testHref = '/test-path';
    render(<IconButtonLink href={testHref} icon={mockIcon} text={mockText} />);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', testHref);
  });

  it('accepts and applies additional props', () => {
    render(<IconButtonLink icon={mockIcon} text={mockText} data-testid="custom-button" sx={{ color: 'red' }} />);

    const button = screen.getByTestId('custom-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveStyle({ color: 'red' });
  });

  it('preserves button type when href is missing', () => {
    render(<IconButtonLink icon={mockIcon} text={mockText} type="submit" />);

    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});
