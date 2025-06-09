'use client';
import React, { useState } from 'react';
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  TextField,
  Typography,
  Box,
  Tooltip,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

type Product = {
  id: number | string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

type ProductListItemProps = {
  product: Product;
  //   onChangeQuantity: (id: number | string, quantity: number) => void;
  discountPercent?: number;
};

export default function CartItem({
  product,
  //   onChangeQuantity,
  discountPercent = 0,
}: ProductListItemProps) {
  const [localQuantity, setLocalQuantity] = useState<number>(product.quantity);

  const handleQuantityChange = (value: string) => {
    const qty = Math.max(1, Number(value));
    setLocalQuantity(qty);
    // onChangeQuantity(product.id, qty);
  };

  const discountedPrice = product.price * (1 - discountPercent / 100);
  const isDiscountApplied = discountPercent > 0;

  return (
    <ListItem alignItems="center" sx={{ gap: 2, border: '1px solid grey', borderRadius: 2 }}>
      <ListItemAvatar>
        <Avatar variant="square" src={product.image} sx={{ height: 120, width: 90 }} />
      </ListItemAvatar>
      <ListItemText
        primary={product.name}
        // secondary={
        //   можно добавить краткое описание если приходит от комерса
        // }
      />
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" gap={{ xs: 1, sm: 2 }}>
        {isDiscountApplied ? (
          <>
            <Typography variant="body1" color="textSecondary" sx={{ textDecoration: 'line-through' }}>
              ${product.price.toFixed(2)}
            </Typography>
            <Typography variant="body1" color="error">
              ${discountedPrice.toFixed(2)}
            </Typography>
          </>
        ) : (
          <Typography variant="body1">${product.price.toFixed(2)}</Typography>
        )}
        {/* счетчик количества */}
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton size="small" color="primary" onClick={() => handleQuantityChange(String(localQuantity - 1))}>
            <RemoveCircleOutlineIcon />
          </IconButton>
          <TextField
            value={localQuantity}
            size="small"
            type="number"
            onChange={(event) => handleQuantityChange(event.target.value)}
            sx={{
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
          <IconButton size="small" color="primary" onClick={() => handleQuantityChange(String(localQuantity + 1))}>
            <AddCircleOutlineIcon />
          </IconButton>
        </Box>
        <Tooltip title="Delete book" arrow>
          <IconButton size="large" color="primary">
            <DeleteIcon></DeleteIcon>
          </IconButton>
        </Tooltip>
      </Box>
    </ListItem>
  );
}
