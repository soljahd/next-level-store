import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllProducts } from '@/lib/commercetools/catalog';

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

async function getProduct(slug: string) {
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

  return <h1>{product.name.en}</h1>;
}
