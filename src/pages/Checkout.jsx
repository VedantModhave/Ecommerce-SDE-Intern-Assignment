import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Alert,
  Divider,
  CircularProgress,
} from '@mui/material';
import { ArrowBack, CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCart } from '../hooks/useRedux';
import { formatINR, convertToINR } from '../utils/format';

// Validation schema
const checkoutSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  address: yup
    .string()
    .required('Address is required')
    .min(10, 'Please enter a complete address'),
  city: yup
    .string()
    .required('City is required')
    .min(2, 'City must be at least 2 characters'),
  state: yup
    .string()
    .required('State is required')
    .min(2, 'State must be at least 2 characters'),
  zipCode: yup
    .string()
    .required('ZIP/Postal code is required')
    // Accept US 5-digit, ZIP+4, or 6-digit postal codes (e.g., India)
    .matches(/^(\d{5}(-\d{4})?|\d{6})$/, 'Please enter a valid ZIP/Postal code'),
  phone: yup
    .string()
    .required('Phone number is required')
    // Allow international formats with 10-15 digits; permit +, spaces, dashes, parentheses
    .test(
      'is-valid-phone',
      'Please enter a valid phone number',
      (value) => {
        if (!value) return false;
        const digitsOnly = value.replace(/\D/g, '');
        return digitsOnly.length >= 10 && digitsOnly.length <= 15;
      }
    ),
});

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId] = useState(Math.random().toString(36).substr(2, 9).toUpperCase());

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(checkoutSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Order submitted:', {
      orderId,
      customerInfo: data,
      items: cartItems,
      total: cartTotal,
    });
    
    setIsSubmitting(false);
    setOrderSuccess(true);
    
    // Clear cart after successful order
    setTimeout(() => {
      clearCart();
    }, 1000);
  };

  const handleBackToCart = () => {
    navigate('/cart');
  };

  const handleBackToProducts = () => {
    navigate('/');
  };

  if (cartItems.length === 0 && !orderSuccess) {
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

          <Alert severity="warning">
            Your cart is empty. Please add some items before proceeding to checkout.
          </Alert>
        </Box>
      </Container>
    );
  }

  if (orderSuccess) {
    return (
      <Container maxWidth={false} sx={{ py: { xs: 2, md: 4 }, px: 0 }}>
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ 
          textAlign: 'center', 
          py: { xs: 6, md: 8 },
          px: { xs: 2, md: 4 },
          maxWidth: { xs: '100%', sm: 600 },
          mx: 'auto',
        }}>
          <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
          <Typography variant="h4" gutterBottom>
            Order Confirmed!
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            Order ID: {orderId}
          </Typography>
          <Typography variant="body1" paragraph>
            Thank you for your purchase! You will receive a confirmation email shortly.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Your order will be processed and shipped within 2-3 business days.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleBackToProducts}
            sx={{ mt: 2 }}
          >
            Continue Shopping
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
          onClick={handleBackToCart}
          sx={{ mb: 3 }}
        >
          Back to Cart
        </Button>

        <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: { xs: '1.6rem', md: '2rem' } }}>
          Checkout
        </Typography>

        <Grid container spacing={{ xs: 2, sm: 3, md: 4, lg: 5 }} columns={{ xs: 1, sm: 1, md: 12, lg: 12, xl: 12 }} sx={{ justifyContent: 'center' }}>
        {/* Checkout Form */}
        <Grid item xs={12} md={8} lg={8} xl={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Shipping Information
              </Typography>
              
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={{ xs: 2, md: 2.5 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      {...register('firstName')}
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      {...register('lastName')}
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      {...register('email')}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Street Address"
                      {...register('address')}
                      error={!!errors.address}
                      helperText={errors.address?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="City"
                      {...register('city')}
                      error={!!errors.city}
                      helperText={errors.city?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="State"
                      {...register('state')}
                      error={!!errors.state}
                      helperText={errors.state?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="ZIP Code"
                      {...register('zipCode')}
                      error={!!errors.zipCode}
                      helperText={errors.zipCode?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      placeholder="e.g. +1 555-123-4567 or +91 98765 43210"
                      {...register('phone')}
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                    />
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4} lg={4} xl={4}>
          <Card sx={{ position: { md: 'sticky' }, top: 20 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              
              <Divider sx={{ my: 2 }} />

              {cartItems.map((item) => (
                <Box key={item.id} sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Qty: {item.quantity} × ₹{convertToINR(item.price).toFixed(0)}
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                    {formatINR(item.price * item.quantity)}
                  </Typography>
                </Box>
              ))}

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

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Total
                </Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                  {formatINR(cartTotal)}
                </Typography>
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting}
                onClick={handleSubmit(onSubmit)}
                fullWidth
                sx={{ 
                  py: { xs: 1.2, md: 1.5 }, 
                  fontSize: { xs: '1rem', md: '1.1rem' }, 
                  fontWeight: 600,
                  mb: 2
                }}
              >
                {isSubmitting ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Processing Order...
                  </>
                ) : (
                  'Place Order'
                )}
              </Button>

              <Alert severity="info">
                <Typography variant="body2">
                  <strong>Secure Checkout:</strong> Your payment information is encrypted and secure.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      </Box>
    </Container>
  );
};

export default Checkout;
