// Simple in-memory cache with expiration
const cache = new Map();

// Get cached data if not expired
export const getCachedData = (key) => {
  const cached = cache.get(key);
  
  if (!cached) {
    return null;
  }
  
  const now = Date.now();
  if (now > cached.expiry) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
};

// Set cached data with expiration time in milliseconds
export const setCachedData = (key, data, expiryMs = 60000) => {
  const now = Date.now();
  cache.set(key, {
    data,
    expiry: now + expiryMs,
  });
};

// Clear all cache
export const clearCache = () => {
  cache.clear();
};

// Clear expired cache entries
export const clearExpiredCache = () => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now > value.expiry) {
      cache.delete(key);
    }
  }
};

// Auto-cleanup every 5 minutes
setInterval(clearExpiredCache, 5 * 60 * 1000);
