import Link from '@mui/material/Link';
import { useRouter } from 'next/navigation';
import theme from '@/theme';
import { blue } from '@mui/material/colors';

type MyLinkProps = {
  href: string;
  children: React.ReactNode;
  handler?: () => void;
};

export default function MenuLink({ href, children, handler }: MyLinkProps) {
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    router.push(href);
  };

  return (
    <Link
      href={href}
      onClick={(event) => {
        handleClick(event);
        if (handler) {
          handler();
        }
      }}
      underline="hover"
      sx={{
        display: 'flex',
        justifyContent: 'start',
        gap: 1,
        p: 1 / 2,
        pr: 1,
        pl: 1,
        color: 'primary.main',
        textDecoration: 'none',
        flexGrow: 1,
        borderRadius: 1,
        '&:hover': {
          outline: `1px solid ${theme.palette.primary.dark}`,
          color: `${theme.palette.primary.dark}`,
          backgroundColor: `${blue[50]}`,
          textDecoration: 'none',
        },
        '&:active': {
          outline: `1px solid ${theme.palette.primary.dark}`,
          color: `${theme.palette.primary.dark}`,
          transform: 'scale(0.95)',
          backgroundColor: `${blue[100]}`,
          textDecoration: 'none',
        },
      }}
    >
      {children}
    </Link>
  );
}
