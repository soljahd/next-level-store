'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import ProductCard from './product-card';
import { searchProducts, getAllCategories } from '@/lib/commercetools/catalog';
import type { ProductProjectionPagedSearchResponse, ProductProjection } from '@commercetools/platform-sdk';

export default function CatalogPage() {
  const [products, setProducts] = useState<ProductProjection[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [popularOption, setPopularOption] = useState<string>('popular');
  const [breadcrumb, setBreadcrumb] = useState<string[]>(['Books']);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: ProductProjectionPagedSearchResponse | undefined = await searchProducts({ limit: 50 });
        if (data) {
          setProducts(data.results);
        }

        const categoriesResponse = await getAllCategories();
        if (categoriesResponse && categoriesResponse.results) {
          const cats = categoriesResponse.results.map((cat) => cat.name?.en || cat.id);
          setCategories(cats);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData().catch(() => {
      setLoading(false);
    });
  }, []);

  const handlePopularChange = (event: SelectChangeEvent) => {
    setPopularOption(event.target.value);
  };

  const handleCategoryClick = (category: string) => {
    if (category === 'Fiction') {
      setBreadcrumb(['Books', 'Fiction']);
    } else {
      setBreadcrumb(['Books', 'Fiction', category]);
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
    <Box
      sx={{
        p: 2,
        width: '100%',
        maxWidth: '100%',
        marginLeft: 0,
        marginRight: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
        }}
      >
        {/* Левая колонка фильтров */}
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
            {categories.map((category, index) => (
              <Typography
                key={index}
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
                {category}
              </Typography>
            ))}
          </Box>

          <Typography variant="h6" sx={{ mt: 3, alignSelf: 'flex-start', marginLeft: 5 }}>
            Authors
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxWidth: 230, width: '100%' }}>
            {uniqueAuthors.map((author, index) => (
              <FormControlLabel key={index} control={<Checkbox />} label={author} />
            ))}
          </Box>
          <TextField fullWidth sx={{ mt: 2, maxWidth: 230 }} placeholder="Search by authors" />

          <Typography variant="h6" sx={{ mt: 3, alignSelf: 'flex-start', marginLeft: 5 }}>
            Publication Year
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', maxWidth: 230 }}>
            <TextField size="small" placeholder="From" type="number" />
            <Typography>-</Typography>
            <TextField size="small" placeholder="To" type="number" />
          </Box>

          <Typography variant="h6" sx={{ mt: 3, alignSelf: 'flex-start', marginLeft: 5 }}>
            Price
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', maxWidth: 230 }}>
            <TextField size="small" placeholder="From" type="number" />
            <Typography>-</Typography>
            <TextField size="small" placeholder="To" type="number" />
          </Box>

          <Button
            variant="contained"
            color="primary"
            sx={{
              mt: 3,
              width: 215,
              maxWidth: '100%',
            }}
          >
            Apply
          </Button>
          <Button
            variant="text"
            sx={{
              mt: 1,
              width: 215,
              maxWidth: '100%',
            }}
          >
            Reset
          </Button>
        </Box>

        {/* Правая колонка с карточками */}
        <Box
          sx={{
            flex: '1 1 75%',
            minWidth: 300,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {/* Хлебные крошки */}
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
                  onClick={() => setBreadcrumb(breadcrumb.slice(0, index + 1))}
                >
                  {part}
                </Typography>
                {index < breadcrumb.length - 1 && <Typography sx={{ fontSize: 14, mx: 0.5 }}>/</Typography>}
              </React.Fragment>
            ))}
          </Box>

          {/* Селектор сортировки */}
          <FormControl sx={{ width: 200 }}>
            <InputLabel id="popular-label">Books</InputLabel>
            <Select
              labelId="popular-label"
              value={popularOption}
              onChange={handlePopularChange}
              label="Books"
              sx={{
                border: 'none',
                boxShadow: 'none',
              }}
              MenuProps={{
                disableScrollLock: true,
              }}
            >
              <MenuItem value="popular">Popular</MenuItem>
              <MenuItem value="highToLow">Price: High to Low</MenuItem>
              <MenuItem value="lowToHigh">Price: Low to High</MenuItem>
              <MenuItem value="bigDiscounts">Big Discounts</MenuItem>
              <MenuItem value="bestSellers">Best Sellers</MenuItem>
            </Select>
          </FormControl>

          {/* Карточки продуктов */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: {
                xs: 'center',
                sm: 'center',
                md: 'flex-start',
              },
            }}
          >
            {products.map((product, index) => {
              const title = product.name?.en || '';
              const attribute = product.masterVariant?.attributes?.find((attribute) => attribute.name === 'author');
              const author = typeof attribute?.value === 'string' ? attribute.value : '';
              const image = product.masterVariant?.images?.[0]?.url || '';
              const pagesAttribute = product.masterVariant?.attributes?.find((attribute) => attribute.name === 'pages');
              const pages = typeof pagesAttribute?.value === 'number' ? pagesAttribute.value : 0;
              const priceCents = product.masterVariant?.prices?.[0]?.value?.centAmount || 0;
              const price = (priceCents / 100).toFixed(2);
              const oldPriceCents = product.masterVariant?.prices?.[0]?.value?.centAmount || 0;
              const oldPrice = (oldPriceCents / 100).toFixed(2);

              return (
                <ProductCard
                  key={index}
                  image={image}
                  title={title}
                  author={author}
                  year={pages}
                  price={price}
                  oldPrice={oldPrice}
                />
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
