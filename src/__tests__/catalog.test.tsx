import { render, screen } from '@testing-library/react';
import Catalog from '@/app/catalog/page';

jest.mock('@/components/catalog', () => {
  const MockCatalogPage = () => <div>Mocked Catalog Page</div>;
  MockCatalogPage.displayName = 'MockCatalogPage';
  return MockCatalogPage;
});

describe('Catalog Page', () => {
  it('renders without crashing and shows the catalog content', () => {
    render(<Catalog />);
    expect(screen.getByText('Mocked Catalog Page')).toBeInTheDocument();
  });
});
