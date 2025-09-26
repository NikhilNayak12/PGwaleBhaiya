// Production data service with caching and error handling
import { getAllPGs, getAllLandlords, getAdminDashboard, healthCheck } from '../utils/api';

class DataService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.isOnline = navigator.onLine;
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.clearCache(); // Clear cache when coming back online
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Generic cache key generator
  getCacheKey(endpoint, params = {}) {
    return `${endpoint}_${JSON.stringify(params)}`;
  }

  // Check if cached data is still valid
  isCacheValid(cacheEntry) {
    return Date.now() - cacheEntry.timestamp < this.cacheTimeout;
  }

  // Get data from cache or API
  async getData(endpoint, apiFunction, params = {}, fallbackData = null) {
    const cacheKey = this.getCacheKey(endpoint, params);
    
    // Check cache first
    const cachedData = this.cache.get(cacheKey);
    if (cachedData && this.isCacheValid(cachedData)) {
      return {
        data: cachedData.data,
        fromCache: true,
        error: null
      };
    }

    // If offline, return cached data or fallback
    if (!this.isOnline) {
      if (cachedData) {
        return {
          data: cachedData.data,
          fromCache: true,
          error: 'Offline - showing cached data'
        };
      }
      return {
        data: fallbackData,
        fromCache: false,
        error: 'Offline - using fallback data'
      };
    }

    try {
      // Try to fetch from API
      const response = await apiFunction(params);
      const data = response.data?.data || response.data || fallbackData;
      
      // Cache the response
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return {
        data,
        fromCache: false,
        error: null
      };
    } catch (error) {
      console.warn(`Failed to fetch ${endpoint}:`, error.message);
      
      // Return cached data if available
      if (cachedData) {
        return {
          data: cachedData.data,
          fromCache: true,
          error: `API error - showing cached data: ${error.message}`
        };
      }

      // Return fallback data
      return {
        data: fallbackData,
        fromCache: false,
        error: `API error - using fallback data: ${error.message}`
      };
    }
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Health check
  async checkHealth() {
    try {
      await healthCheck();
      return { healthy: true, error: null };
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  }

  // Get PGs with caching
  async getPGs(params = {}) {
    const fallbackPGs = [
      {
        id: 1,
        name: "Green Valley Boys PG",
        location: "Law Gate",
        distance: "0.5 km from LPU Gate",
        price: 8500,
        type: "Single/Double",
        featured: true,
        tags: ["Wifi","Parking","Meals","Security"],
        images: ["/pgs/green-1.jpg", "/pgs/green-2.jpg", "/pgs/green-3.jpg"],
        status: "approved"
      },
      {
        id: 2,
        name: "Royal Comfort PG",
        location: "Phagwara",
        distance: "1.2 km from LPU Gate",
        price: 7000,
        type: "Double/Triple",
        featured: true,
        tags: ["Wifi","Meals","Laundry"],
        images: ["/pgs/royal-1.jpg", "/pgs/royal-2.jpg", "/pgs/royal-3.jpg"],
        status: "approved"
      }
    ];

    return this.getData('pgs', getAllPGs, params, fallbackPGs);
  }

  // Get landlords with caching
  async getLandlords(params = {}) {
    const fallbackLandlords = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+91 9876543210',
        totalPGs: 2,
        joinedDate: '2023-12-01',
        status: 'verified',
        pgs: []
      }
    ];

    return this.getData('landlords', getAllLandlords, params, fallbackLandlords);
  }

  // Get admin dashboard data
  async getAdminDashboard() {
    const fallbackDashboard = {
      stats: {
        totalPGs: 25,
        activePGs: 18,
        pendingPGs: 5,
        totalLandlords: 12,
        totalInquiries: 156
      },
      recentPGs: [],
      recentInquiries: []
    };

    return this.getData('admin_dashboard', getAdminDashboard, {}, fallbackDashboard);
  }

  // Preload critical data
  async preloadData() {
    try {
      // Preload commonly used data
      await Promise.allSettled([
        this.getPGs({ limit: 20, featured: true }),
        this.checkHealth()
      ]);
    } catch (error) {
      console.warn('Failed to preload data:', error.message);
    }
  }

  // Get cache statistics
  getCacheStats() {
    const stats = {
      totalEntries: this.cache.size,
      entries: []
    };

    for (const [key, value] of this.cache.entries()) {
      stats.entries.push({
        key,
        age: Date.now() - value.timestamp,
        valid: this.isCacheValid(value)
      });
    }

    return stats;
  }
}

// Create singleton instance
const dataService = new DataService();

// Preload data when service is created
dataService.preloadData();

export default dataService;
