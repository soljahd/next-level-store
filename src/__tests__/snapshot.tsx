import { render } from '@testing-library/react';
import Home from '@/app/main/page';
import Header from '@/components/header';
import Footer from '@/components/footer';

it('renders homepage unchanged', () => {
  const { container } = render(
    <>
      <Header />
      <Home />
      <Footer />
    </>,
  );
  expect(container).toMatchSnapshot();
});
