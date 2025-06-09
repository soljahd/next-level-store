import { Box, Button, IconButton, List, Paper, Stack, TextField, Tooltip, Typography } from '@mui/material';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import Link from 'next/link';
import CartItem from './cart-item';

export default function ShoppingCart() {
  const cart = true; // в корзине есть товары?
  const itemsInCart = 1;
  const totalPrice = 10;

  if (cart) {
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
            <CartItem
              product={{
                id: 1,
                name: 'English',
                image:
                  'https://s1-goods.ozstatic.by/480/20/914/10/10914020_0_Angliyskiy_yazik_6_klass_Praktikum-2_povishenniy_uroven.jpg',
                price: 10,
                quantity: 1,
              }}
            ></CartItem>
            <CartItem
              product={{
                id: 1,
                name: 'English',
                image:
                  'https://s1-goods.ozstatic.by/480/20/914/10/10914020_0_Angliyskiy_yazik_6_klass_Praktikum-2_povishenniy_uroven.jpg',
                price: 10,
                quantity: 1,
              }}
            ></CartItem>
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
            Total items in cart: {itemsInCart}
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
          <Typography sx={{ p: 1, textAlign: 'center', border: '1px solid grey' }}>Total price {totalPrice}</Typography>
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
