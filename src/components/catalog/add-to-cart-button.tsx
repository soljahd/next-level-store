'use client';

import { useState, useEffect } from 'react';
import { getActiveCart, addToCart, removeFromCart } from '@/lib/commercetools/cart';
import Button from '@mui/material/Button';
import { enqueueSnackbar } from 'notistack';
import { Stack } from '@mui/material';
import { useCartStore } from '@/lib/store/cart-store';

export default function AddToCartButton({ productId }: { productId: string }) {
  const [buttonAddText, setButtonAddText] = useState<string>('Add to Cart');
  const [buttonRemoveText, setButtonRemoveText] = useState<string>('Remove from Cart');
  const [isInCart, setIsInCart] = useState(false);
  const [loading, setLoading] = useState(true);
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

  const handleAddClick = async () => {
    setLoading(true);
    setButtonAddText('Adding...');
    try {
      const cart = await addToCart(productId);
      if (!cart) {
        throw new Error('No active cart');
      }
      const totalQuantity = cart?.lineItems.reduce((sum, item) => sum + item.quantity, 0) || 0;
      updateCartCount(totalQuantity);
      setIsInCart(true);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    } finally {
      setLoading(false);
      setButtonAddText('Add to Cart');
    }
  };

  const handleRemoveClick = async () => {
    setLoading(true);
    setButtonRemoveText('Removing...');
    try {
      const cart = await removeFromCart(productId);
      if (!cart) {
        throw new Error('No active cart');
      }
      const totalQuantity = cart?.lineItems.reduce((sum, item) => sum + item.quantity, 0) || 0;
      updateCartCount(totalQuantity);
      setIsInCart(false);
      enqueueSnackbar('Product successfully removed', { variant: 'success' });
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    } finally {
      setLoading(false);
      setButtonRemoveText('Remove from Cart');
    }
  };

  if (loading)
    return (
      <Stack gap={2}>
        <Button disabled size="large" variant="contained">
          {buttonAddText}
        </Button>
        <Button disabled size="large" variant="contained">
          {buttonRemoveText}
        </Button>
      </Stack>
    );

  return (
    <Stack gap={2}>
      <Button disabled={isInCart || loading} size="large" variant="contained" onClick={() => void handleAddClick()}>
        {buttonAddText}
      </Button>
      <Button
        disabled={!isInCart || loading}
        size="large"
        variant="contained"
        color="error"
        onClick={() => void handleRemoveClick()}
      >
        {buttonRemoveText}
      </Button>
    </Stack>
  );
}
