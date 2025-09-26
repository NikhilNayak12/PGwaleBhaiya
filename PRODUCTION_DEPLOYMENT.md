# Production Deployment Guide

## Prerequisites
1. Firebase CLI installed and logged in
2. Node.js 18+ installed
3. npm or yarn package manager
4. Production Firebase project set up

## Environment Setup

### 1. Configure Environment Variables
```bash
# Copy and configure production environment
cp .env.example .env.production
```

Edit `.env.production` with your production values:
- Firebase configuration
- API endpoints
- Analytics IDs
- Feature flags

### 2. Firebase Project Configuration
```bash
# Set up Firebase projects
firebase projects:list
firebase use --add  # Add production project
firebase use --add  # Add staging project (optional)
```

## Build and Deploy

### Option 1: Full Deployment (Recommended for first deploy)
```bash
npm run deploy:full
```

### Option 2: Separate Frontend and Backend
```bash
# Deploy backend functions first
npm run deploy:backend

# Then deploy frontend
npm run deploy:frontend
```

### Option 3: Staging Deployment
```bash
npm run deploy:staging
```

## Production Checklist

### Security
- [ ] All environment variables properly set
- [ ] JWT secrets are strong and unique
- [ ] Admin passwords changed from defaults
- [ ] Firebase security rules configured
- [ ] CORS settings properly configured
- [ ] Rate limiting enabled

### Performance
- [ ] Images optimized and properly sized
- [ ] Bundle size analyzed and optimized
- [ ] CDN configured for static assets
- [ ] Caching headers set correctly
- [ ] Database indexes created

### Monitoring
- [ ] Error tracking configured (Sentry, LogRocket, etc.)
- [ ] Analytics configured (Google Analytics, etc.)
- [ ] Performance monitoring enabled
- [ ] Logging configured for backend functions

### Functionality
- [ ] All API endpoints tested
- [ ] Email notifications working
- [ ] File uploads working
- [ ] Payment gateway integrated (if applicable)
- [ ] Search functionality optimized
- [ ] All forms validated properly

### SEO & Accessibility
- [ ] Meta tags configured
- [ ] Sitemap generated
- [ ] Robots.txt configured
- [ ] Alt texts for images
- [ ] ARIA labels for interactive elements
- [ ] Proper heading structure

## Post-Deployment

### 1. Verify Deployment
- [ ] Website loads correctly
- [ ] All pages accessible
- [ ] Forms submit successfully
- [ ] Search works
- [ ] Admin dashboard functional
- [ ] Landlord dashboard functional

### 2. Set up Monitoring
- [ ] Configure uptime monitoring
- [ ] Set up error alerts
- [ ] Monitor performance metrics
- [ ] Check database usage
- [ ] Monitor function execution

### 3. Update DNS (if using custom domain)
```bash
# Add custom domain in Firebase console
firebase hosting:channel:deploy production --expires 30d
```

## Maintenance Commands

### Update Dependencies
```bash
npm audit fix
npm update
```

### Database Backup
```bash
# Export Firestore data
gcloud firestore export gs://your-bucket/backups/$(date +%Y%m%d_%H%M%S)
```

### Monitor Performance
```bash
# Analyze bundle size
npm run analyze

# Check for security issues
npm audit
```

## Rollback Plan

### Quick Rollback
```bash
# Rollback to previous version
firebase hosting:clone production:previous production
```

### Database Rollback
```bash
# Restore from backup
gcloud firestore import gs://your-bucket/backups/BACKUP_TIMESTAMP
```

## Environment-Specific Configurations

### Production
- Optimized builds
- Error tracking enabled
- All features enabled
- Performance monitoring
- Analytics tracking

### Staging
- Source maps enabled
- Debug logs enabled
- Limited features for testing
- No analytics tracking

### Development
- Hot reload enabled
- Debug tools available
- Mock data available
- Local emulators

## Troubleshooting

### Common Issues
1. **Build Fails**: Check environment variables and dependencies
2. **Functions Don't Deploy**: Check Firebase functions quota and billing
3. **CORS Errors**: Update Firebase hosting.json configuration
4. **Slow Loading**: Optimize images and check bundle size
5. **Database Errors**: Check Firestore rules and indexes

### Debug Commands
```bash
# Check Firebase status
firebase --version
firebase projects:list

# Test functions locally
npm run start:backend

# Check build output
npm run build:prod
```

## Support

- Check Firebase Console for function logs
- Monitor Firestore usage and performance
- Review hosting analytics
- Check error tracking dashboard
- Monitor user feedback and support requests
