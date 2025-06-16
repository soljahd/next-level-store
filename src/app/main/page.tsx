import type { Metadata } from 'next';
import { Container } from '@mui/material';
import ImageSlider from '@/components/main/image-slider';

export const metadata: Metadata = {
  title: 'Home | Next-Level Store',
  description: 'Welcom to our store',
  keywords: ['online store', 'shop', 'ecommerce'],
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{
        flex: 1,
      }}
    >
      <ImageSlider />
    </Container>
  );
}
