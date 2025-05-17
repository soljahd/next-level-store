'use client';

import { Box, Stack, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        paddingX: { xs: 2, md: 8, xl: 20 },
        paddingY: 2,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="center">
        <Typography variant="body2">© 2025 Next-Level Store</Typography>
      </Stack>
    </Box>
  );
}
