# PG Wale Bhaiya - Backend API Documentation

This document describes all the APIs available for the PG Wale Bhaiya platform - a comprehensive PG listing system for students near LPU (Lovely Professional University).

## Base URL
```
Development: http://localhost:5001/YOUR_PROJECT_ID/us-central1/api
Production: https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/api
```

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format

All API responses follow this standard format:

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": {},
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "code": "ERROR_CODE",
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## API Endpoints

### 🏥 Health Check

#### GET /health
Check API health status.

**Response:**
```json
{
  "success": true,
  "message": "PG Wale Bhaiya API is running!",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

---

### 🔐 Authentication

#### POST /admin-login
Admin authentication endpoint.

**Request Body:**
```json
{
  "email": "admin@pgwalebhaiya.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin login successful!",
  "data": {
    "admin": {
      "email": "admin@pgwalebhaiya.com",
      "role": "admin"
    }
  }
}
```

---

### 🏠 PG Listings

#### GET /pgs
Get all PG listings with optional filtering and pagination.

**Query Parameters:**
- `status` (string): Filter by status (pending, approved, rejected)
- `location` (string): Filter by location
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `roomType` (string): Filter by room type
- `amenities` (string): Comma-separated amenities
- `featured` (boolean): Filter featured listings
- `page` (number, default: 1): Page number
- `limit` (number, default: 12): Items per page

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "pg123",
      "title": "Green Valley PG",
      "location": "Law Gate",
      "price": 8500,
      "roomType": "Single/Double",
      "featured": true,
      "status": "approved",
      "amenities": ["WiFi", "Parking", "Meals"],
      "images": ["/pgs/green-1.jpg"],
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 12
  }
}
```

#### GET /pgs/:id
Get single PG by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "pg123",
    "title": "Green Valley PG",
    "location": "Law Gate",
    "locality": "Near BB Mart",
    "price": 8500,
    "roomType": "Single/Double",
    "totalRooms": 20,
    "availableRooms": 5,
    "genderPreference": "Boys Only",
    "contactPerson": "John Doe",
    "phoneNumber": "+91 98765 43210",
    "email": "john@example.com",
    "amenities": ["WiFi", "Parking", "Meals"],
    "images": ["/pgs/green-1.jpg"],
    "views": 150,
    "inquiries": 12,
    "status": "approved",
    "featured": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### POST /pgs
Create a new PG listing.

**Request Body:**
```json
{
  "title": "Green Valley PG",
  "roomType": "Single/Double",
  "area": "Law Gate",
  "locality": "Near BB Mart",
  "fullAddress": "123 Law Gate, Phagwara",
  "monthlyRent": 8500,
  "totalRooms": 20,
  "availableRooms": 5,
  "genderPreference": "Boys Only",
  "contactPerson": "John Doe",
  "phoneNumber": "+91 98765 43210",
  "email": "john@example.com",
  "whatsappNumber": "+91 98765 43210",
  "amenities": ["WiFi", "Parking", "Meals"],
  "otherAmenities": "Study Room, Garden",
  "images": ["/pgs/green-1.jpg"]
}
```

#### PUT /pgs/:id
Update a PG listing. (Requires landlord/admin auth)

#### DELETE /pgs/:id
Delete a PG listing. (Requires admin auth)

#### PATCH /pgs/:id/status
Update PG status (approve/reject/feature). (Requires admin auth)

**Request Body:**
```json
{
  "status": "approved",
  "featured": true
}
```

#### POST /pgs/:id/view
Increment view count for a PG.

---

### 📞 Inquiries

