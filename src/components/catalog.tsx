'use client';
import React, { useState } from 'react';
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
import { mockProducts } from './mock-products';

export default function CatalogPage() {
  const categories = [...new Set(mockProducts.map((p) => p.category))];

  const [popularOption, setPopularOption] = useState<string>('popular');

  const [breadcrumb, setBreadcrumb] = useState<string[]>(['Books']);

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
            {mockProducts.map((product, index) => (
              <FormControlLabel key={index} control={<Checkbox />} label={product.author} />
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

        <Box
          sx={{
            flex: '1 1 75%',
            minWidth: 300,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
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
            {mockProducts.map((product, index) => (
              <ProductCard
                key={index}
                image={product.image}
                title={product.title}
                author={product.author}
                year={product.year}
                price={product.price}
                oldPrice={product.oldPrice}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
