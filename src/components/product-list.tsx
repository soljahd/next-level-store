'use client';
import ProductCard from '@/components/product-card';
import type { ProductProjection } from '@commercetools/platform-sdk';

type ProductsListProps = {
  products: ProductProjection[];
};

export default function ProductsList({ products }: ProductsListProps) {
  if (products.length === 0) return <div>No products found.</div>;

  return (
    <>
      {products.map((product, index) => {
        const slug = product.slug?.en;
        const title = product.name?.en || '';
        const attribute = product.masterVariant?.attributes?.find((attribute) => attribute.name === 'author');
        const author = typeof attribute?.value === 'string' ? attribute.value : '';
        const image = product.masterVariant?.images?.[0]?.url || '';
        const pagesAttribute = product.masterVariant?.attributes?.find((attribute) => attribute.name === 'pages');
        const pages = typeof pagesAttribute?.value === 'number' ? pagesAttribute.value : 0;
        const discountedPriceCents = product.masterVariant?.prices?.[0]?.discounted?.value?.centAmount || 0;
        const price = (discountedPriceCents / 100).toFixed(2);
        const oldPriceCents = product.masterVariant?.prices?.[0]?.value?.centAmount || 0;
        const oldPrice = (oldPriceCents / 100).toFixed(2);

        return (
          <ProductCard
            slug={slug}
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
