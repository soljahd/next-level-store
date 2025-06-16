'use client';
import { useState, useEffect, Suspense } from 'react';
import {
  Pagination,
  IconButton,
  Drawer,
  Stack,
  Box,
  Typography,
  Button,
  Breadcrumbs,
  Link,
  useTheme,
  useMediaQuery,
  type SelectChangeEvent,
} from '@mui/material';
import { Home as HomeIcon, Close as CloseIcon, FilterList as FilterListIcon } from '@mui/icons-material';
import { useSearchParams } from 'next/navigation';
import { type ProductProjection, type Category } from '@commercetools/platform-sdk';
import { searchProducts, getAllCategories } from '@/lib/commercetools/catalog';
import ProductsList from '@/components/catalog/product-list';
import SortSelect from '@/components/catalog/sort-select';
import FilterForm from '@/components/catalog/filters-form';

export type CategoryWithChildren = {
  children?: CategoryWithChildren[];
} & Category;

type BreadcrumbItem = {
  id: string;
  name: string;
};

export type FilterOption = {
  sort?: string;
  categoryId?: string | null;
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

function Catalog() {
  const searchParameters = useSearchParams();
  const searchQuery = searchParameters.get('search') || '';
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductProjection[]>([]);
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [sortOption, setSortOption] = useState<string>('name.en asc');
  const [filterOption, setFilterOption] = useState<FilterOption>({});
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 8,
    totalResults: 0,
  });

  const fetchProducts = async (page = 1, filters = filterOption) => {
    try {
      // setLoading(true);
      const categoryIdToUse = filters.categoryId === undefined ? categoryId : filters.categoryId;
      const offset = (page - 1) * pagination.limit;

      const data = await searchProducts({
        limit: pagination.limit,
        offset: offset,
        sort: filters.sort || sortOption,
        searchQuery: searchQuery,
        categoryId: categoryIdToUse,
        authors: filters.authors,
        yearOfPublication: {
          min: filters.yearOfPublication?.min,
          max: filters.yearOfPublication?.max,
        },
        priceRange: {
          min: filters.priceRange?.min,
          max: filters.priceRange?.max,
        },
      });

      if (data) {
        setProducts(data.results);
        setPagination((previous) => ({
          ...previous,
          currentPage: page,
          totalResults: data.total || 0,
          totalPages: Math.ceil((data.total || 0) / pagination.limit),
        }));
      }
    } finally {
      setLoading(false);
    }
  };

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
      await fetchProducts(1, { ...filterOption, categoryId: null });
      return;
    }

    setCategoryId(id);
    await fetchProducts(1, { ...filterOption, categoryId: id });
    const path = buildCategoryPath(categories, id);
    if (path) {
      setBreadcrumbs(path);
    }
  };

  const handleSortChange = async (event: SelectChangeEvent) => {
    const newSortOption = event.target.value;
    setSortOption(newSortOption);
    await fetchProducts(1, {
      ...filterOption,
      sort: newSortOption,
    });
  };

  const handleFilterApply = async (filters: FilterOption) => {
    setFilterOption(filters);
    await fetchProducts(1, {
      ...filters,
      sort: filterOption.sort,
    });
  };

  const handlePaginationChange = async (page: number) => {
    await fetchProducts(page);
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

        await fetchProducts(1);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData().catch(() => {
      setLoading(false);
    });
  }, [searchQuery]);

  if (loading) {
    return null;
    // <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    //   <Typography variant="h2" sx={{ fontSize: '3rem', fontWeight: 'bold', color: 'primary.main' }}>
    //     Loading...
    //   </Typography>
    // </Box>
  }

  return (
    <>
      {searchQuery && (
        <Typography sx={{ width: '100%', p: 2 }}>Search results for: &quot;{searchQuery}&quot;</Typography>
      )}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <Drawer
          anchor="left"
          open={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
          sx={{
            '& .MuiDrawer-paper': {
              width: '100%',
              p: 2,
            },
            display: { xs: 'flex', sm: 'none' },
            position: 'relative',
          }}
        >
          <IconButton sx={{ position: 'absolute', top: 8, right: 8 }} onClick={() => setMobileFiltersOpen(false)}>
            <CloseIcon />
          </IconButton>
          <FilterForm
            products={products}
            categories={categories}
            categoryId={categoryId}
            setCategoryId={handleCategorySelect}
            setFilterOption={setFilterOption}
            handleFilterApply={async (filters) => {
              await handleFilterApply(filters);
              setMobileFiltersOpen(false);
            }}
          />
        </Drawer>

        {!isMobile && (
          <FilterForm
            products={products}
            categories={categories}
            categoryId={categoryId}
            setCategoryId={handleCategorySelect}
            setFilterOption={setFilterOption}
            handleFilterApply={handleFilterApply}
          />
        )}

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
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              fullWidth
              sx={{ flex: 1, maxWidth: 160, display: { xs: 'inline-flex', sm: 'none' } }}
              onClick={() => setMobileFiltersOpen(true)}
            >
              Filters
            </Button>
          </Stack>
          <Stack justifyContent={'space-between'} gap={2} sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1.5 }}>
              <ProductsList products={products} />
            </Box>
            {products.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.currentPage}
                  onChange={(_, page) => void handlePaginationChange(page)}
                  color="primary"
                  shape="rounded"
                  siblingCount={isMobile ? 0 : 1}
                  boundaryCount={isMobile ? 1 : 2}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontSize: isMobile ? '0.875rem' : '1rem',
                      minWidth: isMobile ? 32 : 40,
                      height: isMobile ? 32 : 40,
                    },
                  }}
                />
              </Box>
            )}
          </Stack>
        </Box>
      </Box>
    </>
  );
}

export default function CatalogPage() {
  return (
    <Suspense>
      <Catalog />
    </Suspense>
  );
}