#### POST /pgs/:id/inquire
Create an inquiry for a specific PG.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "phone": "+91 87654 32109",
  "email": "jane@example.com",
  "message": "Interested in this PG. Can I visit tomorrow?",
  "inquiryType": "general"
}
```

#### GET /pgs/:id/inquiries
Get all inquiries for a specific PG. (Requires landlord/admin auth)

**Query Parameters:**
- `status` (string): Filter by status (new, contacted, resolved)

#### GET /inquiries
Get all inquiries (admin only).

**Query Parameters:**
- `status` (string): Filter by status
- `page` (number): Page number
- `limit` (number): Items per page

#### PATCH /inquiries/:id/status
Update inquiry status.

**Request Body:**
```json
{
  "status": "contacted"
}
```

---

### 🏘️ Landlords

#### POST /landlord-login
Landlord authentication endpoint.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful!",
  "data": {
    "landlord": {
      "id": "landlord123",
      "email": "john@example.com",
      "name": "John Doe",
      "phone": "+91 98765 43210",
      "status": "verified"
    }
  }
}
```

#### POST /landlord-register
Register a new landlord account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 98765 43210",
  "password": "password123",
  "whatsapp": "+91 98765 43210",
  "address": "123 Main Street, Phagwara",
  "documentType": "Aadhaar",
  "documentNumber": "1234 5678 9012"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Landlord account created successfully! Please wait for verification.",
  "data": {
    "id": "landlord123",
    "name": "John Doe",
    "email": "john@example.com", 
    "phone": "+91 98765 43210",
    "status": "pending"
  }
}
```

#### GET /landlord/:landlordId/dashboard
Get landlord dashboard statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "pgStats": {
      "total": 5,
      "pending": 1,
      "approved": 3,
      "rejected": 1,
      "featured": 2
    },
    "totalViews": 1250,
    "totalInquiries": 45,
    "recentInquiries": [
      {
        "id": "inquiry123",
        "pgId": "pg123",
        "pgTitle": "Green Valley PG",
        "inquirerName": "Jane Smith",
        "inquirerPhone": "+91 87654 32109",
        "message": "Interested in this PG",
        "status": "new",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

#### GET /landlord/:landlordId/pgs
Get landlord's PG listings.

**Query Parameters:**
- `status` (string): Filter by status (pending, approved, rejected)
- `page` (number): Page number
- `limit` (number): Items per page

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "pg123",
      "title": "Green Valley PG",
      "location": "Law Gate",
      "price": 8500,
      "status": "approved",
      "views": 245,
      "inquiries": 12,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalItems": 5,
    "itemsPerPage": 12
  }
}
```

#### GET /landlord/:landlordId/inquiries
Get all inquiries for landlord's PGs.

**Query Parameters:**
- `status` (string): Filter by status (new, contacted, resolved)
- `page` (number): Page number  
- `limit` (number): Items per page

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "inquiry123",
      "pgId": "pg123",
      "pgTitle": "Green Valley PG",
      "pgLocation": "Law Gate",
      "inquirerName": "Jane Smith",
      "inquirerPhone": "+91 87654 32109",
      "inquirerEmail": "jane@example.com",
      "message": "Interested in this PG",
      "status": "new",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 45,
    "itemsPerPage": 20
  }
}
```

#### PUT /landlord/:landlordId/profile
Update landlord profile information.

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "+91 98765 43210",
  "whatsapp": "+91 98765 43210",
  "address": "123 Main Street, Phagwara",
  "documentType": "Aadhaar", 
  "documentNumber": "1234 5678 9012"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully!",
  "data": {
    "id": "landlord123",
    "name": "John Doe",
    "phone": "+91 98765 43210"
  }
}
```

#### POST /landlords
Create a new landlord account (Admin endpoint).

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 98765 43210",
  "whatsapp": "+91 98765 43210",
  "address": "123 Main Street, Phagwara",
  "documentType": "Aadhaar",
  "documentNumber": "1234 5678 9012"
}
```

#### GET /landlords
Get all landlords (for admin).

#### GET /landlords/:id
Get landlord details.

#### PATCH /landlords/:id/status
Update landlord status (admin only).

**Request Body:**
```json
{
  "status": "verified"
}
```

**Valid statuses:** `pending`, `verified`, `suspended`

---

### 📊 Dashboard & Analytics

#### GET /admin/dashboard
Get admin dashboard statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "pgStats": {
      "total": 150,
      "pending": 25,
      "approved": 120,
      "rejected": 5,
      "featured": 15
    },
    "landlordStats": {
      "total": 85,
      "verified": 70,
      "pending": 12,
      "suspended": 3
    },
    "inquiryStats": {
      "total": 450,
      "new": 50,
      "contacted": 200,
      "resolved": 200
    },
    "recentActivities": []
  }
}
```

