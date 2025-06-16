import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CategoryList from '@/components/catalog/categories-list';
import type { CategoryWithChildren } from '@/components/catalog';

describe('CategoryList', () => {
  const categories: CategoryWithChildren[] = [
    {
      id: '1',
      version: 1,
      createdAt: new Date().toISOString(),
      lastModifiedAt: new Date().toISOString(),
      slug: { en: 'category-1' },
      name: { en: 'Category 1' },
      children: [],
      orderHint: '0.1',
      parent: undefined,
      externalId: undefined,
      key: undefined,
      description: undefined,
      metaTitle: undefined,
      metaDescription: undefined,
      metaKeywords: undefined,
      ancestors: [],
      custom: undefined,
      createdBy: undefined,
      lastModifiedBy: undefined,
    },
    {
      id: '2',
      version: 1,
      createdAt: new Date().toISOString(),
      lastModifiedAt: new Date().toISOString(),
      slug: { en: 'category-2' },
      name: { en: 'Category 2' },
      children: [],
      orderHint: '0.2',
      parent: undefined,
      externalId: undefined,
      key: undefined,
      description: undefined,
      metaTitle: undefined,
      metaDescription: undefined,
      metaKeywords: undefined,
      ancestors: [],
      custom: undefined,
      createdBy: undefined,
      lastModifiedBy: undefined,
    },
  ];

  const handleCategoryClick = jest.fn(async () => {});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders categories and calls handleCategoryClick on click', () => {
    render(
      <CategoryList categories={categories} selectedCategoryId={null} handleCategoryClick={handleCategoryClick} />,
    );

    expect(screen.getByText('Categories')).toBeInTheDocument();

    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText('Category 2')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Category 1'));

    expect(handleCategoryClick).toHaveBeenCalledWith('1');
  });
});
