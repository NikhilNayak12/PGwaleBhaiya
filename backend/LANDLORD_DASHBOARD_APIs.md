# Landlord Dashboard APIs Documentation

This document provides detailed information about all the APIs created for the Landlord Dashboard functionality in the PG Wale Bhaiya platform.

## Base URL
```
Development: http://localhost:5001/YOUR_PROJECT_ID/us-central1/api
Production: https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/api
```

## Authentication

Most landlord endpoints require the landlord to be authenticated. Store the landlord ID from login response and use it in subsequent requests.

---

## 🔐 Authentication APIs

### POST /landlord-login
Authenticate a landlord and get their information.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success):**
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

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### POST /landlord-register
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

---

## 📊 Dashboard APIs

### GET /landlord/:landlordId/dashboard
Get comprehensive dashboard statistics for a landlord.

**URL Parameters:**
- `landlordId` (string, required): The landlord's unique ID

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
        "pgLocation": "Law Gate",
        "inquirerName": "Jane Smith",
        "inquirerPhone": "+91 87654 32109",
        "inquirerEmail": "jane@example.com",
        "message": "Interested in this PG",
        "status": "new",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

---

## 🏠 PG Management APIs

### GET /landlord/:landlordId/pgs
Get all PG listings for a specific landlord.

**URL Parameters:**
- `landlordId` (string, required): The landlord's unique ID

**Query Parameters:**
- `status` (string, optional): Filter by status (`pending`, `approved`, `rejected`, or `all`)
- `page` (number, optional, default: 1): Page number for pagination
- `limit` (number, optional, default: 12): Number of items per page

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "pg123",
      "title": "Green Valley PG",
      "location": "Law Gate",
      "locality": "Near BB Mart",
      "price": 8500,
      "roomType": "Single/Double",
      "totalRooms": 20,
      "availableRooms": 5,
      "status": "approved",
      "featured": false,
      "views": 245,
      "inquiries": 12,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
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

### POST /pgs (Enhanced)
Create a new PG listing. The original endpoint has been enhanced to support linking to landlords.

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
  "images": ["/pgs/green-1.jpg"],
  "landlordId": "landlord123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "PG listing created successfully!",
  "data": {
    "id": "pg123",
    "title": "Green Valley PG",
    "location": "Law Gate",
    "price": 8500,
    "status": "pending",
    "landlordId": "landlord123",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 📞 Inquiry Management APIs

### GET /landlord/:landlordId/inquiries
Get all inquiries for all PGs owned by a specific landlord.

**URL Parameters:**
- `landlordId` (string, required): The landlord's unique ID

**Query Parameters:**
- `status` (string, optional): Filter by status (`new`, `contacted`, `resolved`, or `all`)
- `page` (number, optional, default: 1): Page number for pagination
- `limit` (number, optional, default: 20): Number of items per page

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
      "landlordEmail": "john@example.com",
      "landlordPhone": "+91 98765 43210",
      "inquirerName": "Jane Smith",
      "inquirerPhone": "+91 87654 32109",
      "inquirerEmail": "jane@example.com",
      "message": "I am interested in this PG. Can I visit tomorrow?",
      "inquiryType": "general",
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

---

## 👤 Profile Management APIs

### PUT /landlord/:landlordId/profile
Update landlord profile information.

**URL Parameters:**
- `landlordId` (string, required): The landlord's unique ID

**Request Body (all fields optional):**
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

---

## 📈 Usage Examples

### JavaScript/React Integration

```javascript
import landlordApiClient from '../utils/landlordApi';

// Login landlord
const handleLogin = async (email, password) => {
  try {
    const response = await landlordApiClient.auth.login(email, password);
    const landlordId = response.data.landlord.id;
    localStorage.setItem('landlordId', landlordId);
    // Redirect to dashboard
  } catch (error) {
    console.error('Login failed:', error.message);
  }
};

// Get dashboard stats
const loadDashboard = async () => {
  const landlordId = localStorage.getItem('landlordId');
  try {
    const stats = await landlordApiClient.dashboard.getStats(landlordId);
    setDashboardData(stats.data);
  } catch (error) {
    console.error('Failed to load dashboard:', error.message);
  }
};

// Get PG listings with filters
const loadPGListings = async (status = 'all', page = 1) => {
  const landlordId = localStorage.getItem('landlordId');
  try {
    const response = await landlordApiClient.dashboard.getPGs(landlordId, {
      status,
      page,
      limit: 12
    });
    setPGListings(response.data);
    setPagination(response.pagination);
  } catch (error) {
    console.error('Failed to load PG listings:', error.message);
  }
};

// Create new PG
const createPG = async (pgData) => {
  const landlordId = localStorage.getItem('landlordId');
  try {
    const response = await landlordApiClient.pg.createPG({
      ...pgData,
      landlordId
    });
    console.log('PG created successfully:', response.data);
    // Refresh listings
    loadPGListings();
  } catch (error) {
    console.error('Failed to create PG:', error.message);
  }
};
```

### cURL Examples

```bash
# Login landlord
curl -X POST http://localhost:5001/your-project/us-central1/api/landlord-login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Get dashboard stats
curl -X GET http://localhost:5001/your-project/us-central1/api/landlord/landlord123/dashboard

# Get landlord's PGs with filters
curl -X GET "http://localhost:5001/your-project/us-central1/api/landlord/landlord123/pgs?status=approved&page=1&limit=5"

# Create new PG listing
curl -X POST http://localhost:5001/your-project/us-central1/api/pgs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Green Valley PG",
    "roomType": "Single/Double",
    "area": "Law Gate",
    "locality": "Near BB Mart",
    "monthlyRent": 8500,
    "availableRooms": 5,
    "genderPreference": "Boys Only",
    "contactPerson": "John Doe",
    "phoneNumber": "+91 98765 43210",
    "email": "john@example.com",
    "landlordId": "landlord123"
  }'
```

---

## 🔒 Security Notes

1. **Password Security**: In production, implement proper password hashing (bcrypt, scrypt, etc.)
2. **Authentication**: Consider implementing JWT tokens for session management
3. **Input Validation**: All inputs are validated server-side
4. **Rate Limiting**: APIs include rate limiting to prevent abuse
5. **Data Access**: Landlords can only access their own data (except admin endpoints)

---

## 🐛 Error Handling

All APIs return consistent error responses:

```json
{
  "success": false,
  "message": "Descriptive error message",
  "code": "ERROR_CODE" // Optional
}
```

Common error codes:
- `VALIDATION_ERROR`: Missing or invalid request data
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `DUPLICATE_ENTRY`: Resource already exists

---

## 📊 Status Values

### PG Status
- `pending`: Awaiting admin approval
- `approved`: Live and visible to users
- `rejected`: Declined by admin

### Landlord Status
- `pending`: Awaiting verification
- `verified`: Account verified and active
- `suspended`: Account suspended

### Inquiry Status
- `new`: Fresh inquiry, not yet contacted
- `contacted`: Landlord has contacted inquirer
- `resolved`: Inquiry resolved/closed

---

## 🚀 Getting Started

1. **Start the backend server**
2. **Test the health endpoint**: `GET /health`
3. **Register a landlord**: `POST /landlord-register`
4. **Login**: `POST /landlord-login`
5. **Create a PG**: `POST /pgs` (with landlordId)
6. **View dashboard**: `GET /landlord/:landlordId/dashboard`

---

**Last Updated:** January 2025  
**Version:** 1.0.0
