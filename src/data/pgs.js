// src/data/pgs.js
// Production-ready PG data service
import DataService from '../services/DataService.js';

// Main function to get PGs (uses DataService with caching and fallback)
export const getPGs = async (params = {}) => {
  const result = await DataService.getPGs(params);
  return result.data;
};

// Get PGs with full result information (for error handling)
export const getPGsWithStatus = async (params = {}) => {
  return await DataService.getPGs(params);
};

// Export empty fallback (all dummy data removed)
export const fallbackPGs = [];

// Export fallback for backward compatibility
export const pgs = fallbackPGs;

export default { getPGs, getPGsWithStatus, fallbackPGs };
