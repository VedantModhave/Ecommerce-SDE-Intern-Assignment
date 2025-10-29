/**
 * Main Application Component
 * 
 * Sets up the React application with:
 * - Redux store provider for state management
 * - Material-UI theme provider for consistent styling
 * - React Router for navigation
 * - Toast notifications provider
 * - Global CSS baseline
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import store from './redux/store';
import AppBar from './components/AppBar';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import ShoppingCart from './pages/ShoppingCart';
import Checkout from './pages/Checkout';

/**
 * Material-UI Theme Configuration
 * 
 * Defines the visual design system including:
 * - Color palette (primary blue, secondary red)
 * - Typography settings (Roboto font family)
 * - Spacing system (8px base unit)
 * - Component styling defaults
 */
const theme = createTheme({
  palette: {
    // Nua-inspired soft, feminine palette
    primary: {
      main: '#7A5AF8', // soft violet
      light: '#BFA8FF',
      dark: '#5B3FC4',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FF7CA8', // rosy pink accent
      light: '#FFB3C9',
      dark: '#D75B86',
      contrastText: '#231F20',
    },
    background: {
      default: '#FFF7FB', // very light pink/neutral background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2B1B2D', // deep plum for headings/body
      secondary: '#5D5562',
    },
    divider: '#EFD9E6',
  },
  typography: {
    fontFamily: '"Poppins", "Inter", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  spacing: 8,
  shape: { borderRadius: 10 },
  components: {
    MuiAppBar: {
      defaultProps: { color: 'default' },
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#2B1B2D',
          borderBottom: '1px solid #EFD9E6',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
  },
});

/**
 * App Component
 * 
 * Root component that provides all necessary context providers:
 * - Redux store for state management
 * - Material-UI theme for styling
 * - Toast notifications for user feedback
 * - React Router for navigation
 */
function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider 
          maxSnack={3} 
          autoHideDuration={2200} 
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Router>
            <div className="App">
              <AppBar />
              <Routes>
                <Route path="/" element={<ProductListing />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<ShoppingCart />} />
                <Route path="/checkout" element={<Checkout />} />
              </Routes>
            </div>
          </Router>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;