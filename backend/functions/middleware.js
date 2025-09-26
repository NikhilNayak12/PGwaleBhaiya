// Middleware functions for the PG Wale Bhaiya backend

const admin = require('firebase-admin');
const utils = require('./utils');
const config = require('./config');

// ============= AUTHENTICATION MIDDLEWARE =============

/**
 * Middleware to verify admin authentication
 */
const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token
    
    if (!token) {
      return res.status(401).json(utils.createErrorResponse(
        'Authentication token required',
        401,
        'NO_TOKEN'
      ));
    }
    
    const decoded = utils.verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return res.status(403).json(utils.createErrorResponse(
        'Admin access required',
        403,
        'INVALID_ADMIN'
      ));
    }
    
    // Add admin info to request
    req.admin = decoded;
    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    return res.status(401).json(utils.createErrorResponse(
      'Invalid authentication token',
      401,
      'INVALID_TOKEN'
    ));
  }
};

/**
 * Middleware to verify landlord authentication
 */
const verifyLandlord = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json(utils.createErrorResponse(
        'Authentication token required',
        401,
        'NO_TOKEN'
      ));
    }
    
    const decoded = utils.verifyToken(token);
    if (!decoded || (decoded.role !== 'landlord' && decoded.role !== 'admin')) {
      return res.status(403).json(utils.createErrorResponse(
        'Landlord access required',
        403,
        'INVALID_LANDLORD'
      ));
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Landlord verification error:', error);
    return res.status(401).json(utils.createErrorResponse(
      'Invalid authentication token',
      401,
      'INVALID_TOKEN'
    ));
  }
};

/**
 * Optional authentication middleware (allows both authenticated and unauthenticated requests)
 */
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      const decoded = utils.verifyToken(token);
      if (decoded) {
        req.user = decoded;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// ============= VALIDATION MIDDLEWARE =============

/**
 * Middleware to validate request body against schema
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const message = error.details[0].message;
      return res.status(400).json(utils.createErrorResponse(
        `Validation error: ${message}`,
        400,
        'VALIDATION_ERROR'
      ));
    }
    
    next();
  };
};

/**
 * Middleware to validate pagination parameters
 */
const validatePagination = (req, res, next) => {
  const { page, limit } = req.query;
  
  // Set defaults
  req.pagination = {
    page: Math.max(1, parseInt(page) || 1),
    limit: Math.min(config.MAX_PAGE_SIZE, Math.max(1, parseInt(limit) || config.DEFAULT_PAGE_SIZE))
  };
  
  next();
};

/**
 * Middleware to validate PG ID parameter
 */
const validatePGId = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json(utils.createErrorResponse(
        'PG ID is required',
        400,
        'MISSING_PG_ID'
      ));
    }
    
    // Check if PG exists
    const db = admin.firestore();
    const doc = await db.collection('pgs').doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json(utils.createErrorResponse(
        'PG not found',
        404,
        'PG_NOT_FOUND'
      ));
    }
    
    // Add PG data to request
    req.pg = { id: doc.id, ...doc.data() };
    next();
  } catch (error) {
    console.error('PG validation error:', error);
    return res.status(500).json(utils.createErrorResponse(
      'Error validating PG',
      500,
      'PG_VALIDATION_ERROR'
    ));
  }
};

/**
 * Middleware to validate landlord ownership of PG
 */
const validatePGOwnership = (req, res, next) => {
  try {
    // Admin can access any PG
    if (req.user.role === 'admin') {
      return next();
    }
    
    // Check if landlord owns this PG
    if (req.pg.email !== req.user.email) {
      return res.status(403).json(utils.createErrorResponse(
        'You can only access your own PG listings',
        403,
        'UNAUTHORIZED_PG_ACCESS'
      ));
    }
    
    next();
  } catch (error) {
    console.error('PG ownership validation error:', error);
    return res.status(500).json(utils.createErrorResponse(
      'Error validating PG ownership',
      500,
      'OWNERSHIP_VALIDATION_ERROR'
    ));
  }
};

// ============= RATE LIMITING MIDDLEWARE =============

