// Landlord Dashboard API utility functions

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD 
    ? 'https://us-central1-pg-walebhaiya.cloudfunctions.net/api'
    : 'http://127.0.0.1:5001/pg-walebhaiya/us-central1/api');

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Landlord Authentication APIs
export const landlordAuth = {
  // Login landlord
  login: async (email, password) => {
    return apiCall('/landlord-login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Register new landlord
  register: async (landlordData) => {
    return apiCall('/landlord-register', {
      method: 'POST',
      body: JSON.stringify(landlordData),
    });
  },
};

// Landlord Dashboard APIs
export const landlordDashboard = {
  // Get dashboard stats
  getStats: async (landlordId) => {
    return apiCall(`/landlord/${landlordId}/dashboard`);
  },

  // Get landlord's PG listings
  getPGs: async (landlordId, filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);
    
    const queryString = queryParams.toString();
    const endpoint = `/landlord/${landlordId}/pgs${queryString ? `?${queryString}` : ''}`;
    
    return apiCall(endpoint);
  },

  // Get landlord's inquiries
  getInquiries: async (landlordId, filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);
    
    const queryString = queryParams.toString();
    const endpoint = `/landlord/${landlordId}/inquiries${queryString ? `?${queryString}` : ''}`;
    
    return apiCall(endpoint);
  },

  // Update landlord profile
  updateProfile: async (landlordId, profileData) => {
    return apiCall(`/landlord/${landlordId}/profile`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};

// PG Management APIs
export const pgManagement = {
  // Create new PG listing
  createPG: async (pgData) => {
    return apiCall('/pgs', {
      method: 'POST',
      body: JSON.stringify(pgData),
    });
  },

  // Update PG listing
  updatePG: async (pgId, pgData) => {
    return apiCall(`/pgs/${pgId}`, {
      method: 'PUT',
      body: JSON.stringify(pgData),
    });
  },

  // Delete PG listing
  deletePG: async (pgId) => {
    return apiCall(`/pgs/${pgId}`, {
      method: 'DELETE',
    });
  },

  // Get PG details
  getPG: async (pgId) => {
    return apiCall(`/pgs/${pgId}`);
  },

  // Get inquiries for a specific PG
  getPGInquiries: async (pgId, status = 'all') => {
    const endpoint = `/pgs/${pgId}/inquiries${status !== 'all' ? `?status=${status}` : ''}`;
    return apiCall(endpoint);
  },
};

// Inquiry Management APIs
export const inquiryManagement = {
  // Update inquiry status
  updateStatus: async (inquiryId, status) => {
    return apiCall(`/inquiries/${inquiryId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

// Utility APIs
export const utilityAPIs = {
  // Get available amenities
  getAmenities: async () => {
    return apiCall('/amenities');
  },

  // Health check
  healthCheck: async () => {
    return apiCall('/health');
  },
};

// Export default API client
const landlordApiClient = {
  auth: landlordAuth,
  dashboard: landlordDashboard,
  pg: pgManagement,
  inquiry: inquiryManagement,
  utils: utilityAPIs,
};

export default landlordApiClient;
