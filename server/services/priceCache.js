// Simple in-memory cache
const cache = {};

// 60 seconds TTL
const TTL = 60 * 1000;

exports.getCachedPrice = (symbol) => {
  const data = cache[symbol];

  if (!data) return null;

  const isExpired = Date.now() - data.timestamp > TTL;

  if (isExpired) {
    delete cache[symbol];
    return null;
  }

  return data.price;
};

exports.setCachedPrice = (symbol, price) => {
  cache[symbol] = {
    price,
    timestamp: Date.now(),
  };
};