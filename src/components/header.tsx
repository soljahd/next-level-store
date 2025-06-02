'use client';

import {
  IconButton,
  AppBar,
  Toolbar,
  Button,
  Box,
  TextField,
  InputAdornment,
  MenuItem,
  Typography,
  Menu,
  styled,
} from '@mui/material';
import {
  Menu as MenuIcon,
  HelpOutline,
  AccountCircle,
  ShoppingCart,
  Search,
  Person,
  ExitToApp,
  HowToReg,
  AppRegistration,
} from '@mui/icons-material';
import Link from 'next/link';
import IconButtonLink from '@/components/icon-button-link';
import MenuLink from '@/components/menu-link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';

const CustomMenuItem = styled(MenuItem)({
  '&:hover': {
    backgroundColor: 'inherit',
  },
  '&.Mui-active': {
    color: 'inherit',
  },
  '& .MuiMenuItem-root.Mui-selected': {
    backgroundColor: 'inherit',
  },
});

export default function Header() {
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };
  const open = Boolean(anchorElement);
  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorElement(null);
  };
  const { isLoggedIn, setLogoutState } = useAuthStore();
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
            component="form"
            onSubmit={handleSearch}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search products..."
            variant="outlined"
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton type="submit" edge="end">
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{ flexGrow: 1 }}
          />
        </Box>

        <Box display="flex" sx={{ gap: { xs: 1, md: 2 } }}>
          <IconButtonLink href="/about" icon={<HelpOutline sx={{ width: 28, height: 28 }} />} text="Authors" />

          <div>
            <IconButtonLink
              onClick={handleOpenMenu}
              icon={<AccountCircle sx={{ width: 28, height: 28 }} />}
              text="Account"
            ></IconButtonLink>
            <Menu
              component={Box}
              anchorEl={anchorElement}
              open={open}
              onClose={handleCloseMenu}
              disableScrollLock
              anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
              transformOrigin={{ horizontal: 'center', vertical: 'top' }}
              sx={{
                '& .MuiMenuItem-root': {
                  pl: 1,
                  pr: 1,
                  cursor: 'default',
                },
              }}
            >
              {isLoggedIn
                ? [
                    <CustomMenuItem key="profile" disableRipple>
                      <MenuLink href="/profile" handler={handleCloseMenu}>
                        <>
                          <Person />
                          <Typography>My profile</Typography>
                        </>
                      </MenuLink>
                    </CustomMenuItem>,
                    <CustomMenuItem key="signOut" disableRipple>
                      <MenuLink
                        href="/main"
                        handler={() => {
                          setLogoutState();
                          handleCloseMenu();
                        }}
                      >
                        <>
                          <ExitToApp />
                          <Typography>Sign Out</Typography>
                        </>
                      </MenuLink>
                    </CustomMenuItem>,
                  ]
                : [
                    <CustomMenuItem key="signIn" disableRipple>
                      <MenuLink href="/login" handler={handleCloseMenu}>
                        <>
                          <HowToReg />
                          <Typography>Sign In</Typography>
                        </>
                      </MenuLink>
                    </CustomMenuItem>,
                    <CustomMenuItem key="signUp" disableRipple>
                      <MenuLink href="/register" handler={handleCloseMenu}>
                        <>
                          <AppRegistration />
                          <Typography>Sign Up</Typography>
                        </>
                      </MenuLink>
                    </CustomMenuItem>,
                  ]}
            </Menu>
          </div>

          <IconButtonLink href="/cart" icon={<ShoppingCart sx={{ width: 28, height: 28 }} />} text="Cart" />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
