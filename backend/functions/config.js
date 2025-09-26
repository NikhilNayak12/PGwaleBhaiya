// Configuration file for the PG Wale Bhaiya backend

const config = {
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Admin credentials
  DEFAULT_ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'hello.pgwalebhaiya@gmail.com',
  DEFAULT_ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'pgw@lebh@1y@@)@%',
  
  // JWT Secret (change this in production)
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secure-jwt-secret-key-2024',
  JWT_EXPIRY: '7d',
  
  // Email configuration
  EMAIL_CONFIG: {
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'hello.pgwalebhaiya@gmail.com',
      pass: process.env.EMAIL_PASS || 'ockz xooo mckc ibyf'
    }
  },
  
  // WhatsApp Business API
  WHATSAPP_BUSINESS_NUMBER: process.env.WHATSAPP_NUMBER || '919109222131',
  
  // File upload limits
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
  MAX_FILES_PER_PG: 10,
  
  // Pagination defaults
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
  
  // PG listing validation
  MIN_PRICE: 1000,
  MAX_PRICE: 100000,
  MIN_ROOMS: 1,
  MAX_ROOMS: 100,
  
  // Security settings
  PASSWORD_SALT_ROUNDS: 10,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_TIME: 15 * 60 * 1000, // 15 minutes
  
  // Rate limiting
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,
  
  // Database settings
  FIRESTORE_SETTINGS: {
    ignoreUndefinedProperties: true
  },
  
  // Status constants
  PG_STATUS: {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    SOLD: 'sold',
    DRAFT: 'draft'
  },
  
  INQUIRY_STATUS: {
    NEW: 'new',
    CONTACTED: 'contacted',
    RESOLVED: 'resolved',
    CANCELLED: 'cancelled'
  },
  
  LANDLORD_STATUS: {
    PENDING: 'pending',
    VERIFIED: 'verified',
    SUSPENDED: 'suspended',
    REJECTED: 'rejected'
  },
  
  // Available amenities (production-ready list)
  AMENITIES: [
    'WiFi', 'AC', 'TV', 'Mess', 'Parking', 
    'Washing Machine', 'Power Backup', 
    'Refrigerator', 'Security', 'Geyser',
    'Gym', 'Laundry', 'Study Room', 'Garden',
    'Swimming Pool', 'CCTV', '24/7 Water',
    'Housekeeping', 'Medical Facility', 'Recreation Room',
    'Balcony', 'Furnished', 'Semi-Furnished',
    'Wardrobe', 'Bed', 'Mattress', 'Fan',
    'Light', 'Plug Points', 'Intercom'
  ],
  
  // Room types
  ROOM_TYPES: [
    '1 BHK', '2 BHK', '3 BHK', 'Single', 'Double', 'Triple',
    'Sharing', 'Private', 'Studio'
  ],
  
  // Gender preferences
  GENDER_PREFERENCES: [
    'Boys Only', 'Girls Only', 'Both', 'Co-ed'
  ],
  
  // Location/Areas around LPU (expanded list)
  POPULAR_AREAS: [
    'Law Gate', 'Phagwara', 'Deep Nagar', 'Green Avenue',
    'Model Town', 'Urban Estate', 'Civil Lines', 'Banga Road',
    'GT Road', 'Railway Station Area', 'Bus Stand Area',
    'College Road', 'Main Market', 'New Colony',
    'Old City', 'Industrial Area', 'Residential Area'
  ],
  
  // Document types for landlord verification
  DOCUMENT_TYPES: [
    'Aadhaar Card',
    'PAN Card',
    'Voter ID',
    'Driving License',
    'Property Papers'
  ],
  
  // Business rules
  BUSINESS_RULES: {
    MIN_ADVANCE_AMOUNT: 1000,
    MAX_ADVANCE_MONTHS: 12,
    DEFAULT_INQUIRY_EXPIRY_DAYS: 30,
    PG_APPROVAL_TIMEOUT_HOURS: 48,
    MAX_IMAGES_PER_PG: 15,
    MIN_IMAGES_PER_PG: 3
  },
  
  // Feature flags
  FEATURES: {
    EMAIL_NOTIFICATIONS: process.env.NODE_ENV === 'production',
    SMS_NOTIFICATIONS: process.env.NODE_ENV === 'production',
    PUSH_NOTIFICATIONS: process.env.NODE_ENV === 'production',
    AUTO_APPROVAL: false,
    PAYMENT_GATEWAY: process.env.NODE_ENV === 'production',
    ANALYTICS: process.env.NODE_ENV === 'production'
  }
};

module.exports = config;
