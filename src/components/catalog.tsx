'use client';
import { useState, useEffect } from 'react';
import { Stack, Box, Typography, Button, Breadcrumbs, Link, type SelectChangeEvent } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { type ProductProjection, type Category } from '@commercetools/platform-sdk';
import { searchProducts, getAllCategories } from '@/lib/commercetools/catalog';
import ProductsList from '@/components/product-list';
import SortSelect from '@/components/sort-select';
import FilterForm from '@/components/filters-form';

export type CategoryWithChildren = {
  children?: CategoryWithChildren[];
} & Category;

type BreadcrumbItem = {
  id: string;
  name: string;
};

export type FilterOption = {
  categoryId?: string;
  authors?: string[];
  yearOfPublication?: {
    min: number;
    max: number;
  };
  priceRange?: {
    min: number;
    max: number;
  };
};

export default function CatalogPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductProjection[]>([]);
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [sortOption, setSortOption] = useState<string>('name.en asc');
  const [filterOption, setFilterOption] = useState<FilterOption>({});
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  const buildCategoryPath = (
    categories: CategoryWithChildren[],
    targetId: string,
    path: BreadcrumbItem[] = [{ id: 'root', name: 'Books' }],
  ): BreadcrumbItem[] | null => {
    for (const category of categories) {
      const currentPath = [...path, { id: category.id, name: category.name?.en || 'Untitled' }];

      if (category.id === targetId) {
        return currentPath;
      }

      if (category.children?.length) {
        const foundPath = buildCategoryPath(category.children, targetId, currentPath);
        if (foundPath) return foundPath;
      }
    }
    return null;
  };

  const handleCategorySelect = (id: string | null) => {
    setCategoryId(id);

    if (!id) {
      setBreadcrumbs([{ id: 'root', name: 'Home' }]);
      return;
    }

    const path = buildCategoryPath(categories, id);
    if (path) {
      setBreadcrumbs(path);
    }
  };

  const handleBreadcrumbClick = async (id: string) => {
    if (id === 'root') {
      setCategoryId(null);
      setBreadcrumbs([{ id: 'root', name: 'Books' }]);
      await handleFilterApply({});
      return;
    }

    setCategoryId(id);
    const newFilterOption = {
      categoryId: id,
    };
    setFilterOption(newFilterOption);
    await handleFilterApply(newFilterOption);

    const path = buildCategoryPath(categories, id);
    if (path) {
      setBreadcrumbs(path);
    }
  };

  const handleSortChange = async (event: SelectChangeEvent) => {
    const data = await searchProducts({
      limit: 50,
      offset: 0,
      sort: event.target.value,
      categoryId: filterOption.categoryId,
      authors: filterOption.authors,
      yearOfPublication: { min: filterOption.yearOfPublication?.min, max: filterOption.yearOfPublication?.max },
      priceRange: { min: filterOption.priceRange?.min, max: filterOption.priceRange?.max },
    });
    const products = data?.results;
    if (products) setProducts(products);

    setSortOption(event.target.value);
  };

  const handleFilterApply = async (filters: FilterOption) => {
    const data = await searchProducts({
      limit: 50,
      offset: 0,
      sort: sortOption,
      categoryId: filters.categoryId,
      authors: filters.authors,
      yearOfPublication: { min: filters.yearOfPublication?.min, max: filters.yearOfPublication?.max },
      priceRange: { min: filters.priceRange?.min, max: filters.priceRange?.max },
    });
    const products = data?.results;
    if (products) setProducts(products);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const categoriesResponse = await getAllCategories();
        if (!categoriesResponse) return;
        const allCategories = [...categoriesResponse.results];

        const buildTree = (categories: Category[]) => {
          const map = new Map<string, Category & { children: Category[] }>();
          const tree: Category[] = [];

          categories.forEach((category) => {
            map.set(category.id, { ...category, children: [] });
          });

          map.forEach((category) => {
            const parentId = category.parent?.obj?.id || category.parent?.id;
            if (parentId) {
              map.get(parentId)?.children.push(category);
            } else {
              tree.push(category);
            }
          });

          return tree;
        };

        const categoryTree = buildTree(allCategories);
        setCategories(categoryTree);

        const data = await searchProducts({ limit: 50, offset: 0, sort: sortOption });
        if (data) {
          setProducts(data.results);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData().catch(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h2" sx={{ fontSize: '3rem', fontWeight: 'bold', color: 'primary.main' }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
      <FilterForm
        products={products}
        categories={categories}
        categoryId={categoryId}
        setCategoryId={handleCategorySelect}
        setFilterOption={setFilterOption}
        handleFilterApply={handleFilterApply}
      />

      <Box sx={{ flex: '1 1 75%', minWidth: 300, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            color={breadcrumbs.length === 1 ? 'text.primary' : 'inherit'}
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => void handleBreadcrumbClick('root')}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            All
          </Link>
          {breadcrumbs.slice(1).map((crumb, index) => (
            <Link
              key={crumb.id}
              underline={index === breadcrumbs.length - 2 ? 'none' : 'hover'}
              color={index === breadcrumbs.length - 2 ? 'text.primary' : 'inherit'}
              sx={{ cursor: 'pointer' }}
              onClick={() => void handleBreadcrumbClick(crumb.id)}
            >
              {crumb.name}
            </Link>
          ))}
        </Breadcrumbs>

        <Stack direction="row" gap={2} sx={{ justifyContent: { xs: 'space-around', sm: 'start' } }}>
          <SortSelect sortOption={sortOption} handleSortChange={handleSortChange} />
          <Button variant="outlined" fullWidth sx={{ flex: 1, maxWidth: 160, display: { xs: 'block', sm: 'none' } }}>
            Filters
          </Button>
        </Stack>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1.5 }}>
          <ProductsList products={products} />
        </Box>
      </Box>
    </Box>
  );
}
