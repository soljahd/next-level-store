'use client';
import { useState, useEffect } from 'react';
import { Box, Button, IconButton, List, Paper, Stack, TextField, Tooltip, Typography } from '@mui/material';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import Link from 'next/link';
import { type Cart } from '@commercetools/platform-sdk';
import { getActiveCart } from '@/lib/commercetools/cart';
import CartItem from '@/components/cart/cart-item';
import { enqueueSnackbar } from 'notistack';

export default function ShoppingCart() {
  const [cart, setCart] = useState<Cart | null>(null);
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
    const fetchCart = async () => {
      try {
        const cart = await getActiveCart();
        if (!cart) {
          throw new Error('No cart');
        }
        setCart(cart);
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCart().catch(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return null;
  }

  if (cart?.lineItems && cart?.lineItems.length > 0) {
    return (
      <Stack flexDirection={{ xs: 'column', sm: 'row' }} sx={{ gap: { xs: 1, sm: 2 } }}>
        <Stack flexGrow={{ xs: 1, sm: 5 }}>
          <Stack flexDirection="row" justifyContent="space-between" alignItems="end">
            <Typography component="h1" variant="h4">
              Shopping Cart
            </Typography>
            {/* кнопка очистки корзины */}
            <Tooltip title="Clear cart" arrow>
              <IconButton color="primary" aria-label="Remove all items from cart">
                <RemoveShoppingCartIcon></RemoveShoppingCartIcon>
              </IconButton>
            </Tooltip>
          </Stack>
          <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {cart.lineItems.map((item) => (
              <CartItem key={item.id} item={item} setCart={setCart} />
            ))}
          </List>
        </Stack>
        <Paper
          variant="outlined"
          sx={{
            flexGrow: { xs: 1 },
            maxHeight: 'min-content',
          }}
        >
          <Typography sx={{ p: 1, textAlign: 'center', border: '1px solid grey' }}>
            Total items in cart: {cart.lineItems.length}
          </Typography>
          <Stack component="form">
            <TextField
              variant="outlined"
              type="text"
              size="small"
              placeholder="Enter your promo code"
              sx={{
                textAlign: 'center',
                border: '1px solid grey',
              }}
            ></TextField>
            <Button variant="contained">apply promo code</Button>
          </Stack>
          <Typography sx={{ p: 1, textAlign: 'center', border: '1px solid grey' }}>
            Total price {cart.totalPrice.centAmount / 100}
          </Typography>
        </Paper>
      </Stack>
    );
  } else {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
        <Typography color="primary">
          Your cart is empty. To find the product you are interested in, use the search or go to the catalog page
        </Typography>
        <Button>
          <Link href={'/catalog'}>catalog</Link>
        </Button>
      </Box>
    );
  }
}
