# PG Wale Bhaiya Backend - Startup Guide

## Getting Started

### 1. Install Dependencies
```bash
cd backend/functions
npm install
```

### 2. Start the Firebase Emulator
```bash
cd backend
firebase emulators:start --only functions
```

The API will be available at: `http://127.0.0.1:5001/pg-walebhaiya/us-central1/api`

### 3. Test the API

#### Health Check
```bash
GET http://127.0.0.1:5001/pg-walebhaiya/us-central1/api/health
```

Expected Response:
```json
{
  "success": true,
  "message": "PG Wale Bhaiya API is running!",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

#### Get Available Amenities
```bash
GET http://127.0.0.1:5001/pg-walebhaiya/us-central1/api/amenities
```

#### Admin Login
```bash
POST http://127.0.0.1:5001/pg-walebhaiya/us-central1/api/admin-login
Content-Type: application/json

{
  "email": "admin@pgwalebhaiya.com",
  "password": "admin123"
}
```

### 4. Frontend Integration

Update your frontend API base URL to:
```javascript
const API_BASE_URL = 'http://127.0.0.1:5001/pg-walebhaiya/us-central1/api';
```

## Available API Endpoints

### Public Endpoints (No Auth Required)
- `GET /health` - Health check
- `GET /pgs` - List all approved PGs
- `GET /pgs/:id` - Get single PG details
- `POST /pgs/:id/view` - Increment view count
- `POST /pgs/:id/inquire` - Submit inquiry
- `GET /search` - Search PGs
- `GET /amenities` - Get available amenities
- `POST /contact` - Submit contact form
- `POST /pgs` - Create new PG listing

### Admin Endpoints (Auth Required)
- `POST /admin-login` - Admin login
- `PATCH /pgs/:id/status` - Approve/reject PG listings
- `GET /admin/dashboard` - Dashboard stats
- `GET /inquiries` - All inquiries
- `GET /landlords` - All landlords

### Landlord Endpoints (Auth Required)
- `GET /pgs/:id/inquiries` - Get inquiries for specific PG
- `PUT /pgs/:id` - Update PG listing
- `DELETE /pgs/:id` - Delete PG listing

## Database Collections

The API uses the following Firestore collections:
- `pgs` - PG listings
- `inquiries` - Inquiry submissions
- `landlords` - Landlord accounts
- `admins` - Admin accounts
- `contacts` - Contact form submissions

## Production Deployment

1. Deploy to Firebase:
```bash
firebase deploy --only functions
```

2. Update frontend API URL to production:
```javascript
const API_BASE_URL = 'https://us-central1-pg-walebhaiya.cloudfunctions.net/api';
```

## Environment Variables for Production

Set these in Firebase Functions config:
```bash
firebase functions:config:set email.user="your-email@gmail.com"
firebase functions:config:set email.pass="your-app-password"
firebase functions:config:set jwt.secret="your-jwt-secret"
```

## Testing with Postman/Insomnia

Import the following collection to test all endpoints:

```json
{
  "info": {
    "name": "PG Wale Bhaiya API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "http://127.0.0.1:5001/pg-walebhaiya/us-central1/api/health"
      }
    },
    {
      "name": "Get All PGs",
      "request": {
        "method": "GET",
        "url": "http://127.0.0.1:5001/pg-walebhaiya/us-central1/api/pgs"
      }
    },
    {
      "name": "Create PG",
      "request": {
        "method": "POST",
        "url": "http://127.0.0.1:5001/pg-walebhaiya/us-central1/api/pgs",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"Test PG\",\n  \"roomType\": \"Single\",\n  \"area\": \"Law Gate\",\n  \"locality\": \"Near BB Mart\",\n  \"monthlyRent\": 8500,\n  \"availableRooms\": 3,\n  \"genderPreference\": \"Boys Only\",\n  \"contactPerson\": \"John Doe\",\n  \"phoneNumber\": \"+91 98765 43210\",\n  \"email\": \"john@example.com\",\n  \"amenities\": [\"WiFi\", \"Parking\"]\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        }
      }
    }
  ]
}
```

## Troubleshooting

### Port Already in Use
If port 5001 is already in use:
```bash
# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5001 | xargs kill
```

### Firebase Project Not Found
Make sure you're in the correct directory with firebase.json and run:
```bash
firebase login
firebase use --add
```

### Function Not Loading
Check the Firebase Functions logs:
```bash
firebase functions:log
```

## Next Steps

1. Start the emulator and test all endpoints
2. Integrate with your frontend application
3. Set up proper authentication (JWT tokens)
4. Add file upload functionality for PG images
5. Set up email notifications for inquiries
6. Deploy to production when ready

Happy coding! 🚀
