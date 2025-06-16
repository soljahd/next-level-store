import { render } from '@testing-library/react';
import Home from '@/app/main/page';
import Header from '@/components/header';
import Footer from '@/components/footer';

jest.mock('@/components/main/image-slider', () => {
  const MockedImageSlider = () => <div>Mocked ImageSlider</div>;
  MockedImageSlider.displayName = 'MockedImageSlider';
  return MockedImageSlider;
});

it('renders full page unchanged', () => {
  const { container } = render(
    <>
      <Header />
      <Home />
      <Footer />
    </>,
  );
  expect(container).toMatchSnapshot();
});
