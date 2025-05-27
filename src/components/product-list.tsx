'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from './product-card';
import { searchProducts } from '@/lib/commercetools/catalog';
import type { ProductProjection } from '@commercetools/platform-sdk';

type ProductsListProps = {
  categoryId: string | null;
};

export default function ProductsList({ categoryId }: ProductsListProps) {
  const [products, setProducts] = useState<ProductProjection[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await searchProducts({ limit: 50, categoryId: categoryId || undefined });
        setProducts(data?.results || []);
      } finally {
        setLoading(false);
      }
    };

    void fetchProducts();
  }, [categoryId]);

  if (loading) return <div>Loading...</div>;
  if (products.length === 0) return <div>No products found.</div>;

  return (
    <>
      {products.map((product, index) => {
        const title = product.name?.en || '';
        const attribute = product.masterVariant?.attributes?.find((attribute) => attribute.name === 'author');
        const author = typeof attribute?.value === 'string' ? attribute.value : '';
        const image = product.masterVariant?.images?.[0]?.url || '';
        const pagesAttribute = product.masterVariant?.attributes?.find((attribute) => attribute.name === 'pages');
        const pages = typeof pagesAttribute?.value === 'number' ? pagesAttribute.value : 0;
        const priceCents = product.masterVariant?.prices?.[0]?.value?.centAmount || 0;
        const price = (priceCents / 100).toFixed(2);
        const oldPriceCents = product.masterVariant?.prices?.[0]?.value?.centAmount || 0;
        const oldPrice = (oldPriceCents / 100).toFixed(2);

        return (
          <ProductCard
            key={index}
            image={image}
            title={title}
            author={author}
            year={pages}
            price={price}
            oldPrice={oldPrice}
          />
        );
      })}
    </>
  );
}
