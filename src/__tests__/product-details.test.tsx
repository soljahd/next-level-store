import { render, screen } from '@testing-library/react';
import ProductDetails from '@/components/catalog/product-details';
import type { ProductProjection } from '@commercetools/platform-sdk';

const mockProduct: ProductProjection = {
  id: 'prod1',
  version: 1,
  createdAt: new Date().toISOString(),
  lastModifiedAt: new Date().toISOString(),
  productType: {
    typeId: 'product-type',
    id: 'pt1',
  },
  name: { en: 'Test Product' },
  description: { en: 'Description here' },
  slug: { en: 'test-product' },
  masterVariant: {
    id: 1,
    sku: 'sku1',
    attributes: [
      { name: 'author', value: 'John Doe' },
      { name: 'pages', value: 123 },
    ],
    images: [
      { url: '/image1.jpg', dimensions: { w: 640, h: 480 }, label: 'image1' },
      { url: '/image2.jpg', dimensions: { w: 640, h: 480 }, label: 'image2' },
    ],
    prices: [
      {
        id: 'price1',
        value: {
          type: 'centPrecision',
          centAmount: 2000,
          currencyCode: 'EUR',
          fractionDigits: 2,
        },
        country: 'DE',
      },
    ],
    assets: [],
  },
  variants: [],
  categories: [],
  searchKeywords: {},
  state: undefined,
  taxCategory: undefined,
};

describe('ProductDetails', () => {
  it('renders product title, author, pages and price', () => {
    render(<ProductDetails product={mockProduct} breadcrumb={['Home', 'Books']} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText(/John Doe, 123/)).toBeInTheDocument();
    expect(screen.getByText('€20.00')).toBeInTheDocument();
  });
});
