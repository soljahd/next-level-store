import { render } from '@testing-library/react';
import Home from '../app/main/page';

describe('Home page', () => {
  it('renders without crashing', () => {
    render(<Home />);
  });
});