/**
 * Simple in-memory rate limiter
 */
const rateLimitStore = new Map();

const rateLimit = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100, // 100 requests per window
    message = 'Too many requests, please try again later.'
  } = options;
  
  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    // Clean up expired entries
    for (const [ip, data] of rateLimitStore.entries()) {
      if (now - data.resetTime > windowMs) {
        rateLimitStore.delete(ip);
      }
    }
    
    const clientData = rateLimitStore.get(key) || {
      count: 0,
      resetTime: now + windowMs
    };
    
    if (now > clientData.resetTime) {
      // Reset the count and time
      clientData.count = 1;
      clientData.resetTime = now + windowMs;
    } else {
      clientData.count++;
    }
    
    rateLimitStore.set(key, clientData);
    
    if (clientData.count > max) {
      return res.status(429).json(utils.createErrorResponse(
        message,
        429,
        'RATE_LIMIT_EXCEEDED'
      ));
    }
    
    // Add rate limit headers
    res.set({
      'X-RateLimit-Limit': max,
      'X-RateLimit-Remaining': Math.max(0, max - clientData.count),
      'X-RateLimit-Reset': new Date(clientData.resetTime).toISOString()
    });
    
    next();
  };
};

// ============= LOGGING MIDDLEWARE =============

/**
 * Request logging middleware
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method, url, ip } = req;
  const userAgent = req.headers['user-agent'] || 'Unknown';
  
  // Log request
  console.log(`[${new Date().toISOString()}] ${method} ${url} - ${ip} - ${userAgent}`);
  
  // Log response when it finishes
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${method} ${url} - ${res.statusCode} - ${duration}ms`);
    
    // Call original send
    originalSend.call(this, data);
  };
  
  next();
};

// ============= ERROR HANDLING MIDDLEWARE =============

/**
 * Global error handler
 */
const errorHandler = (error, req, res, next) => {
  console.error('Unhandled error:', error);
  
  // Default error response
  let statusCode = 500;
  let message = 'Internal server error';
  let code = 'INTERNAL_ERROR';
  
  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = error.message;
    code = 'VALIDATION_ERROR';
  } else if (error.code === 'permission-denied') {
    statusCode = 403;
    message = 'Permission denied';
    code = 'PERMISSION_DENIED';
  } else if (error.code === 'not-found') {
    statusCode = 404;
    message = 'Resource not found';
    code = 'NOT_FOUND';
  }
  
  res.status(statusCode).json(utils.createErrorResponse(message, statusCode, code));
};

/**
 * 404 handler for undefined routes
 */
const notFoundHandler = (req, res) => {
  res.status(404).json(utils.createErrorResponse(
    `Route ${req.method} ${req.path} not found`,
    404,
    'ROUTE_NOT_FOUND'
  ));
};

// ============= CORS MIDDLEWARE =============

/**
 * Custom CORS configuration
 */
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // Allow localhost for development
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Allow your production domains
    const allowedOrigins = [
      'https://pgwalebhaiya.com',
      'https://www.pgwalebhaiya.com',
      'https://pg-wale-bhaiya.vercel.app',
      'https://pg-wale-bhaiya.netlify.app'
    ];
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// ============= SECURITY MIDDLEWARE =============

/**
 * Basic security headers
 */
const securityHeaders = (req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  });
  
  next();
};

/**
 * Content sanitization middleware
 */
const sanitizeInput = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    const sanitize = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          // Remove potential XSS scripts
          obj[key] = obj[key]
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+="[^"]*"/gi, '')
            .trim();
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitize(obj[key]);
        }
      }
    };
    
    sanitize(req.body);
  }
  
  next();
};

module.exports = {
  // Authentication
  verifyAdmin,
  verifyLandlord,
  optionalAuth,
  
  // Validation
  validateRequest,
  validatePagination,
  validatePGId,
  validatePGOwnership,
  
  // Rate limiting
  rateLimit,
  
  // Logging
  requestLogger,
  
  // Error handling
  errorHandler,
  notFoundHandler,
  
  // Security
  corsOptions,
  securityHeaders,
  sanitizeInput
};
