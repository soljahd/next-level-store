import React from 'react';
import { Card, CardMedia, Typography, Box, Button } from '@mui/material';

type ProductCardProps = {
  image: string;
  title: string;
  author: string;
  year: number;
  price: string;
  oldPrice: string;
};

const ProductCard: React.FC<ProductCardProps> = ({ image, title, author, year, price, oldPrice }) => {
  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: 290,
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        padding: 2,
        border: '1px solid #ccc',
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{ p: 3 }}>
        <CardMedia
          component="img"
          height="180"
          image={image}
          alt={title}
          sx={{ objectFit: 'contain', width: '100%' }}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: '#ff9100',
            lineHeight: '1.2',
          }}
        >
          {price}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            textDecoration: 'line-through',
            fontWeight: 500,
            fontSize: '1rem',
            lineHeight: '1',
            ml: 1,
            color: 'text.secondary',
          }}
        >
          {oldPrice}
        </Typography>
      </Box>
      <Typography
        variant="h6"
        sx={{
          fontSize: '1rem',
          color: 'gray',
          lineHeight: 1.2,
          marginBottom: 0,
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontSize: '1rem',
          color: 'gray',
          lineHeight: 1.2,
          marginTop: 0,
        }}
      >
        {author}, {year}
      </Typography>
      <Button
        variant="contained"
        fullWidth={false}
        sx={{
          mt: 1,
          width: '60%',
          backgroundColor: 'primary.main',
          color: '#ffffff',
        }}
      >
        Add to Cart
      </Button>
    </Card>
  );
};

export default ProductCard;
