// Simple in-memory cache
class Cache {
  constructor() {
    this.store = new Map();
    this.ttl = 5 * 60 * 1000; // 5 minutes default TTL
  }

  set(key, value, ttl = this.ttl) {
    const expiry = Date.now() + ttl;
    this.store.set(key, { value, expiry });
  }

  get(key) {
    const item = this.store.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.store.delete(key);
      return null;
    }

    return item.value;
  }

  delete(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }

  // Clean expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.store.entries()) {
      if (now > item.expiry) {
        this.store.delete(key);
      }
    }
  }
}

const cache = new Cache();

// Run cleanup every 10 minutes
setInterval(() => cache.cleanup(), 10 * 60 * 1000);

module.exports = cache;
