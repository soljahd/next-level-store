'use client';

import { AppBar, Toolbar, Box, Button } from '@mui/material';

export default function Footer() {
  return (
    <AppBar elevation={0} color="transparent" position="static">
      <Toolbar
        sx={{
          justifyContent: 'center',
          paddingY: { xs: 2, md: 3 },
        }}
      >
        <Button
          component="a"
          href="https://rs.school"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ display: 'flex' }}
        >
          <Box
            component="img"
            src="/rs_school.svg"
            alt="Logo"
            sx={{ width: { xs: 50, md: 60 }, height: { xs: 40, md: 60 } }}
          />
        </Button>
      </Toolbar>
    </AppBar>
  );
}
