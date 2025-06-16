'use client';
import { useState, useEffect, type Dispatch, type SetStateAction, type FormEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  Button,
  IconButton,
  List,
  Paper,
  Stack,
  TextField,
  Typography,
  CardMedia,
} from '@mui/material';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import Link from 'next/link';
import { type Cart } from '@commercetools/platform-sdk';
import { getActiveCart } from '@/lib/commercetools/cart';
import CartItem from '@/components/cart/cart-item';
import { clearCart, applyDiscountCode } from '@/lib/commercetools/cart';
import { useCartStore } from '@/lib/store/cart-store';
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
            <CartClearButton setCart={setCart} />
          </Stack>
          <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {cart.lineItems.map((item) => (
              <CartItem key={item.id} item={item} setCart={setCart} />
            ))}
          </List>
        </Stack>
        <CartApplyPromoButton cart={cart} setCart={setCart} />
      </Stack>
    );
  } else {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" gap={2} padding={2}>
        <CardMedia
          component="img"
          src="/empty-cart.png"
          alt="Empty shopping cart"
          sx={{ width: 200, height: 'auto' }}
        />
        <Typography variant="h2" color="textPrimary" align="center" gutterBottom>
          Your cart is empty
        </Typography>
        <Typography variant="body1" color="textSecondary" align="center" gutterBottom>
          To find the product you are interested in, use the search or go to the catalog page
        </Typography>
        <Button variant="contained">
          <Link href={'/catalog'}>catalog</Link>
        </Button>
      </Box>
    );
  }
}

type CartClearButtonProps = {
  setCart: Dispatch<SetStateAction<Cart | null>>;
};

function CartClearButton({ setCart }: CartClearButtonProps) {
  const { initializeCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
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

  const handleClearCart = async () => {
    setLoading(true);
    try {
      const cart = await clearCart();
      if (!cart) {
        throw new Error('No cart');
      }
      setCart(cart);
      await initializeCart();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  return (
    <>
      <IconButton disabled={loading} color="primary" aria-label="Clear shopping cart" onClick={handleOpenConfirm}>
        <RemoveShoppingCartIcon />
      </IconButton>

      <Dialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Clear Shopping Cart</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to remove all items from your shopping cart?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="primary">
            Cancel
          </Button>
          <Button onClick={() => void handleClearCart()} color="error" autoFocus disabled={loading}>
            {loading ? 'Clearing...' : 'Clear Cart'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

type CartApplyPromoButtonProps = {
  cart: Cart;
  setCart: Dispatch<SetStateAction<Cart | null>>;
};

function CartApplyPromoButton({ cart, setCart }: CartApplyPromoButtonProps) {
  const [discountCode, setDiscountCode] = useState('');
  const { initializeCart } = useCartStore();
  const [loading, setLoading] = useState(false);
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

  const handleApplyPromo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const cart = await applyDiscountCode(discountCode);
      if (!cart) {
        throw new Error('No cart');
      }
      setCart(cart);
      await initializeCart();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        flexGrow: { xs: 1 },
        maxHeight: 'min-content',
      }}
    >
      <Stack component="form" onSubmit={(event) => void handleApplyPromo(event)}>
        <TextField
          value={discountCode}
          onChange={(event) => setDiscountCode(event.target.value)}
          variant="outlined"
          type="text"
          size="small"
          placeholder="Enter your promo code"
          sx={{ textAlign: 'center' }}
        />
        <Button type="submit" disabled={loading} variant="contained">
          apply promo code
        </Button>
      </Stack>

      <Typography sx={{ p: 1, textAlign: 'center' }}>Total items in cart: {cart.lineItems.length}</Typography>

      <Typography sx={{ p: 1, textAlign: 'center' }}>
        Total price:{' '}
        {cart.discountCodes.length > 0 ? (
          <>
            <Box component="span" sx={{ color: 'red', fontWeight: 'bold', mr: 1 }}>
              €
              {(
                (cart.totalPrice.centAmount - (cart.discountOnTotalPrice?.discountedAmount.centAmount || 0)) /
                100
              ).toFixed(2)}
            </Box>
            <Box component="span" sx={{ textDecoration: 'line-through' }}>
              €{(cart.totalPrice.centAmount / 100).toFixed(2)}
            </Box>
          </>
        ) : (
          <Box component="span">{(cart.totalPrice.centAmount / 100).toFixed(2)}</Box>
        )}
      </Typography>
    </Paper>
  );
}
