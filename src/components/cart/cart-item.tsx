'use client';
import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';
import { ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, TextField, Typography, Box } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline, Delete } from '@mui/icons-material';
import Image from 'next/image';
import { type Cart, type LineItem } from '@commercetools/platform-sdk';
import { updateLineItemQuantity, removeFromCart } from '@/lib/commercetools/cart';
import { useCartStore } from '@/lib/store/cart-store';
import { enqueueSnackbar } from 'notistack';

type CartItemProps = {
  item: LineItem;
  setCart: Dispatch<SetStateAction<Cart | null>>;
};

export default function CartItem({ item, setCart }: CartItemProps) {
  const imageUrl = item.variant?.images?.[0]?.url;

  return (
    <ListItem alignItems="center" sx={{ gap: 2, border: '1px solid grey', borderRadius: 2 }}>
      {imageUrl && (
        <ListItemAvatar>
          <Avatar variant="rounded" sx={{ width: 80, height: 100 }}>
            <Image
              src={imageUrl}
              alt={item.name['en'] || 'Product image'}
              width={80}
              height={100}
              style={{ objectFit: 'cover' }}
            />
          </Avatar>
        </ListItemAvatar>
      )}
      <ListItemText
        primary={
          <Typography variant="h6" component="span" display="block">
            {item.name['en']}
          </Typography>
        }
        secondary={
          <>
            {item.variant?.attributes?.map((attribute) => (
              <Typography key={attribute.name} component="span" display="block">
                {String(attribute.value)}
              </Typography>
            ))}
          </>
        }
      />
      <CartItemEdit item={item} setCart={setCart} />
    </ListItem>
  );
}

function CartItemEdit({ item, setCart }: CartItemProps) {
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

  const handleCartOperation = async (operation: 'add' | 'subtract' | 'remove') => {
    setLoading(true);
    try {
      let cart;
      switch (operation) {
        case 'add': {
          cart = await updateLineItemQuantity(item.id, item.quantity + 1);
          break;
        }
        case 'subtract': {
          cart = await updateLineItemQuantity(item.id, item.quantity - 1);
          break;
        }
        case 'remove': {
          cart = await removeFromCart(item.productId);
          break;
        }
        default: {
          throw new Error('Invalid operation');
        }
      }

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

  const { value, discounted } = item.price || {};
  const basePrice = value?.centAmount ? value.centAmount / 100 : 0;
  const discountedPrice = discounted?.value.centAmount ? discounted.value.centAmount / 100 : null;

  const price = discountedPrice ?? basePrice;
  const totalPrice = price * item.quantity;

  return (
    <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" gap={{ xs: 1, sm: 2 }}>
      <Box display="flex" alignItems="center" gap={1}>
        <IconButton disabled={loading} color="primary" onClick={() => void handleCartOperation('subtract')}>
          <RemoveCircleOutline sx={{ width: 28, height: 28 }} />
        </IconButton>
        <TextField
          value={item.quantity}
          size="small"
          type="number"
          sx={{
            '& .MuiInputBase-input': {
              textAlign: 'center',
            },
            width: 50,
            '& input[type=number]': {
              MozAppearance: 'textfield',
              WebkitAppearance: 'none',
              appearance: 'none',
              margin: 0,
            },
            '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': {
              WebkitAppearance: 'none',
              margin: 0,
            },
          }}
        />
        <IconButton disabled={loading} color="primary" onClick={() => void handleCartOperation('add')}>
          <AddCircleOutline sx={{ width: 28, height: 28 }} />
        </IconButton>
      </Box>
      <Typography variant="h6" sx={{ minWidth: 80, textAlign: 'center' }}>
        {item.price?.discounted ? (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box
              component="span"
              sx={{
                color: 'red',
                fontWeight: 'bold',
              }}
            >
              €{((item.price.discounted.value.centAmount / 100) * item.quantity).toFixed(2)}
            </Box>
            <Box
              component="span"
              sx={{
                textDecoration: 'line-through',
                color: 'text.secondary',
              }}
            >
              €{((item.price.value.centAmount / 100) * item.quantity).toFixed(2)}
            </Box>
          </Box>
        ) : (
          `€${totalPrice.toFixed(2)}`
        )}
      </Typography>
      <IconButton disabled={loading} color="primary" onClick={() => void handleCartOperation('remove')}>
        <Delete sx={{ width: 28, height: 28 }} />
      </IconButton>
    </Box>
  );
}
