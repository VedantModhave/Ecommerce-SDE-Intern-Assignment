import React, { useState } from 'react';
import { Box, Skeleton } from '@mui/material';

/**
 * OptimizedImage Component
 * 
 * Provides optimized image loading with:
 * - Lazy loading for below-the-fold images
 * - Placeholder skeleton during load
 * - Error handling
 * - Smooth fade-in transition
 */
const OptimizedImage = ({
  src,
  alt,
  height,
  width,
  sx = {},
  priority = false,
  objectFit = 'contain',
  backgroundColor = '#f5f5f5',
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleLoad = () => {
    setLoading(false);
    setImageLoaded(true);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  // Get numeric height for skeleton (handle responsive objects)
  const getHeight = () => {
    if (typeof height === 'number') return height;
    if (typeof height === 'object' && height?.xs) return height.xs;
    return 200;
  };

  const heightValue = typeof height === 'number' ? `${height}px` : (typeof height === 'object' ? height : 'auto');

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: heightValue,
        backgroundColor: backgroundColor,
        overflow: 'hidden',
        ...sx,
      }}
    >
      {loading && !error && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={getHeight()}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />
      )}
      
      {error ? (
        <Box
          sx={{
            width: '100%',
            height: getHeight(),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: backgroundColor,
            color: 'text.secondary',
            fontSize: '0.875rem',
          }}
        >
          Failed to load image
        </Box>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          width={width}
          height={typeof height === 'number' ? height : undefined}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: '100%',
            height: typeof height === 'object' ? '100%' : (height ? `${height}px` : 'auto'),
            objectFit: objectFit,
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            display: 'block',
          }}
          {...props}
        />
      )}
    </Box>
  );
};

export default OptimizedImage;
