import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  Skeleton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import { AddShoppingCart, Star, ArrowBack } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useRedux';
import { useSnackbar } from 'notistack';
import { formatINR } from '../utils/format';
import { fetchProductById } from '../utils/api';
import OptimizedImage from '../components/OptimizedImage';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const { enqueueSnackbar } = useSnackbar();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const productData = await fetchProductById(id);
        setProduct(productData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      enqueueSnackbar(`${product.title} x${quantity} added to cart`, { variant: 'success' });
    }
  };

  const handleBackClick = () => {
    navigate('/');
  };

  const handleViewCart = () => {
    navigate('/cart');
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} sx={{ color: '#ffc107', fontSize: '1.2rem' }} />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" sx={{ color: '#ffc107', fontSize: '1.2rem' }} />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} sx={{ color: '#e0e0e0', fontSize: '1.2rem' }} />
      );
    }

    return stars;
  };

  if (loading) {
    return (
      <Container maxWidth={false} sx={{ py: { xs: 2, md: 4 }, px: 0 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBackClick}
          sx={{ mb: 3, ml: { xs: 2, sm: 3, md: 4 } }}
        >
          Back to Products
        </Button>
        
        <Grid container spacing={{ xs: 1, sm: 2, md: 3, lg: 4 }} columns={{ xs: 1, sm: 1, md: 12, lg: 12, xl: 12 }} sx={{ width: '100%', maxWidth: 'none', px: { xs: 2, sm: 3, md: 4 } }}>
          <Grid item xs={12} sm={5} md={5} lg={5} xl={5}>
            <Card sx={{ height: 'fit-content' }}>
              <Skeleton 
                variant="rectangular" 
                height={{ xs: 320, md: 500 }} 
                width="100%"
                sx={{
                  backgroundColor: '#f5f5f5',
                  p: { xs: 1.5, md: 2 },
                }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} sm={7} md={7} lg={7} xl={7}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Category Chip */}
              <Skeleton variant="rectangular" height={32} width={120} sx={{ borderRadius: 16 }} />
              
              {/* Title */}
              <Skeleton variant="text" height={60} width="100%" />
              <Skeleton variant="text" height={40} width="85%" />
              
              {/* Rating */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Skeleton variant="rectangular" height={24} width={80} sx={{ borderRadius: 12 }} />
                <Skeleton variant="text" height={20} width={100} />
              </Box>
              
              {/* Price */}
              <Skeleton variant="text" height={80} width={200} />
              
              {/* Divider */}
              <Skeleton variant="rectangular" height={1} width="100%" />
              
              {/* Description */}
              <Skeleton variant="text" height={20} width="100%" />
              <Skeleton variant="text" height={20} width="95%" />
              <Skeleton variant="text" height={20} width="90%" />
              <Skeleton variant="text" height={20} width="75%" />
              
              {/* Quantity Selector */}
              <Skeleton variant="rectangular" height={56} width={120} sx={{ borderRadius: 4 }} />
              
              {/* Add to Cart Button */}
              <Skeleton variant="rectangular" height={56} width="100%" sx={{ borderRadius: 4, mt: 'auto' }} />
              
              {/* Product Info */}
              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                <Skeleton variant="text" height={16} width={120} />
                <Skeleton variant="text" height={16} width={200} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth={false} sx={{ py: { xs: 2, md: 4 }, px: 0 }}>
        <Box sx={{ px: { xs: 0.5, sm: 1, md: 1 } }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBackClick}
            sx={{ mb: 3 }}
          >
            Back to Products
          </Button>
          
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        </Box>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth={false} sx={{ py: { xs: 2, md: 4 }, px: 0 }}>
        <Box sx={{ px: { xs: 0.5, sm: 1, md: 1 } }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBackClick}
            sx={{ mb: 3 }}
          >
            Back to Products
          </Button>
          
          <Alert severity="warning">
            Product not found
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ py: { xs: 2, md: 4 }, px: 0 }}>
      <Box sx={{ px: { xs: 0.5, sm: 1, md: 1 } }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBackClick}
          sx={{ mb: 3 }}
        >
          Back to Products
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Grid container spacing={{ xs: 1, sm: 2, md: 3, lg: 4 }} columns={{ xs: 1, sm: 1, md: 12, lg: 12, xl: 12 }} sx={{ maxWidth: { xs: '100%', md: '100%', lg: '100%', xl: '100%' }, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
        {/* Product Image */}
        <Grid item xs={12} sm={5} md={5} lg={5} xl={5}>
            <Card sx={{ height: 'fit-content' }}>
              <Box
                sx={{
                  p: { xs: 1.5, md: 2 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <OptimizedImage
                  src={product.image}
                  alt={product.title}
                  height={{ xs: 320, md: 500 }}
                  objectFit="contain"
                  backgroundColor="#f5f5f5"
                  priority={true}
                />
              </Box>
          </Card>
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} sm={7} md={7} lg={7} xl={7}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Category */}
            <Chip
              label={product.category}
              variant="outlined"
              sx={{ mb: 2, alignSelf: 'flex-start' }}
            />

            {/* Title */}
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 600, lineHeight: 1.2, fontSize: { xs: '1.5rem', md: '2.125rem' } }}
            >
              {product.title}
            </Typography>

            {/* Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                {renderStars(product.rating.rate)}
              </Box>
              <Typography variant="body1" sx={{ mr: 1 }}>
                {product.rating.rate}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ({product.rating.count} reviews)
              </Typography>
            </Box>

            {/* Price */}
            <Typography
              variant="h3"
              color="primary"
              sx={{ fontWeight: 'bold', mb: 3, fontSize: { xs: '2rem', md: '3rem' } }}
            >
              {formatINR(product.price)}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Description */}
            <Typography
              variant="body1"
              paragraph
              sx={{ mb: 3, lineHeight: 1.6 }}
            >
              {product.description}
            </Typography>

            {/* Quantity Selector */}
            <Box sx={{ mb: 3 }}>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Quantity</InputLabel>
                <Select
                  value={quantity}
                  label="Quantity"
                  onChange={(e) => setQuantity(e.target.value)}
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Add to Cart Button */}
            <Button
              variant="contained"
              size="large"
              startIcon={<AddShoppingCart />}
              onClick={cartItems.some((item) => item.id === product.id) ? handleViewCart : handleAddToCart}
              sx={{
                py: { xs: 1.2, md: 1.5 },
                fontSize: { xs: '1rem', md: '1.1rem' },
                fontWeight: 600,
                mt: 'auto',
              }}
            >
              {cartItems.some((item) => item.id === product.id) ? 'View Cart' : 'Add to Cart'}
            </Button>

            {/* Product Info */}
            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e0e0e0' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Product ID: {product.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Free shipping on all orders over ₹1000
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default ProductDetail;
