// Utility functions for the PG Wale Bhaiya backend

const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('./config');

// ============= VALIDATION UTILITIES =============

/**
 * Validate required fields in request data
 * @param {Object} data - Request body data
 * @param {Array} requiredFields - Array of required field names
 * @returns {Array} Array of missing field names
 */
const validateRequiredFields = (data, requiredFields) => {
  const missingFields = requiredFields.filter(field => 
    !data[field] || 
    (typeof data[field] === 'string' && data[field].trim() === '')
  );
  return missingFields;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Indian format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone
 */
const isValidPhone = (phone) => {
  const phoneRegex = /^[+]?[1-9][\d]{9,14}$/;
  return phoneRegex.test(phone.replace(/\s|-/g, ''));
};

/**
 * Validate price range
 * @param {number} price - Price to validate
 * @returns {boolean} True if valid price
 */
const isValidPrice = (price) => {
  const numPrice = Number(price);
  return numPrice >= config.MIN_PRICE && numPrice <= config.MAX_PRICE;
};

// ============= AUTHENTICATION UTILITIES =============

/**
 * Hash password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare password with hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} True if passwords match
 */
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

/**
 * Generate JWT token
 * @param {Object} payload - Token payload
 * @returns {string} JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRY });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded payload or null if invalid
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// ============= DATABASE UTILITIES =============

/**
 * Generate unique ID with timestamp
 * @returns {string} Unique ID
 */
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

/**
 * Convert Firestore timestamp to Date
 * @param {Object} timestamp - Firestore timestamp
 * @returns {Date} JavaScript Date object
 */
const timestampToDate = (timestamp) => {
  return timestamp?.toDate?.() || new Date();
};

/**
 * Sanitize data for Firestore (remove undefined values)
 * @param {Object} data - Data object
 * @returns {Object} Sanitized data
 */
const sanitizeData = (data) => {
  const sanitized = {};
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined) {
      sanitized[key] = data[key];
    }
  });
  return sanitized;
};

/**
 * Add pagination to Firestore query
 * @param {Object} query - Firestore query
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Object} Modified query
 */
const addPagination = (query, page = 1, limit = config.DEFAULT_PAGE_SIZE) => {
  const offset = (page - 1) * limit;
  return query.offset(offset).limit(Number(limit));
};

// ============= EMAIL UTILITIES =============

/**
 * Create nodemailer transporter
 * @returns {Object} Nodemailer transporter
 */
const createEmailTransporter = () => {
  return nodemailer.createTransporter(config.EMAIL_CONFIG);
};

/**
 * Send email notification
 * @param {Object} options - Email options
 * @returns {Promise<boolean>} True if email sent successfully
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createEmailTransporter();
    
    const mailOptions = {
      from: `PG Wale Bhaiya <${config.EMAIL_CONFIG.auth.user}>`,
      to,
      subject,
      html,
      text
    };
    
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

/**
 * Send new inquiry notification to landlord
 * @param {Object} inquiryData - Inquiry data
 * @returns {Promise<boolean>} Success status
 */
