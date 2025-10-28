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
    primary: {
      main: '#1976d2', // Primary blue color
    },
    secondary: {
      main: '#dc004e', // Secondary red color
    },
    background: {
      default: '#f5f5f5', // Light gray background
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600, // Semi-bold headings
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  spacing: 8, // 8px base spacing unit
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