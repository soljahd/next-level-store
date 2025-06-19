import { type MouseEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardMedia, Typography, Button, Stack } from '@mui/material';
import { addToCart } from '@/lib/commercetools/cart';
import { enqueueSnackbar } from 'notistack';
import { useCartStore } from '@/lib/store/cart-store';

type ProductCardProps = {
  inCart: boolean;
  productId: string;
  slug: string;
  image: string;
  title: string;
  author: string;
  year: number;
  price: string;
  oldPrice: string;
  onAddToCart: () => Promise<void>;
};

export default function ProductCard({
  inCart,
  productId,
  slug,
  image,
  title,
  author,
  year,
  price,
  oldPrice,
  onAddToCart,
}: ProductCardProps) {
  const [adding, setAdding] = useState(false);
  const [buttonText, setButtonText] = useState<string>('Add to Cart');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handleCloseError = () => setErrorMessage(null);
  const { updateCartCount } = useCartStore();
  useEffect(() => {
    if (errorMessage) {
      enqueueSnackbar(errorMessage, {
        variant: 'error',
        onClose: handleCloseError,
      });
    }
  }, [errorMessage]);

  const handleAddToCart = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setAdding(true);
    setButtonText('Adding...');
    try {
      const cart = await addToCart(productId);
      await onAddToCart();
      if (!cart) {
        throw new Error('No active cart');
      }
      const totalQuantity = cart?.lineItems.reduce((sum, item) => sum + item.quantity, 0) || 0;
      updateCartCount(totalQuantity);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    } finally {
      setButtonText('Add to Cart');
      setAdding(false);
    }
  };

  const showOnlyOldPrice = price === '0.00';

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
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        },
        '&:active': {
          // transform: 'scale(1)',
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
          {!showOnlyOldPrice && (
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'red' }}>
              €{price}
            </Typography>
          )}
          <Typography
            variant="h6"
            sx={{
              textDecoration: showOnlyOldPrice ? 'none' : 'line-through',
              color: showOnlyOldPrice ? 'text.primary' : 'text.secondary',
              fontWeight: showOnlyOldPrice ? 'bold' : 'normal',
            }}
          >
            €{oldPrice}
          </Typography>
        </Stack>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2" sx={{ fontSize: '1rem', color: 'text.secondary' }}>
          {author}, {year}
        </Typography>
      </Stack>
      <Button
        disabled={inCart || adding}
        onClick={(event) => void handleAddToCart(event)}
        variant="contained"
        sx={{ width: '60%' }}
      >
        {buttonText}
      </Button>
    </Card>
  );
}
