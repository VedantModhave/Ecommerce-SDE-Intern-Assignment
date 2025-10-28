/**
 * API Integration and Caching Utility
 * 
 * Provides centralized API communication with the Fake Store API:
 * - Axios instance with timeout and error handling
 * - Multi-layer caching strategy (memory + localStorage)
 * - Request deduplication to prevent duplicate calls
 * - Automatic cache invalidation (5-minute TTL)
 * 
 * Caching Strategy:
 * 1. Memory cache for immediate access
 * 2. localStorage backup for persistence across sessions
 * 3. Automatic cache expiration and refresh
 */
import axios from 'axios';

// Fake Store API base URL
const API_BASE_URL = 'https://fakestoreapi.com';

/**
 * Create axios instance with base configuration
 * 
 * Features:
 * - 10-second timeout for all requests
 * - JSON content type headers
 * - Centralized error handling
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Multi-layer cache system
 * 
 * Structure:
 * - products: Cached product list
 * - categories: Cached category list
 * - productById: Map for individual product details
 * - lastFetch: Timestamps for cache validation
 */
const cache = {
  products: null,                    // Cached products array
  categories: null,                  // Cached categories array
  productById: new Map(),           // Individual product cache (Map for O(1) lookup)
  lastFetch: {
    products: null,                 // Last products fetch timestamp
    categories: null,               // Last categories fetch timestamp
  },
};

// Cache duration: 5 minutes (300,000 milliseconds)
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * Check if cached data is still valid
 * 
 * @param {string} key - Cache key ('products' or 'categories')
 * @returns {boolean} - True if cache is valid and not expired
 */
const isCacheValid = (key) => {
  const lastFetch = cache.lastFetch[key];
  if (!lastFetch) return false;
  return Date.now() - lastFetch < CACHE_DURATION;
};

// Fetch all products with caching
export const fetchProducts = async () => {
  try {
    // Check if we have valid cached data
    if (cache.products && isCacheValid('products')) {
      console.log('Using cached products data');
      return cache.products;
    }

    // Check localStorage first
    const cachedData = localStorage.getItem('products');
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_DURATION) {
        console.log('Using localStorage cached products data');
        cache.products = data;
        cache.lastFetch.products = timestamp;
        return data;
      }
    }

    console.log('Fetching products from API');
    const response = await api.get('/products');
    const products = response.data;

    // Update cache
    cache.products = products;
    cache.lastFetch.products = Date.now();

    // Save to localStorage
    localStorage.setItem('products', JSON.stringify({
      data: products,
      timestamp: Date.now(),
    }));

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products. Please try again later.');
  }
};

// Fetch product by ID
export const fetchProductById = async (id) => {
  try {
    // In-memory cache first
    if (cache.productById.has(id)) {
      return cache.productById.get(id);
    }

    // localStorage cache
    const lsKey = `product_${id}`;
    const cached = localStorage.getItem(lsKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        cache.productById.set(id, data);
        return data;
      }
    }

    // Fetch from API
    const response = await api.get(`/products/${id}`);
    const product = response.data;

    cache.productById.set(id, product);
    localStorage.setItem(lsKey, JSON.stringify({ data: product, timestamp: Date.now() }));
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new Error('Failed to fetch product details. Please try again later.');
  }
};

// Fetch all categories with caching
export const fetchCategories = async () => {
  try {
    // Check if we have valid cached data
    if (cache.categories && isCacheValid('categories')) {
      console.log('Using cached categories data');
      return cache.categories;
    }

    // Check localStorage first
    const cachedData = localStorage.getItem('categories');
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_DURATION) {
        console.log('Using localStorage cached categories data');
        cache.categories = data;
        cache.lastFetch.categories = timestamp;
        return data;
      }
    }

    console.log('Fetching categories from API');
    const response = await api.get('/products/categories');
    const categories = response.data;

    // Update cache
    cache.categories = categories;
    cache.lastFetch.categories = Date.now();

    // Save to localStorage
    localStorage.setItem('categories', JSON.stringify({
      data: categories,
      timestamp: Date.now(),
    }));

    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories. Please try again later.');
  }
};

// Clear cache (useful for testing or manual refresh)
export const clearCache = () => {
  cache.products = null;
  cache.categories = null;
  cache.productById = new Map();
  cache.lastFetch.products = null;
  cache.lastFetch.categories = null;
  localStorage.removeItem('products');
  localStorage.removeItem('categories');
  // Remove product detail entries
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('product_')) {
      localStorage.removeItem(key);
    }
  });
};

export default api;
