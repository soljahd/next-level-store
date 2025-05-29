import React from 'react';
import Link from 'next/link';
import { Card, CardMedia, Typography, Button, Stack } from '@mui/material';

type ProductCardProps = {
  slug: string;
  image: string;
  title: string;
  author: string;
  year: number;
  price: string;
  oldPrice: string;
};

const ProductCard: React.FC<ProductCardProps> = ({ slug, image, title, author, year, price, oldPrice }) => {
  return (
    <Card
      component={Link}
      href={`/catalog/${slug}`}
      variant="outlined"
      sx={{
        width: '100%',
        maxWidth: 260,
        display: 'flex',
        flexDirection: 'column',
        padding: 2,
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        },
        '&:active': {
          transform: 'scale(1)',
        },
      }}
    >
      <Stack padding={1}>
        <CardMedia
          component="img"
          height="180"
          image={image}
          alt={title}
          sx={{ objectFit: 'contain', width: '100%' }}
        />
      </Stack>
      <Stack paddingY={1}>
        <Stack direction="row" gap={1}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'red' }}>
            {price}
          </Typography>
          <Typography variant="h6" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
            {oldPrice}
          </Typography>
        </Stack>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2" sx={{ fontSize: '1rem', color: 'text.secondary' }}>
          {author}, {year}
        </Typography>
      </Stack>
      <Button variant="contained" sx={{ width: '60%' }}>
        Add to Cart
      </Button>
    </Card>
  );
};

export default ProductCard;
