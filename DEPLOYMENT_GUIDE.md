# PG Wale Bhaiya - Deployment Guide

This guide walks you through deploying both the frontend and backend of the PG Wale Bhaiya application.

## 🚀 Quick Deploy (Full Stack)

For a complete deployment of both frontend and backend:

```bash
# Install dependencies
npm install
cd backend/functions && npm install && cd ../..

# Deploy everything
npm run deploy:full
```

## 📋 Pre-Deployment Checklist

### 1. Firebase Project Setup
- Ensure you have a Firebase project created
- Update the project ID in `.firebaserc` (if exists) or initialize:
  ```bash
  firebase login
  firebase init
  ```

### 2. Environment Configuration
- Review and update `.env.production` with your production values
- Ensure all API endpoints are correctly configured
- Update Firebase project ID in environment files

### 3. Backend Dependencies
- Make sure all Node.js dependencies are installed:
  ```bash
  cd backend/functions
  npm install
  ```

## 🔧 Backend Deployment

### Deploy Functions Only
```bash
npm run deploy:backend
```

### Manual Backend Deployment
```bash
cd backend
firebase deploy --only functions
```

### Test Backend After Deployment
```bash
# Test the deployed API
curl https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/api/health
```

## 🌐 Frontend Deployment

### Deploy Frontend Only
```bash
npm run deploy:frontend
```

### Manual Frontend Deployment
```bash
# Build for production
npm run build:prod

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

## 📊 Post-Deployment Verification

### 1. Test Backend APIs
```bash
# Run API tests
npm run test:api
```

### 2. Verify Frontend
- Visit your deployed URL
- Test all major features:
  - Home page loads correctly
  - PG listings display from API
  - Admin dashboard works
  - Contact forms submit properly

### 3. Check Firebase Console
- Functions are deployed and healthy
- Hosting is active
- No errors in logs

## 🔄 Development Workflow

### Local Development
```bash
# Terminal 1: Start backend
npm run start:backend

# Terminal 2: Start frontend
npm run dev
```

### Building for Production
```bash
# Development build (with dev API URLs)
npm run build:dev

# Production build (with production API URLs)
npm run build:prod
```

## 📁 Project Structure After Deployment

```
pg-wale-bhaiya/
├── dist/                     # Built frontend (created after build)
├── src/                      # React frontend source
├── backend/
│   ├── functions/           # Firebase Functions
│   └── firebase.json        # Functions config
├── firebase.json            # Main Firebase config
├── .env.production          # Production environment
├── .env.development         # Development environment
└── package.json             # Main package.json
```

## 🛠️ Custom Domain Setup (Optional)

### 1. Add Custom Domain
```bash
firebase hosting:channel:deploy main --add-domain your-domain.com
```

### 2. SSL Configuration
Firebase automatically provides SSL certificates for custom domains.

### 3. Update Environment Variables
Update `.env.production` with your custom domain:
```bash
VITE_APP_URL=https://your-domain.com
```

## 🔍 Troubleshooting

### Common Issues

#### 1. "Firebase project not found"
```bash
firebase use --add
# Select your project
```

#### 2. "Functions region mismatch"
Ensure your environment variables match:
```bash
VITE_FIREBASE_REGION=us-central1
```

#### 3. "API calls failing in production"
Check your production API URL:
```bash
VITE_API_BASE_URL=https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/api
```

#### 4. "CORS issues"
Backend includes CORS configuration. If issues persist, check the Firebase Functions logs.

### Debug Commands
```bash
# View function logs
firebase functions:log

# View hosting logs
firebase hosting:channel:list

# Check build output
npm run build:prod -- --debug
```

## 🚀 Production Optimizations

### Frontend Optimizations
- Code splitting implemented
- Assets are cached for 1 year
- Gzip compression enabled
- Service worker for offline support

### Backend Optimizations
- Function cold start minimized
- Database queries optimized
- Rate limiting enabled
- Error handling implemented

## 📱 PWA Features

The application includes Progressive Web App features:
- Offline functionality
- Add to home screen
- Push notifications (configurable)

To enable PWA features, ensure `VITE_PWA_ENABLED=true` in production.

## 🔐 Security Considerations

### Production Security Checklist
- [ ] Updated admin credentials
- [ ] Environment variables secured
- [ ] Rate limiting configured
- [ ] HTTPS enabled
- [ ] API keys secured
- [ ] Input validation enabled

### Environment Security
```bash
# Never commit these files
.env.local
.env.production.local
.firebaserc (if contains sensitive data)
```

## 📈 Monitoring & Analytics

### Firebase Analytics
Enable Analytics in your Firebase console for user insights.

### Error Monitoring
Consider adding error monitoring:
- Sentry for frontend errors
- Firebase Crashlytics for mobile
- Function logs for backend errors

## 🔄 CI/CD Setup (Optional)

### GitHub Actions Example
```yaml
name: Deploy to Firebase
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Firebase
        run: |
          npm install
          npm run deploy:full
```

## 📞 Support

For deployment issues:
1. Check Firebase console logs
2. Verify environment configuration
3. Test locally before deploying
4. Review this guide for common solutions

## 🎉 Success!

After successful deployment:
- Your PG Wale Bhaiya application is live
- Users can search and book PGs
- Landlords can manage listings
- Admins can oversee the platform

**Your application is ready to serve thousands of students looking for PGs near LPU!** 🏠✨
