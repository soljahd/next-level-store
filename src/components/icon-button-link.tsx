'use client';

import { Button, Typography } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import Link from 'next/link';
import type { LinkProps } from 'next/link';
import type { ReactNode } from 'react';

type IconButtonLinkProps = {
  href: LinkProps['href'];
  icon: ReactNode;
  text: string;
} & ButtonProps;

export default function IconButtonLink({ href, icon, text, ...props }: IconButtonLinkProps) {
  return (
    <Button
      component={Link}
      href={href}
      variant="outlined"
      sx={{
        gap: 1,
        paddingX: { xs: 0, md: 2 },
        minWidth: { xs: 44, sm: 64 },
        ...props.sx,
      }}
      {...props}
    >
      {icon}
      <Typography component="span" variant="button" sx={{ display: { xs: 'none', lg: 'block' } }}>
        {text}
      </Typography>
    </Button>
  );
}
