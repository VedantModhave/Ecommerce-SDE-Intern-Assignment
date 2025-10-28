import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProducts, fetchCategories } from '../../utils/api';

// Async thunk for fetching products
export const fetchProductsAsync = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const products = await fetchProducts();
      return products;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching categories
export const fetchCategoriesAsync = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const categories = await fetchCategories();
      return categories;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  products: [],
  categories: [],
  filteredProducts: [],
  loading: false,
  error: null,
  searchTerm: '',
  selectedCategory: '',
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.filteredProducts = state.products.filter(product =>
        product.title.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      let filtered = state.products;
      
      if (action.payload) {
        filtered = state.products.filter(product => product.category === action.payload);
      }
      
      if (state.searchTerm) {
        filtered = filtered.filter(product =>
          product.title.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
      }
      
      state.filteredProducts = filtered;
    },
    clearFilters: (state) => {
      state.searchTerm = '';
      state.selectedCategory = '';
      state.filteredProducts = state.products;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProductsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.filteredProducts = action.payload;
        state.error = null;
      })
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch categories
      .addCase(fetchCategoriesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchCategoriesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchTerm, setSelectedCategory, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;
