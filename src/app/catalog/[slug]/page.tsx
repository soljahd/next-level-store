import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllProducts } from '@/lib/commercetools/catalog';
import ProductDetails from '@/components/product-details';
import type { ProductProjection } from '@commercetools/platform-sdk';
import { Box } from '@mui/material';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  const product = await getProduct(slug);

  if (!product) {
    return {};
  }

  return {
    title: product.name.en,
  };
}

async function getProduct(slug: string): Promise<ProductProjection | null> {
  const allProducts = await getAllProducts();
  const products = allProducts?.results;
  if (!products) return null;
  return products.find((product) => product.slug.en === slug) || null;
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const breadcrumb = ['Books'];

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        px: 2,
        py: 4,
      }}
    >
      <Box sx={{ maxWidth: '1200px', width: '100%' }}>
        <ProductDetails product={product} breadcrumb={breadcrumb} />
      </Box>
    </Box>
  );
}
