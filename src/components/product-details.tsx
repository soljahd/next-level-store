'use client';
import { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, Dialog, DialogContent } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos, Close } from '@mui/icons-material';
import type { ProductProjection } from '@commercetools/platform-sdk';
import Image from 'next/image';

type ProductDetailsProps = {
  product: ProductProjection;
  breadcrumb: string[];
};

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export default function ProductDetails({ product, breadcrumb }: ProductDetailsProps) {
  const title = product.name?.en || '';
  const description = product.description?.en || '';
  const authorAttribute = product.masterVariant?.attributes?.find((a) => a.name === 'author');
  const author = isString(authorAttribute?.value) ? authorAttribute.value : '';
  const pagesAttribute = product.masterVariant?.attributes?.find((a) => a.name === 'pages');
  const pages = isNumber(pagesAttribute?.value) ? pagesAttribute.value : '';

  const images = product.masterVariant?.images || [];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [displayedImageIndex, setDisplayedImageIndex] = useState(fullscreenImageIndex);

  useEffect(() => {
    setDisplayedImageIndex(fullscreenImageIndex);
  }, [fullscreenImageIndex]);

  useEffect(() => {
    if (isDialogOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDialogOpen]);

  const changeImageIndex = (newIndex: number) => {
    setIsFading(true);
    setTimeout(() => {
      setDisplayedImageIndex(newIndex);
      setFullscreenImageIndex(newIndex);
      setIsFading(false);
    }, 300);
  };

  const priceCents = product.masterVariant?.prices?.[0]?.value?.centAmount || 0;
  const discountedCents = product.masterVariant?.prices?.[0]?.discounted?.value?.centAmount;
  const price = discountedCents ? (discountedCents / 100).toFixed(2) : (priceCents / 100).toFixed(2);
  const oldPrice = discountedCents ? (priceCents / 100).toFixed(2) : '';
  const sliderWidth = 460;

  const handleImageClick = (index: number) => {
    setFullscreenImageIndex(index);
    setDialogOpen(true);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="subtitle2" sx={{ mb: 3, color: 'text.secondary', fontSize: '1rem', display: 'none' }}>
        {breadcrumb.join(' / ')} / {title}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: 5,
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'flex-start',
          '& > div': {
            minHeight: { xs: 'auto', md: '575px' },
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: { xs: '100%', md: `${sliderWidth}px` },
            borderRadius: 2,
            overflow: 'hidden',
            flexShrink: 0,
            cursor: 'pointer',
          }}
          onClick={() => handleImageClick(currentImageIndex)}
        >
          <Box
            sx={{
              display: 'flex',
              transition: 'transform 0.5s ease-in-out',
              transform: `translateX(-${currentImageIndex * 100}%)`,
              borderRadius: 2,
              height: '100%',
            }}
          >
            {images.map((image, index) => (
              <Box
                key={index}
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '575px',
                  flexShrink: 0,
                }}
              >
                <Image
                  src={image.url}
                  alt={`${title} image ${index + 1}`}
                  fill
                  style={{ objectFit: 'contain', borderRadius: '8px' }}
                  sizes="(max-width: 768px) 100vw, 460px"
                  priority
                />
              </Box>
            ))}
          </Box>

          {images.length > 1 && (
            <>
              <IconButton
                color="primary"
                onClick={(event) => {
                  event.stopPropagation();
                  setCurrentImageIndex((previous) => (previous === 0 ? images.length - 1 : previous - 1));
                }}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '10px',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
                }}
              >
                <ArrowBackIos sx={{ color: 'primary.main' }} />
              </IconButton>
              <IconButton
                color="primary"
                onClick={(event) => {
                  event.stopPropagation();
                  setCurrentImageIndex((previous) => (previous === images.length - 1 ? 0 : previous + 1));
                }}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: '10px',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
                }}
              >
                <ArrowForwardIos sx={{ color: 'primary.main' }} />
              </IconButton>
            </>
          )}
        </Box>

        <Box
          sx={{
            width: { xs: '100%', md: `${sliderWidth}px` },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 3,
            height: { xs: 'auto', md: '575px' },
            backgroundColor: '#f9f9f9',
            borderRadius: 2,
            boxSizing: 'border-box',
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontSize: '2.2rem', fontWeight: 'bold', mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontSize: '1.1rem', mb: 2 }}>
              {author}, {pages}
            </Typography>

            <Typography variant="body1" sx={{ fontSize: '1.05rem', mb: 3 }}>
              {description}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" sx={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'red' }}>
                €{price}
              </Typography>
              {oldPrice && (
                <Typography
                  variant="body1"
                  sx={{ textDecoration: 'line-through', ml: 2, fontSize: '1.2rem', color: 'text.secondary' }}
                >
                  €{oldPrice}
                </Typography>
              )}
            </Box>
          </Box>

          <Button
            variant="contained"
            color="primary"
            sx={{ textTransform: 'none', fontSize: '1.1rem', px: 5, py: 1.2 }}
          >
            Add to Cart
          </Button>
        </Box>
      </Box>

      <Dialog
        open={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        fullScreen
        slotProps={{
          paper: {
            sx: {
              margin: 0,
              width: '100%',
              height: '100%',
              maxWidth: '100%',
              maxHeight: '100%',
              borderRadius: 0,
              overflow: 'hidden',
              boxSizing: 'border-box',
            },
          },
        }}
      >
        <IconButton onClick={() => setDialogOpen(false)} sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
          <Close sx={{ color: 'primary.main' }} />
        </IconButton>

        <DialogContent
          sx={{
            p: { xs: 2, sm: 4 },
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: '80vw',
              maxWidth: 900,
              height: '80vh',
              mb: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <IconButton
              onClick={() => changeImageIndex(displayedImageIndex === 0 ? images.length - 1 : displayedImageIndex - 1)}
              sx={{
                position: 'absolute',
                top: '50%',
                left: 4,
                transform: 'translateY(-50%)',
                zIndex: 5,
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
              }}
            >
              <ArrowBackIos sx={{ color: 'primary.main' }} />
            </IconButton>
            <IconButton
              onClick={() => changeImageIndex(displayedImageIndex === images.length - 1 ? 0 : displayedImageIndex + 1)}
              sx={{
                position: 'absolute',
                top: '50%',
                right: 4,
                transform: 'translateY(-50%)',
                zIndex: 5,
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
              }}
            >
              <ArrowForwardIos sx={{ color: 'primary.main' }} />
            </IconButton>

            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                transition: 'opacity 0.3s ease-in-out',
                opacity: isFading ? 0 : 1,
              }}
            >
              <Image
                src={images[displayedImageIndex]?.url || ''}
                alt={`Fullscreen image ${displayedImageIndex + 1}`}
                fill
                style={{ objectFit: 'contain' }}
                sizes="80vw"
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 1,
              overflowX: 'auto',
              overflowY: 'hidden',
              pt: 2,
              width: '100%',
              maxWidth: 900,
              boxSizing: 'border-box',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            {images.map((img, index) => (
              <Box
                key={index}
                onClick={() => changeImageIndex(index)}
                sx={{
                  position: 'relative',
                  width: 80,
                  height: 80,
                  flexShrink: 0,
                  cursor: 'pointer',
                  border: index === displayedImageIndex ? '2px solid black' : '2px solid transparent',
                  borderRadius: 1,
                  opacity: index === displayedImageIndex ? 1 : 0.7,
                  transition: 'opacity 0.3s',
                }}
              >
                <Image
                  src={img.url}
                  alt={`thumb-${index}`}
                  fill
                  style={{ objectFit: 'cover', borderRadius: '4px' }}
                  sizes="80px"
                />
              </Box>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