const sendInquiryNotification = async (inquiryData) => {
  const subject = `New Inquiry for ${inquiryData.pgTitle}`;
  
  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <h2 style="color: #2563eb;">New PG Inquiry - PG Wale Bhaiya</h2>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1e40af; margin-top: 0;">PG Details:</h3>
        <p><strong>Property:</strong> ${inquiryData.pgTitle}</p>
        <p><strong>Location:</strong> ${inquiryData.pgLocation}</p>
      </div>
      
      <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1e40af; margin-top: 0;">Inquirer Details:</h3>
        <p><strong>Name:</strong> ${inquiryData.inquirerName}</p>
        <p><strong>Phone:</strong> ${inquiryData.inquirerPhone}</p>
        ${inquiryData.inquirerEmail ? `<p><strong>Email:</strong> ${inquiryData.inquirerEmail}</p>` : ''}
        ${inquiryData.message ? `<p><strong>Message:</strong> ${inquiryData.message}</p>` : ''}
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <p>Contact the inquirer as soon as possible!</p>
        <a href="tel:${inquiryData.inquirerPhone}" 
           style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Call Now: ${inquiryData.inquirerPhone}
        </a>
      </div>
      
      <footer style="text-align: center; color: #64748b; font-size: 12px; margin-top: 40px;">
        <p>This notification was sent by PG Wale Bhaiya</p>
        <p>Best platform for PG listings near LPU</p>
      </footer>
    </div>
  `;
  
  const text = `
New inquiry for ${inquiryData.pgTitle}

Inquirer: ${inquiryData.inquirerName}
Phone: ${inquiryData.inquirerPhone}
${inquiryData.inquirerEmail ? `Email: ${inquiryData.inquirerEmail}` : ''}
${inquiryData.message ? `Message: ${inquiryData.message}` : ''}

Contact them as soon as possible!
  `;
  
  return await sendEmail({
    to: inquiryData.landlordEmail,
    subject,
    html,
    text
  });
};

/**
 * Send PG approval notification
 * @param {Object} pgData - PG listing data
 * @returns {Promise<boolean>} Success status
 */
const sendApprovalNotification = async (pgData) => {
  const subject = `Your PG listing has been approved! - ${pgData.title}`;
  
  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <h2 style="color: #10b981;">🎉 Congratulations! Your PG is now live!</h2>
      
      <div style="background: #ecfdf5; border: 1px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #065f46; margin-top: 0;">${pgData.title}</h3>
        <p><strong>Location:</strong> ${pgData.location}</p>
        <p><strong>Price:</strong> ₹${pgData.price}/month</p>
      </div>
      
      <p>Your PG listing has been approved and is now visible to thousands of students looking for accommodation near LPU!</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://pgwalebhaiya.com/pg/${pgData.id}" 
           style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View Your Listing
        </a>
      </div>
      
      <div style="background: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <h4 style="margin-top: 0; color: #1e40af;">What's Next?</h4>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>Students can now contact you directly</li>
          <li>You'll receive email notifications for new inquiries</li>
          <li>Keep your listing updated with current availability</li>
          <li>Respond to inquiries quickly to get more bookings</li>
        </ul>
      </div>
      
      <footer style="text-align: center; color: #64748b; font-size: 12px; margin-top: 40px;">
        <p>Thank you for choosing PG Wale Bhaiya!</p>
        <p>Happy hosting! 🏠</p>
      </footer>
    </div>
  `;
  
  return await sendEmail({
    to: pgData.email,
    subject,
    html,
    text: `Your PG listing "${pgData.title}" has been approved and is now live on PG Wale Bhaiya!`
  });
};

// ============= FILE UTILITIES =============

/**
 * Validate file upload
 * @param {Object} file - Multer file object
 * @returns {Object} Validation result
 */
const validateFileUpload = (file) => {
  const result = { isValid: true, message: '' };
  
  if (file.size > config.MAX_FILE_SIZE) {
    result.isValid = false;
    result.message = 'File size too large. Maximum 5MB allowed.';
    return result;
  }
  
  if (!config.ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    result.isValid = false;
    result.message = 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.';
    return result;
  }
  
  return result;
};

// ============= STRING UTILITIES =============

/**
 * Generate slug from string
 * @param {string} text - Text to convert to slug
 * @returns {string} URL-friendly slug
 */
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
const truncateText = (text, length = 100) => {
  if (text.length <= length) return text;
  return text.substr(0, length) + '...';
};

/**
 * Format currency for Indian rupees
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// ============= WHATSAPP UTILITIES =============

/**
 * Generate WhatsApp message for PG inquiry
 * @param {Object} pgData - PG data
 * @param {Object} inquirerData - Inquirer data
 * @returns {string} Formatted WhatsApp message
 */
const generateWhatsAppInquiry = (pgData, inquirerData) => {
  return `🏠 *PG Inquiry - PG Wale Bhaiya*

Hi! I'm interested in your PG listing:

📍 *${pgData.title}*
📍 Location: ${pgData.location}
💰 Rent: ₹${pgData.price}/month
🏠 Type: ${pgData.roomType}

👤 *My Details:*
Name: ${inquirerData.name}
Phone: ${inquirerData.phone}
${inquirerData.email ? `Email: ${inquirerData.email}` : ''}

${inquirerData.message ? `💬 *Message:* ${inquirerData.message}` : ''}

Please let me know about availability and other details.

---
*Via PG Wale Bhaiya Platform*`;
};

// ============= ERROR HANDLING =============

/**
 * Create standardized error response
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {string} code - Error code
 * @returns {Object} Error response object
 */
const createErrorResponse = (message, statusCode = 500, code = 'INTERNAL_ERROR') => {
  return {
    success: false,
    message,
    code,
    statusCode,
    timestamp: new Date().toISOString()
  };
};

/**
 * Create standardized success response
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @returns {Object} Success response object
 */
const createSuccessResponse = (data, message = 'Success') => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  // Validation
  validateRequiredFields,
  isValidEmail,
  isValidPhone,
  isValidPrice,
  
  // Authentication
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  
  // Database
  generateId,
  timestampToDate,
  sanitizeData,
  addPagination,
  
  // Email
  sendEmail,
  sendInquiryNotification,
  sendApprovalNotification,
  
  // File handling
  validateFileUpload,
  
  // String utilities
  generateSlug,
  truncateText,
  formatCurrency,
  
  // WhatsApp
  generateWhatsAppInquiry,
  
  // Response handling
  createErrorResponse,
  createSuccessResponse
};
