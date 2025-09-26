# PG Wale Bhaiya - Deployment Guide

This guide will help you deploy the PG Wale Bhaiya application to production.

## 📋 Prerequisites

Before deploying, make sure you have:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Firebase CLI](https://firebase.google.com/docs/cli) installed globally
- Firebase project created and configured
- Domain configured (if using custom domain)

## 🛠️ Setup

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend/functions
npm install
cd ../..
```

### 2. Firebase Configuration

```bash
# Login to Firebase
firebase login

# Initialize Firebase project (if not already done)
firebase init

# Set your project ID
firebase use your-project-id
```

### 3. Environment Variables

Make sure your environment files are configured:

- `.env.development` - For development
- `.env.production` - For production
- `.env.local` - For local overrides (gitignored)

## 🚀 Deployment Options

### Option 1: Full Deployment (Frontend + Backend)

```bash
# Build and deploy everything
npm run deploy:full
```

### Option 2: Deploy Frontend Only

```bash
# Build and deploy just the frontend
npm run deploy:frontend
```

### Option 3: Deploy Backend Only

```bash
# Deploy just the backend functions
npm run deploy:backend
```

### Option 4: Manual Step-by-Step

```bash
# 1. Build the frontend
npm run build:prod

# 2. Deploy frontend
firebase deploy --only hosting

# 3. Deploy backend
cd backend
firebase deploy --only functions
```

## 🔧 Development Workflow

### Local Development

```bash
# Start backend emulator
npm run start:backend

# In another terminal, start frontend
npm run dev

# Or start both together (if you have concurrently installed)
npm run start:full
```

### Testing

```bash
# Test API endpoints
npm run test:api

# Run frontend build test
npm run build:dev
```

## 🌍 Production URLs

After deployment, your application will be available at:

- **Frontend**: `https://your-project-id.web.app` or `https://your-project-id.firebaseapp.com`
- **Backend API**: `https://us-central1-your-project-id.cloudfunctions.net/api`

## ⚙️ Configuration

### Environment Variables

Update these in your `.env.production` file:

```bash
VITE_API_BASE_URL=https://us-central1-your-project-id.cloudfunctions.net/api
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_ADMIN_EMAIL=your-admin@email.com
VITE_WHATSAPP_NUMBER=your-whatsapp-number
```

### Backend Configuration

Update `backend/functions/config.js`:

```javascript
// Update admin credentials
DEFAULT_ADMIN_EMAIL: 'your-admin@email.com',
DEFAULT_ADMIN_PASSWORD: 'your-secure-password',

// Update JWT secret
JWT_SECRET: 'your-super-secure-jwt-secret-key',

// Update email configuration
EMAIL_CONFIG: {
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
}
```

## 📱 Custom Domain (Optional)

To use a custom domain:

1. Add your domain in Firebase Console > Hosting
2. Follow the DNS configuration steps
3. Update CORS settings in backend if needed

```bash
# Deploy with custom domain
firebase deploy --only hosting
```

## 🔒 Security Checklist

- [ ] Change default admin credentials
- [ ] Update JWT secret key
- [ ] Configure CORS properly
- [ ] Set up HTTPS (automatic with Firebase)
- [ ] Configure Firestore security rules
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Errors
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 2. Function Deployment Fails
```bash
# Check function logs
firebase functions:log

# Deploy with debug info
firebase deploy --only functions --debug
```

#### 3. API Connection Issues
- Check if backend is deployed
- Verify API URL in environment variables
- Check CORS configuration

#### 4. Hosting Issues
```bash
# Clear hosting cache
firebase hosting:clone source-site-id target-site-id

# Check hosting logs
firebase hosting:sites:list
```

### Getting Help

- Check [Firebase Documentation](https://firebase.google.com/docs)
- Review function logs: `firebase functions:log`
- Check browser console for frontend errors
- Verify network requests in browser dev tools

## 📊 Monitoring

After deployment, monitor:

- Function performance in Firebase Console
- Error rates and logs
- User analytics (if configured)
- Database usage and costs

## 🔄 Updates

To update the application:

```bash
# 1. Pull latest changes
git pull origin main

# 2. Install any new dependencies
npm install
cd backend/functions && npm install && cd ../..

# 3. Deploy updates
npm run deploy:full
```

## 🏆 Production Best Practices

1. **Environment Management**: Keep production secrets secure
2. **Monitoring**: Set up alerts for errors and performance
3. **Backups**: Regular Firestore backups
4. **Testing**: Test in staging before production
5. **Documentation**: Keep this guide updated
6. **Security**: Regular security audits
7. **Performance**: Monitor and optimize bundle size
8. **SEO**: Configure meta tags and sitemap

---

🎉 **Your PG Wale Bhaiya application is now ready for production!**

For support, contact the development team or check the project repository for issues and updates.
