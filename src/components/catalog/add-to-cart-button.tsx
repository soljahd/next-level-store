'use client';

import { useState, useEffect } from 'react';
import { getActiveCart, addToCart } from '@/lib/commercetools/cart';
import Button from '@mui/material/Button';
import { enqueueSnackbar } from 'notistack';

export default function AddToCartButton({ productId }: { productId: string }) {
  const [isInCart, setIsInCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handleCloseError = () => setErrorMessage(null);

  useEffect(() => {
    if (errorMessage) {
      enqueueSnackbar(errorMessage, {
        variant: 'error',
        onClose: handleCloseError,
      });
    }
  }, [errorMessage]);

  useEffect(() => {
    async function checkCart() {
      try {
        const cart = await getActiveCart();
        const inCart = cart?.lineItems.some((item) => item.productId === productId) || false;
        setIsInCart(inCart);
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        }
      } finally {
        setLoading(false);
      }
    }

    checkCart().catch(() => {
      setLoading(false);
    });
  }, [productId]);

  const handleClick = async () => {
    await addToCart(productId);
  };

  if (loading) return <Button disabled>Add to Cart</Button>;

  return (
    <Button disabled={isInCart} variant="contained" onClick={() => handleClick}>
      Add to Cart
    </Button>
  );
}
