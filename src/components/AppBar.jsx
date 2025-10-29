import React from 'react';
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useRedux';

const AppBar = () => {
  const navigate = useNavigate();
  const { cartItemCount } = useCart();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <MuiAppBar position="sticky" color="default" elevation={2} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
      <Toolbar sx={{ gap: 1 }}>
        <Typography
          variant={isSmall ? 'h6' : 'h6'}
          component="div"
          sx={{
            flexGrow: 1,
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            letterSpacing: 0.2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          onClick={handleLogoClick}
        >
          🛍️ E‑Commerce Store
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            onClick={handleCartClick}
            sx={{ ml: 1 }}
            aria-label="shopping cart"
            size={isSmall ? 'small' : 'medium'}
          >
            <Badge badgeContent={cartItemCount} color="secondary" max={99}>
              <ShoppingCart />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
