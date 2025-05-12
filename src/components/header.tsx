'use client';

import { AppBar, Toolbar, Button, Box, TextField, InputAdornment } from '@mui/material';
import { Menu as MenuIcon, HelpOutline, AccountCircle, ShoppingCart, Search } from '@mui/icons-material';
import Link from 'next/link';
import IconButtonLink from '@/components/icon-button-link';

export default function Header() {
  return (
    <AppBar elevation={0} color="transparent" position="static">
      <Toolbar
        sx={{
          gap: 2,
          paddingX: { xs: 2, md: 8, xl: 20 },
          paddingY: { xs: 2, md: 2 },
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          justifyContent: 'space-between',
        }}
      >
        <Button component={Link} href="/main" sx={{ display: 'flex' }}>
          <Box
            component="img"
            src="/logo.svg"
            alt="Logo"
            sx={{ width: { xs: 40, md: 50 }, height: { xs: 40, md: 50 } }}
          />
        </Button>

        <Box
          display="flex"
          sx={{
            gap: { xs: 1, md: 2 },
            flexGrow: 1,
            order: { xs: 1, sm: 0 },
            minWidth: { xs: '100%', sm: 'auto' },
          }}
        >
          <IconButtonLink href="/catalog" icon={<MenuIcon sx={{ width: 28, height: 28 }} />} text="Catalog" />

          <TextField
            variant="outlined"
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ flexGrow: 1 }}
          />
        </Box>

        <Box display="flex" sx={{ gap: { xs: 1, md: 2 } }}>
          <IconButtonLink href="/about" icon={<HelpOutline sx={{ width: 28, height: 28 }} />} text="Authors" />

          <IconButtonLink href="/login" icon={<AccountCircle sx={{ width: 28, height: 28 }} />} text="Sign In/Up" />

          <IconButtonLink href="/cart" icon={<ShoppingCart sx={{ width: 28, height: 28 }} />} text="Cart" />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
