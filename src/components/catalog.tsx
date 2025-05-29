'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';
import { searchProducts, getAllCategories } from '@/lib/commercetools/catalog';
import type { SearchProductsParameters } from '@/lib/commercetools/catalog';
import type { SelectChangeEvent } from '@mui/material';
import type { ProductProjectionPagedSearchResponse, ProductProjection } from '@commercetools/platform-sdk';
import ProductsList from './product-list';
import YearPriceFilters from './years-price-filter';
import SortSelect from './sort-select';
import AuthorFilter from './author-filters';

type Category = { id: string; name: string };

type SearchParameters = {
  limit?: number;
  categoryId?: string;
  authors?: string[];
  publicationYearFrom?: number;
  publicationYearTo?: number;
  priceFrom?: number;
  priceTo?: number;
  name?: string;
};

export default function CatalogPage() {
  const [products, setProducts] = useState<ProductProjection[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularOption, setPopularOption] = useState<string>('all');
  const [breadcrumb, setBreadcrumb] = useState<string[]>(['Books']);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);

  const [authorsToShowCount, setAuthorsToShowCount] = useState(6);
  const authorsContainerReference = useRef<HTMLDivElement | null>(null);

  const [publicationYearFrom, setPublicationYearFrom] = useState<string>('');
  const [publicationYearTo, setPublicationYearTo] = useState<string>('');

  const [priceFrom, setPriceFrom] = useState<string>('');
  const [priceTo, setPriceTo] = useState<string>('');

  const [searchText, setSearchText] = useState('');

  const [appliedFilters, setAppliedFilters] = useState<{
    publicationYearFrom?: number;
    publicationYearTo?: number;
    priceFrom?: number;
    priceTo?: number;
  }>({});

  const [randomBooks, setRandomBooks] = useState<ProductProjection[]>([]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      void applySearchFilter();
    }
  };

  const applySearchFilter = async () => {
    setLoading(true);
    try {
      const searchParameters: SearchProductsParameters = {
        limit: 50,
        searchQuery: searchText.trim(),
      };

      const data = await searchProducts(searchParameters);

      if (data && data.results) {
        const filteredProducts = data.results.filter((product) => {
          return product.name.en.toLowerCase().includes(searchText.toLowerCase());
        });

        setProducts(filteredProducts);
      } else {
        setProducts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const categoriesResponse = await getAllCategories();
        if (categoriesResponse && categoriesResponse.results) {
          const cats = categoriesResponse.results.map((cat) => ({
            id: cat.id,
            name: cat.name?.en || cat.id,
          }));
          setCategories(cats);
        }

        const searchParameters: SearchParameters = { limit: 50 };
        const data: ProductProjectionPagedSearchResponse | undefined = await searchProducts(searchParameters);
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

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const searchParameters: SearchParameters = {
          limit: 50,
          categoryId: selectedCategoryId || undefined,
          authors: selectedAuthors.length > 0 ? selectedAuthors : undefined,
        };

        const data = await searchProducts(searchParameters);
        if (data) {
          let filtered = data.results;

          if (appliedFilters.publicationYearFrom !== undefined) {
            filtered = filtered.filter((product) => {
              const pagesAttribute = product.masterVariant?.attributes?.find((a) => a.name === 'pages');
              let pagesValue: number | undefined;

              if (pagesAttribute) {
                if (typeof pagesAttribute.value === 'number') {
                  pagesValue = pagesAttribute.value;
                } else if (typeof pagesAttribute.value === 'string') {
                  const parsed = Number.parseInt(pagesAttribute.value, 10);
                  pagesValue = Number.isNaN(parsed) ? undefined : parsed;
                }
              }

              return pagesValue !== undefined && pagesValue >= appliedFilters.publicationYearFrom!;
            });
          }

          if (appliedFilters.publicationYearTo !== undefined) {
            const yearTo = appliedFilters.publicationYearTo;
            filtered = filtered.filter((product) => {
              const pagesAttribute = product.masterVariant?.attributes?.find((a) => a.name === 'pages');

              let pagesValue: number | undefined;

              if (pagesAttribute) {
                if (typeof pagesAttribute.value === 'number') {
                  pagesValue = pagesAttribute.value;
                } else if (typeof pagesAttribute.value === 'string') {
                  const parsed = Number.parseInt(pagesAttribute.value, 10);
                  if (!Number.isNaN(parsed)) {
                    pagesValue = parsed;
                  }
                }
              }

              return pagesValue !== undefined && pagesValue <= yearTo;
            });
          }

          if (appliedFilters.priceFrom !== undefined) {
            filtered = filtered.filter((product) => {
              const priceCents = product.masterVariant?.prices?.[0]?.value?.centAmount;
              return typeof priceCents === 'number' && priceCents >= appliedFilters.priceFrom! * 100;
            });
          }

          if (appliedFilters.priceTo !== undefined) {
            filtered = filtered.filter((product) => {
              const priceCents = product.masterVariant?.prices?.[0]?.value?.centAmount;
              return typeof priceCents === 'number' && priceCents <= appliedFilters.priceTo! * 100;
            });
          }

          setProducts(filtered);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts().catch(() => setLoading(false));
  }, [selectedAuthors, selectedCategoryId, appliedFilters]);

  useEffect(() => {
    const updateRandomBooks = () => {
      if (popularOption === 'bestSellers' && randomBooks.length === 0) {
        const newRandomBooks = products.sort(() => 0.5 - Math.random()).slice(0, 3);

        setRandomBooks(newRandomBooks);
      }
    };

    updateRandomBooks();

    const intervalId = setInterval(
      () => {
        if (popularOption === 'bestSellers') {
          const newRandomBooks = products.sort(() => 0.5 - Math.random()).slice(0, 3);

          setRandomBooks(newRandomBooks);
        }
      },
      60 * 60 * 1000,
    );

    return () => clearInterval(intervalId);
  }, [popularOption, products, randomBooks.length]);

  useEffect(() => {
    const sortedProducts = [...products];

    if (popularOption === 'highToLow') {
      sortedProducts.sort((a, b) => {
        const priceA = a.masterVariant?.prices?.[0]?.value?.centAmount || 0;
        const priceB = b.masterVariant?.prices?.[0]?.value?.centAmount || 0;
        return priceB - priceA;
      });
    }

    if (popularOption === 'lowToHigh') {
      sortedProducts.sort((a, b) => {
        const priceA = a.masterVariant?.prices?.[0]?.value?.centAmount || 0;
        const priceB = b.masterVariant?.prices?.[0]?.value?.centAmount || 0;
        return priceA - priceB;
      });
    }

    if (popularOption === 'alphabetical') {
      sortedProducts.sort((a, b) => {
        const nameA = a.name?.en.toLowerCase() || '';
        const nameB = b.name?.en.toLowerCase() || '';
        return nameA.localeCompare(nameB);
      });
    }

    if (popularOption === 'alphabeticalReverse') {
      sortedProducts.sort((a, b) => {
        const nameA = a.name?.en.toLowerCase() || '';
        const nameB = b.name?.en.toLowerCase() || '';
        return nameB.localeCompare(nameA);
      });
    }

    if (JSON.stringify(sortedProducts) !== JSON.stringify(products)) {
      setProducts(sortedProducts);
    }
  }, [popularOption, products]);

  const handlePopularChange = (event: SelectChangeEvent) => {
    setPopularOption(event.target.value);
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategoryId(category.id);

    if (category.name === 'Fiction') {
      setBreadcrumb(['Books', 'Fiction']);
    } else {
      setBreadcrumb(['Books', 'Fiction', category.name]);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    const newBreadcrumb = breadcrumb.slice(0, index + 1);

    setBreadcrumb(newBreadcrumb);

    if (newBreadcrumb.length === 1 && newBreadcrumb[0] === 'Books') {
      setSelectedCategoryId(null);
    } else if (newBreadcrumb.length === 2 && newBreadcrumb[1] === 'Fiction') {
      const fictionCategory = categories.find((cat) => cat.name === 'Fiction');
      setSelectedCategoryId(fictionCategory ? fictionCategory.id : null);
    } else if (newBreadcrumb.length === 3) {
      const subCategoryName = newBreadcrumb[2];
      const subCategory = categories.find((cat) => cat.name === subCategoryName);
      setSelectedCategoryId(subCategory ? subCategory.id : null);
    } else {
      setSelectedCategoryId(null);
    }
  };

  const uniqueAuthors = [
    ...new Set(
      products
        .map((product) => {
          const authorAttribute = product.masterVariant?.attributes?.find((attribute) => attribute.name === 'author');
          return typeof authorAttribute?.value === 'string' ? authorAttribute.value : '';
        })
        .filter((author) => author !== ''),
    ),
  ];

  const applyFilters = () => {
    setAppliedFilters({
      publicationYearFrom: publicationYearFrom ? Number(publicationYearFrom) : undefined,
      publicationYearTo: publicationYearTo ? Number(publicationYearTo) : undefined,
      priceFrom: priceFrom ? Number(priceFrom) : undefined,
      priceTo: priceTo ? Number(priceTo) : undefined,
    });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      applyFilters();
    }
  };

  const handleResetFilters = () => {
    setSelectedAuthors([]);
    setSelectedCategoryId(null);
    setPublicationYearFrom('');
    setPublicationYearTo('');
    setPriceFrom('');
    setPriceTo('');
    setAppliedFilters({});
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: 'primary.main',
          }}
        >
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, width: '100%', maxWidth: '100%', marginLeft: 0, marginRight: 0 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
        <Box
          sx={{
            flex: '1 1 25%',
            minWidth: 250,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Typography variant="h3">Books</Typography>

          <Typography variant="h6" sx={{ mt: 3, alignSelf: 'flex-start', marginLeft: 5 }}>
            Book Categories
          </Typography>
          <Box sx={{ maxWidth: 311 }}>
            {categories.map((category) => (
              <Typography
                key={category.id}
                sx={{
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                    color: 'primary.dark',
                  },
                  marginBottom: '8px',
                }}
                onClick={() => handleCategoryClick(category)}
              >
                {category.name}
              </Typography>
            ))}
          </Box>

          <AuthorFilter
            authors={uniqueAuthors}
            selectedAuthors={selectedAuthors}
            setSelectedAuthors={setSelectedAuthors}
            authorsToShowCount={authorsToShowCount}
            setAuthorsToShowCount={setAuthorsToShowCount}
            authorsContainerReference={authorsContainerReference}
          />

          <YearPriceFilters
            publicationYearFrom={publicationYearFrom}
            publicationYearTo={publicationYearTo}
            setPublicationYearFrom={setPublicationYearFrom}
            setPublicationYearTo={setPublicationYearTo}
            priceFrom={priceFrom}
            priceTo={priceTo}
            setPriceFrom={setPriceFrom}
            setPriceTo={setPriceTo}
            handleKeyPress={handleKeyPress}
          />

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3, width: 215, maxWidth: '100%' }}
            onClick={applyFilters}
          >
            Apply
          </Button>
          <Button variant="text" sx={{ mt: 1, width: 215, maxWidth: '100%' }} onClick={handleResetFilters}>
            Reset
          </Button>
        </Box>

        <Box sx={{ flex: '1 1 75%', minWidth: 300, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            {breadcrumb.map((part, index) => (
              <React.Fragment key={index}>
                <Typography
                  sx={{
                    cursor: 'pointer',
                    color: 'primary.main',
                    fontSize: 14,
                    '&:hover': {
                      color: 'primary.dark',
                    },
                  }}
                  onClick={() => handleBreadcrumbClick(index)}
                >
                  {part}
                </Typography>
                {index < breadcrumb.length - 1 && <Typography sx={{ fontSize: 14, mx: 0.5 }}>/</Typography>}
              </React.Fragment>
            ))}
          </Box>

          <SortSelect popularOption={popularOption} handlePopularChange={handlePopularChange} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box
              display="flex"
              sx={{
                gap: { xs: 1, md: 2 },
                minWidth: { xs: '100%', sm: 'auto' },
                order: { xs: 1, sm: 0 },
              }}
            >
              <TextField
                variant="outlined"
                size="small"
                value={searchText}
                onChange={handleSearchChange}
                onKeyUp={handleSearchKeyPress}
                placeholder="Enter the book title"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ flexGrow: 1 }}
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: { xs: 'center', sm: 'center', md: 'flex-start' },
                gap: 2,
              }}
            >
              <ProductsList products={popularOption === 'bestSellers' ? randomBooks : products} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