---

### 🔍 Search

#### GET /search
Advanced search for PG listings.

**Query Parameters:**
- `query` (string): Text search in title, location, locality
- `location` (string): Location filter
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `roomType` (string): Room type filter
- `amenities` (string): Comma-separated amenities
- `page` (number): Page number
- `limit` (number): Items per page

---

### 🛠️ Utility

#### GET /amenities
Get list of available amenities.

**Response:**
```json
{
  "success": true,
  "data": [
    "WiFi", "AC", "TV", "Mess", "Parking", 
    "Washing Machine", "Power Backup", 
    "Refrigerator", "Security", "Geyser"
  ]
}
```

#### POST /contact
Submit contact form.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 98765 43210",
  "subject": "General Inquiry",
  "message": "I have a question about listing my PG."
}
```

---

## Status Codes

- `200 OK` - Success
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- General endpoints: 100 requests per 15 minutes
- Authentication endpoints: 5 requests per 15 minutes
- Search endpoints: 50 requests per 15 minutes

---

## Data Models

### PG Listing
```json
{
  "id": "string",
  "title": "string",
  "roomType": "string",
  "location": "string",
  "locality": "string",
  "fullAddress": "string",
  "distance": "string",
  "price": "number",
  "type": "string",
  "totalRooms": "number",
  "availableRooms": "number",
  "genderPreference": "string",
  "contactPerson": "string",
  "phoneNumber": "string",
  "email": "string",
  "whatsappNumber": "string",
  "amenities": "array",
  "otherAmenities": "string",
  "tags": "array",
  "images": "array",
  "featured": "boolean",
  "status": "string",
  "views": "number",
  "inquiries": "number",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Inquiry
```json
{
  "id": "string",
  "pgId": "string",
  "pgTitle": "string",
  "pgLocation": "string",
  "landlordEmail": "string",
  "landlordPhone": "string",
  "inquirerName": "string",
  "inquirerPhone": "string",
  "inquirerEmail": "string",
  "message": "string",
  "inquiryType": "string",
  "status": "string",
  "createdAt": "timestamp"
}
```

### Landlord
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "whatsapp": "string",
  "address": "string",
  "documentType": "string",
  "documentNumber": "string",
  "status": "string",
  "totalPGs": "number",
  "totalInquiries": "number",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

---

## Error Codes

- `NO_TOKEN` - Authentication token missing
- `INVALID_TOKEN` - Invalid authentication token
- `INVALID_ADMIN` - Admin access required
- `INVALID_LANDLORD` - Landlord access required
- `VALIDATION_ERROR` - Request validation failed
- `PG_NOT_FOUND` - PG listing not found
- `UNAUTHORIZED_PG_ACCESS` - Cannot access PG listing
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `ROUTE_NOT_FOUND` - API endpoint not found

---

## Environment Variables

Set these environment variables for production:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
JWT_SECRET=your-super-secure-jwt-secret
FIREBASE_PROJECT_ID=your-firebase-project-id
```

---

## Testing

Use tools like Postman, Insomnia, or curl to test the APIs.

Example curl command:
```bash
curl -X GET "http://localhost:5001/your-project/us-central1/api/health"
```

---

## Support

For API support or questions, contact:
- Email: support@pgwalebhaiya.com
- WhatsApp: +91 91092 22131

---

**Last Updated:** January 2025
**Version:** 1.0.0
