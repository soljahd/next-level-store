'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import theme from '@/theme';

type Slide = {
  title: string;
  subtitle?: string;
  href: string;
  background: string;
};

const gradients = [
  'linear-gradient(135deg, rgb(25, 118, 210), #bbdefb)',
  'linear-gradient(120deg, rgb(25, 118, 210), #64b5f6, #e3f2fd)',
  'linear-gradient(160deg, #42a5f5 10%, #e3f2fd 90%)',
  'linear-gradient(100deg, #64b5f6, #e1f5fe)',
];

const slides: Slide[] = [
  { title: 'Get €5 Off with Code sale5', href: '/cart', background: gradients[3] },
  { title: 'BOOK CATALOG', subtitle: 'Browse all titles available', href: '/catalog', background: gradients[0] },
  { title: 'SIGN UP', subtitle: 'Create an account', href: '/register', background: gradients[1] },
  {
    title: 'MEET THE AUTHORS',
    subtitle: 'Meet the people behind the content',
    href: '/about',
    background: gradients[2],
  },
];

export default function ImageSlider() {
  const router = useRouter();
  const extendedSlides = [slides.at(-1)!, ...slides, slides[0]];
  const [current, setCurrent] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const containerReference = useRef<HTMLDivElement>(null);

  const slideWidthPercent = 100 / extendedSlides.length;
  const transitionStyle = isTransitioning ? 'transform 0.5s ease-in-out' : 'none';

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (current === 0) setCurrent(slides.length);
    if (current === extendedSlides.length - 1) setCurrent(1);
  };

  const previousSlide = useCallback(() => {
    if (isTransitioning) return;
    setCurrent((index) => index - 1);
    setIsTransitioning(true);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setCurrent((index) => index + 1);
    setIsTransitioning(true);
  }, [isTransitioning]);

  const handleClick = (href: string) => {
    router.push(href);
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  const visibleIndex = current === 0 ? slides.length - 1 : current === extendedSlides.length - 1 ? 0 : current - 1;

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Box sx={{ width: '100%', px: { xs: 2, md: 8, xl: 20 }, boxSizing: 'border-box', position: 'relative' }}>
        <Box
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          sx={{
            width: '100%',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: theme.shadows[4],
            position: 'relative',
            height: 'auto',
          }}
        >
          <Box
            ref={containerReference}
            sx={{
              display: 'flex',
              width: `${extendedSlides.length * 100}%`,
              transform: `translateX(-${current * slideWidthPercent}%)`,
              transition: transitionStyle,
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedSlides.map(({ title, subtitle, href, background }, index) => (
              <Box
                key={index}
                onClick={() => handleClick(href)}
                sx={{
                  width: `${slideWidthPercent}%`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background,
                  color: 'primary.main',
                  textAlign: 'center',
                  px: 2,
                  cursor: 'pointer',
                  userSelect: 'none',
                  borderRadius: 2,
                  flexShrink: 0,
                  minHeight: { xs: 200, sm: 300, md: 400, lg: 500, xl: 600 },
                  transition: 'color 0.3s ease',
                  '&:hover': {
                    color: '#0d47a1',
                  },
                  '& > *': {
                    transition: 'color 0.3s ease',
                  },
                }}
              >
                <Box>
                  <Box sx={{ fontSize: { xs: '1.8rem', md: '3rem' }, fontWeight: 700 }}>{title}</Box>
                  {subtitle && (
                    <Box sx={{ fontSize: { xs: '1.2rem', md: '1.8rem' }, fontWeight: 400, mt: 1 }}>{subtitle}</Box>
                  )}
                </Box>
              </Box>
            ))}
          </Box>

          <IconButton
            onClick={previousSlide}
            sx={{
              position: 'absolute',
              top: '50%',
              left: 8,
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              color: '#fff',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
              borderRadius: 1,
              height: 48,
              width: 48,
              zIndex: 2,
            }}
          >
            <ChevronLeft />
          </IconButton>

          <IconButton
            onClick={nextSlide}
            sx={{
              position: 'absolute',
              top: '50%',
              right: 8,
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              color: '#fff',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
              borderRadius: 1,
              height: 48,
              width: 48,
              zIndex: 2,
            }}
          >
            <ChevronRight />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 1 }}>
          {slides.map((_, index) => {
            const isActive = visibleIndex === index;
            return (
              <Box
                key={index}
                onClick={() => {
                  if (!isTransitioning) {
                    setCurrent(index + 1);
                    setIsTransitioning(true);
                  }
                }}
                sx={{
                  width: isActive ? 16 : 10,
                  height: isActive ? 16 : 10,
                  borderRadius: '50%',
                  backgroundColor: isActive ? 'primary.main' : 'grey.400',
                  transform: isActive ? 'scale(1.2)' : 'scale(1)',
                  opacity: isActive ? 1 : 0.6,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
              />
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
