# 🔥 Firebase Configuration Fix

## The Problem
You're getting `auth/api-key-not-valid` because we're using placeholder Firebase config values instead of your actual project configuration.

## 🎯 Solution: Get Real Firebase Config

### Step 1: Open Firebase Console
1. Go to: https://console.firebase.google.com/project/pg-walebhaiya/settings/general
2. Scroll down to "Your apps" section
3. Look for your web app (or create one if it doesn't exist)

### Step 2: Get Configuration Values
Look for a section that shows something like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...", // This is your REAL API key
  authDomain: "pg-walebhaiya.firebaseapp.com",
  projectId: "pg-walebhaiya", 
  storageBucket: "pg-walebhaiya.appspot.com",
  messagingSenderId: "123456789", // Real number
  appId: "1:123456789:web:abc123def456" // Real app ID
};
```

### Step 3: Update Environment File
Replace the values in `.env.production` with your real values:

```bash
# Use the values from Firebase Console
VITE_FIREBASE_API_KEY=YOUR_REAL_API_KEY_HERE
VITE_FIREBASE_AUTH_DOMAIN=pg-walebhaiya.firebaseapp.com  
VITE_FIREBASE_PROJECT_ID=pg-walebhaiya
VITE_FIREBASE_STORAGE_BUCKET=pg-walebhaiya.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_REAL_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_REAL_APP_ID
```

### Step 4: Rebuild and Deploy
After updating the environment file:

```bash
npm run build
firebase deploy --only hosting
```

## 🚨 Alternative: If No Web App Exists

If you don't see a web app in Firebase Console:

1. Go to Project Settings → General
2. Scroll down to "Your apps"  
3. Click "Add app" → Web (</>) icon
4. Give it a name like "PG Wale Bhaiya Web"
5. Copy the configuration values
6. Update your environment file
7. Rebuild and deploy

## 🎯 Quick Test After Fix

Once you update the config and redeploy:
- Go to: https://pg-walebhaiya.web.app/admin/login
- Try logging in - the Firebase auth error should be gone
- You should be able to login with: hello.pgwalebhaiya@gmail.com / pgw@lebh@1y@@)@%

The "API endpoint not found" error was actually a Firebase auth configuration issue, not an API problem! 🎉
