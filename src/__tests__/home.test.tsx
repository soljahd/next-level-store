import { render, screen } from '@testing-library/react';
import Home from '@/app/main/page';

jest.mock('@/components/main/image-slider', () => {
  const MockImageSlider = () => <div data-testid="image-slider">Mocked ImageSlider</div>;
  MockImageSlider.displayName = 'MockImageSlider';
  return MockImageSlider;
});
describe('Home Page', () => {
  it('renders ImageSlider inside main container', () => {
    render(<Home />);
    expect(screen.getByTestId('image-slider')).toBeInTheDocument();
    expect(screen.getByText('Mocked ImageSlider')).toBeInTheDocument();
  });
});
