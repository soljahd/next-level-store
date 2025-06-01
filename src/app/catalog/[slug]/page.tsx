import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllProducts } from '@/lib/commercetools/catalog';
import ProductDetails from '@/components/product-details';
import type { ProductProjection } from '@commercetools/platform-sdk';
import { Container } from '@mui/material';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
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

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const breadcrumb = ['Books'];

  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{
        flex: 1,
        paddingX: { xs: 2, md: 8, xl: 20 },
        paddingY: 2,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <ProductDetails product={product} breadcrumb={breadcrumb} />
    </Container>
  );
}
