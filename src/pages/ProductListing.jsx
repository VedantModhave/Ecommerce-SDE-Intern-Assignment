import React, { useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  Skeleton,
  Chip,
} from '@mui/material';
import { Search, FilterList } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useRedux';
import { useCart } from '../hooks/useRedux';
import { useSnackbar } from 'notistack';
import { formatINR, calculatePricing } from '../utils/format';
import { fetchProductsAsync, fetchCategoriesAsync } from '../redux/slices/productsSlice';
import { useDispatch } from 'react-redux';
import OptimizedImage from '../components/OptimizedImage';

const ProductListing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToCart, cartItems } = useCart();
  const { enqueueSnackbar } = useSnackbar();
  const {
    filteredProducts,
    categories,
    loading,
    error,
    searchTerm,
    selectedCategory,
    setSearchTerm,
    setSelectedCategory,
    clearFilters,
  } = useProducts();

  useEffect(() => {
    // Fetch products and categories on component mount
    dispatch(fetchProductsAsync());
    dispatch(fetchCategoriesAsync());
  }, [dispatch]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    enqueueSnackbar(`${product.title} added to cart`, { variant: 'success' });
  };

  const handleViewCart = () => {
    navigate('/cart');
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  // Loading skeleton component
  const ProductSkeleton = () => (
    <Grid size={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Skeleton variant="rectangular" height={200} />
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.75, pb: 1 }}>
          <Skeleton variant="text" height={{ xs: 40, md: 42 }} />
          <Skeleton variant="text" height={{ xs: 36, md: 40 }} />
          <Skeleton variant="text" height={32} />
          <Skeleton variant="rectangular" height={24} width={80} />
        </CardContent>
        <CardActions sx={{ p: { xs: 1.25, md: 1.75 }, pt: 0.5, gap: 1 }}>
          <Skeleton variant="rectangular" height={{ xs: 36, md: 40 }} sx={{ flex: 1 }} />
          <Skeleton variant="rectangular" height={{ xs: 36, md: 40 }} sx={{ flex: 1 }} />
        </CardActions>
      </Card>
    </Grid>
  );

  return (
    <Container maxWidth={false} sx={{ py: { xs: 2, md: 4 }, px: 0 }}>
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header */}
        <Box sx={{ mb: { xs: 2, md: 4 } }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: { xs: '1.6rem', md: '2rem' } }}>
            Our Products
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Discover amazing products at great prices
          </Typography>
        </Box>

        {/* Search and Filter Controls */}
        <Box sx={{ mb: { xs: 2, md: 4 }, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          label="Search products"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
          }}
          sx={{ minWidth: { xs: '100%', sm: 250 }, flex: { xs: '1 1 100%', sm: '0 0 auto' } }}
        />
        
        <FormControl sx={{ minWidth: { xs: '100%', sm: 200 }, flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={handleCategoryChange}
            startAdornment={<FilterList sx={{ mr: 1, color: 'action.active' }} />}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {(searchTerm || selectedCategory) && (
          <Button
            variant="outlined"
            onClick={handleClearFilters}
            sx={{ ml: 'auto' }}
          >
            Clear Filters
          </Button>
        )}
      </Box>

      {/* Active Filters Display */}
      {(searchTerm || selectedCategory) && (
        <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {searchTerm && (
            <Chip
              label={`Search: "${searchTerm}"`}
              onDelete={() => setSearchTerm('')}
              color="primary"
              variant="outlined"
            />
          )}
          {selectedCategory && (
            <Chip
              label={`Category: ${selectedCategory}`}
              onDelete={() => setSelectedCategory('')}
              color="secondary"
              variant="outlined"
            />
          )}
        </Box>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Products Grid */}
      <Grid container spacing={{ xs: 2, sm: 2, md: 2, lg: 3, xl: 3 }} columns={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4 }}>
        {loading ? (
          // Show skeleton loaders while loading
          Array.from({ length: 8 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))
        ) : filteredProducts.length === 0 ? (
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: 'text.secondary',
                minHeight: { xs: '35vh', md: '45vh' },
              }}
            >
              <Typography variant="h6" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body2">
                Try adjusting your search or filter criteria
              </Typography>
            </Box>
          </Grid>
        ) : (
          filteredProducts.map((product) => (
            <Grid size={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }} key={product.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
                onClick={() => handleProductClick(product.id)}
              >
                <Box
                  sx={{
                    p: { xs: 1, md: 2 },
                    height: 200,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <OptimizedImage
                    src={product.image}
                    alt={product.title}
                    height={200}
                    objectFit="contain"
                    backgroundColor="#f5f5f5"
                  />
                </Box>
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                    pb: 0.5,
                    px: { xs: 1.5, md: 2 },
                    pt: 1.5,
                  }}
                >
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                      fontSize: { xs: '0.95rem', md: '1rem' },
                      fontWeight: 600,
                      lineHeight: 1.3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 0.5,
                    }}
                  >
                    {product.title}
                  </Typography>
                  
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.35,
                      mb: 1,
                    }}
                  >
                    {product.description}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', md: '1.1rem' } }}>
                          {formatINR(calculatePricing(product.price).discountedPrice)}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            textDecoration: 'line-through', 
                            color: 'text.secondary',
                            fontSize: { xs: '0.75rem', md: '0.8rem' }
                          }}
                        >
                          {formatINR(calculatePricing(product.price).originalPrice)}
                        </Typography>
                      </Box>
                      <Chip
                        label={`${calculatePricing(product.price).discountPercent}% off`}
                        size="small"
                        color="success"
                        sx={{ fontWeight: 700 }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.25 }}>
                      <Chip
                        size="small"
                        label={`${product.rating.rate} ★`}
                        variant="outlined"
                        sx={{ 
                          flexShrink: 0,
                          backgroundColor: '#e8f5e8',
                          borderColor: '#4caf50',
                          color: '#2e7d32',
                          '& .MuiChip-label': {
                            color: '#2e7d32'
                          }
                        }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.7rem', lineHeight: 1 }}>
                        {product.rating.count} ratings
                      </Typography>
                    </Box>
                  </Box>

                  <Chip
                    label={product.category}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.75rem', alignSelf: 'flex-start' }}
                  />
                </CardContent>
                
              <CardActions sx={{ p: { xs: 1.5, md: 2 }, pt: 0 }}>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={(e) => {
                      e.stopPropagation();
                      const isInCart = cartItems.some(item => item.id === product.id);
                      if (isInCart) {
                        handleViewCart();
                      } else {
                        handleAddToCart(product);
                      }
                    }}
                    sx={{ fontWeight: 700, py: { xs: 0.9, md: 1.05 } }}
                  >
                    {cartItems.some(item => item.id === product.id) ? 'View Cart' : '+ ADD TO CART'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Results Count */}
      {!loading && filteredProducts.length > 0 && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
      )}
      </Box>
    </Container>
  );
};

export default ProductListing;
