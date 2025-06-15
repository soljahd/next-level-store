import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterForm from '@/components/catalog/filters-form';
import type { ProductProjection } from '@commercetools/platform-sdk';
import type { CategoryWithChildren } from '@/components/catalog';

describe('FilterForm', () => {
  const mockSetCategoryId = jest.fn();
  const mockSetFilterOption = jest.fn();
  const mockHandleFilterApply = jest.fn().mockImplementation(async () => {});

  const categories: CategoryWithChildren[] = [
    {
      id: 'cat1',
      name: { en: 'Category 1' },
      children: [],
      version: 1,
      createdAt: '2020-01-01',
      lastModifiedAt: '2020-01-01',
      slug: { en: 'category-1' },
      ancestors: [],
      orderHint: '0',
    },
  ];

  const products: ProductProjection[] = [
    {
      id: 'prod1',
      masterVariant: {
        id: 1,
        sku: 'sku1',
        attributes: [{ name: 'author', value: 'Author 1' }],
        images: [],
        prices: [],
      },
      name: { en: 'Product 1' },
      slug: { en: 'product-1' },
      categories: [],
      categoryOrderHints: {},
      description: { en: 'desc' },
      key: 'key1',
      metaDescription: { en: 'meta desc' },
      metaKeywords: { en: 'meta key' },
      metaTitle: { en: 'meta title' },
      searchKeywords: {},
      taxCategory: { typeId: 'tax-category', id: 'tax1' },
      productType: { typeId: 'product-type', id: 'product-type-id' },
      variants: [],
      version: 1,
      createdAt: '2020-01-01',
      lastModifiedAt: '2020-01-01',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders and applies filters', () => {
    render(
      <FilterForm
        products={products}
        categories={categories}
        categoryId={null}
        setCategoryId={mockSetCategoryId}
        setFilterOption={mockSetFilterOption}
        handleFilterApply={mockHandleFilterApply}
      />,
    );

    const applyButton = screen.getByRole('button', { name: /apply/i });
    expect(applyButton).toBeInTheDocument();

    fireEvent.click(applyButton);

    expect(mockSetFilterOption).toHaveBeenCalled();
    expect(mockHandleFilterApply).toHaveBeenCalled();
  });
});
