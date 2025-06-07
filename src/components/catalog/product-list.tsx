'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/catalog/product-card';
import type { ProductProjection, Cart } from '@commercetools/platform-sdk';
import { getActiveCart } from '@/lib/commercetools/cart';
import { enqueueSnackbar } from 'notistack';

type ProductsListProps = {
  products: ProductProjection[];
};

export default function ProductsList({ products }: ProductsListProps) {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Cart | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handleCloseError = () => setErrorMessage(null);

  useEffect(() => {
    if (errorMessage) {
      enqueueSnackbar(errorMessage, {
        variant: 'error',
        onClose: handleCloseError,
      });
    }
  }, [errorMessage]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cart = await getActiveCart();
        if (!cart) {
          throw new Error('No cart');
        }
        setCart(cart);
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCart().catch(() => {
      setLoading(false);
    });
  }, []);

  const updateCart = async () => {
    try {
      const updatedCart = await getActiveCart();
      if (!updatedCart) {
        throw new Error('No cart');
      }
      setCart(updatedCart);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  };

  if (loading) {
    return null;
  }

  if (products.length === 0) return <div>No products found.</div>;

  return (
    <>
      {products.map((product, index) => {
        const productId = product.id;
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
        const inCart = cart?.lineItems.some((item) => item.productId === productId) || false;

        return (
          <ProductCard
            inCart={inCart}
            productId={productId}
            slug={slug}
            key={index}
            image={image}
            title={title}
            author={author}
            year={pages}
            price={price}
            oldPrice={oldPrice}
            onAddToCart={updateCart}
          />
        );
      })}
    </>
  );
}
