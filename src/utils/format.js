/**
 * Currency Formatting and Pricing Utilities
 * 
 * Provides functions for:
 * - Converting USD prices to Indian Rupees (INR)
 * - Formatting currency with proper locale settings
 * - Calculating discount percentages for visual pricing
 * - Computing original vs discounted pricing
 */

/**
 * Format amount as Indian Rupees (INR)
 * 
 * Converts USD prices to INR using 83:1 exchange rate
 * Uses Intl.NumberFormat for proper currency formatting
 * 
 * @param {number} value - Price value to format
 * @returns {string} - Formatted currency string (e.g., "₹1,234")
 */
export const formatINR = (value) => {
  try {
    // Convert USD to INR (multiply by 83) and format as currency
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR', 
      maximumFractionDigits: 0 
    }).format(value * 83 || value);
  } catch {
    // Fallback: simple prefix with ₹ symbol
    return `₹${value}`;
  }
};

/**
 * Calculate discount percentage for visual pricing
 * 
 * Generates realistic discount percentages based on price ranges:
 * - High-value items ($100+): 25% discount
 * - Medium-value items ($50-99): 17% discount  
 * - Low-value items (<$50): 10% discount
 * 
 * @param {number} price - Product price in USD
 * @returns {number} - Discount percentage (10, 17, or 25)
 */
export const computeDiscountPercent = (price) => {
  // Generate discount buckets for realistic pricing display
  if (price >= 100) return 25;  // High-value items get bigger discounts
  if (price >= 50) return 17;   // Medium-value items get moderate discounts
  return 10;                    // Low-value items get small discounts
};

/**
 * Calculate original price and discounted price for display
 * 
 * Computes pricing structure for showing "was/now" pricing:
 * - Original price: Calculated based on discount percentage
 * - Discounted price: Current selling price
 * - Discount percentage: Visual discount indicator
 * 
 * @param {number} price - Current selling price in USD
 * @returns {Object} - Pricing object with originalPrice, discountedPrice, discountPercent
 */
export const calculatePricing = (price) => {
  const discountPercent = computeDiscountPercent(price);
  // Calculate original price: price / (1 - discount/100)
  const originalPrice = price / (1 - discountPercent / 100);
  const discountedPrice = price;
  
  return {
    originalPrice,    // Higher price (strikethrough)
    discountedPrice,  // Current price (highlighted)
    discountPercent   // Discount percentage (chip)
  };
};

/**
 * Convert USD price to INR for display
 * 
 * Simple conversion function for showing USD prices in INR
 * Used in order summaries and item listings
 * 
 * @param {number} usdPrice - Price in USD
 * @returns {number} - Price in INR (USD * 83)
 */
export const convertToINR = (usdPrice) => {
  return usdPrice * 83; // 1 USD = 83 INR (approximate rate)
};

