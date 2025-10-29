import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useRedux';
import { useSnackbar } from 'notistack';
import { formatINR } from '../utils/format';
import OptimizedImage from '../components/OptimizedImage';

const ShoppingCart = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { enqueueSnackbar } = useSnackbar();

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
    enqueueSnackbar('Quantity updated', { variant: 'info' });
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    enqueueSnackbar('Item removed from cart', { variant: 'warning' });
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  const handleBackToProducts = () => {
    navigate('/');
  };

  const handleClearCart = () => {
    clearCart();
    enqueueSnackbar('Cart cleared', { variant: 'default' });
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth={false} sx={{ py: { xs: 2, md: 4 }, px: 0 }}>
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBackToProducts}
          sx={{ mb: 3 }}
        >
          Back to Products
        </Button>

        <Box
          sx={{
            textAlign: 'center',
            py: { xs: 6, md: 8 },
            px: { xs: 2, md: 4 },
            color: 'text.secondary',
            maxWidth: { xs: '100%', sm: 600 },
            mx: 'auto',
          }}
        >
          <ShoppingCartIcon sx={{ fontSize: 80, mb: 2, opacity: 0.3 }} />
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" paragraph>
            Looks like you haven't added any items to your cart yet.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleBackToProducts}
            sx={{ mt: 2 }}
          >
            Start Shopping
          </Button>
        </Box>
      </Box>
    </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ py: { xs: 2, md: 4 }, px: 0 }}>
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBackToProducts}
          sx={{ mb: 3 }}
        >
          Back to Products
        </Button>

        <Typography variant="h4" component="h1" gutterBottom>
          Shopping Cart
        </Typography>

        <Grid container spacing={{ xs: 1, sm: 2, md: 2, lg: 3 }} columns={{ xs: 1, sm: 1, md: 12, lg: 12, xl: 12 }}>
        {/* Cart Items */}
        <Grid item xs={12} md={8} lg={8} xl={8}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
            </Typography>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handleClearCart}
            >
              Clear Cart
            </Button>
          </Box>

          {cartItems.map((item) => (
            <Card key={item.id} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={{ xs: 1, md: 1.5 }} alignItems="center">
                  {/* Product Image */}
                  <Grid item xs={12} sm={2} md={2} lg={2}>
                    <Box
                      sx={{
                        borderRadius: 1,
                        overflow: 'hidden',
                        width: '100%',
                        height: 100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <OptimizedImage
                        src={item.image}
                        alt={item.title}
                        height={100}
                        objectFit="contain"
                        backgroundColor="#f5f5f5"
                      />
                    </Box>
                  </Grid>

                  {/* Product Details */}
                  <Grid item xs={12} sm={10} md={10} lg={10}>
                    <Grid container spacing={1.5} alignItems="center">
                      <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Typography
                          variant="h6"
                          component="h3"
                          sx={{
                            fontSize: { xs: '1rem', md: '1.1rem' },
                            fontWeight: 600,
                            lineHeight: 1.3,
                            mb: 0.5,
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Unit Price: {formatINR(item.price)}
                        </Typography>
                      </Grid>

                      {/* Quantity Selector */}
                      <Grid item xs={6} sm={2} md={2} lg={2}>
                        <FormControl size="small" sx={{ minWidth: 80 }}>
                          <InputLabel>Qty</InputLabel>
                          <Select
                            value={item.quantity}
                            label="Qty"
                            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <MenuItem key={num} value={num}>
                                {num}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      {/* Subtotal */}
                      <Grid item xs={4} sm={2} md={2} lg={2}>
                        <Typography
                          variant="h6"
                          color="primary"
                          sx={{ fontWeight: 'bold', textAlign: 'right' }}
                        >
                          {formatINR(item.price * item.quantity)}
                        </Typography>
                      </Grid>

                      {/* Remove Button */}
                      <Grid item xs={2} sm={2} md={2} lg={2}>
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveItem(item.id)}
                          aria-label="remove item"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4} lg={4} xl={4}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              
              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">
                  Subtotal ({cartItems.reduce((count, item) => count + item.quantity, 0)} items)
                </Typography>
                <Typography variant="body1">
                  {formatINR(cartTotal)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Shipping</Typography>
                <Typography variant="body1" color="text.secondary">
                  Free
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Tax</Typography>
                <Typography variant="body1" color="text.secondary">
                  Calculated at checkout
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Total
                </Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                  {formatINR(cartTotal)}
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleProceedToCheckout}
                sx={{ mb: 2, py: 1.5, fontSize: '1.1rem', fontWeight: 600 }}
              >
                Proceed to Checkout
              </Button>

              <Alert severity="info" sx={{ mt: 2 }}>
                Free shipping on orders over ₹1000
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      </Box>
    </Container>
  );
};

export default ShoppingCart;
