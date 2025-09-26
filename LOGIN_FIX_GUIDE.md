# 🚀 Quick Admin Setup Guide

## The Login Error: "Login failed. Please try again."

**Root Cause**: The Cloud Run service (our API) is not publicly accessible, so the frontend can't communicate with the backend.

## 🎯 **Solution: Manual Admin Setup (Recommended)**

### Step 1: Create Admin User in Firebase Console
1. 🌐 Go to: https://console.firebase.google.com/project/pg-walebhaiya/authentication/users
2. 👤 Click "Add user" 
3. ✏️ Enter:
   - **Email**: `hello.pgwalebhaiya@gmail.com`
   - **Password**: `pgw@lebh@1y@@)@%`
4. ✅ Click "Add user"

### Step 2: Make API Publicly Accessible
1. 🌐 Go to: https://console.cloud.google.com/run?project=pg-walebhaiya
2. 🔍 Find and click on the `api` service
3. 🔒 Click the "Security" tab
4. 👥 Under "Authentication", click "Allow unauthenticated invocations"
5. ✅ Click "Save"

**Alternative via Permissions:**
1. Click "Permissions" tab instead
2. Click "Add Principal"
3. Add `allUsers` 
4. Select role: `Cloud Run Invoker`
5. Save

### Step 3: Set Admin Claims (Use Our API)
Once the API is public, run this in PowerShell:

```powershell
Invoke-RestMethod -Uri "https://api-y7s7mjbnma-uc.a.run.app/setup-admin" -Method POST -ContentType "application/json" -Body '{"email":"hello.pgwalebhaiya@gmail.com","password":"pgw@lebh@1y@@)@%","name":"PG Wale Bhaiya Admin"}'
```

### Step 4: Test Admin Login
1. 🌐 Go to: https://pg-walebhaiya.web.app/admin/login
2. 🔑 Login with:
   - **Email**: `hello.pgwalebhaiya@gmail.com`
   - **Password**: `pgw@lebh@1y@@)@%`
3. 🎉 You should be redirected to the admin dashboard!

## 🔧 **Alternative: If API Access Still Fails**

If making the API public doesn't work, you can set admin claims manually:

### Option A: Use Firebase Admin SDK Locally
1. Download service account key from Firebase Console
2. Use the `setup-admin-manual.js` script I created
3. Replace the service account details and run it

### Option B: Firebase CLI (Advanced)
```bash
firebase functions:shell
# Then in the shell:
setupAdmin({data: {email: "hello.pgwalebhaiya@gmail.com", password: "admin123", name: "PG Wale Bhaiya Admin"}})
```

## ✅ **Expected Result**

Once completed, you should be able to:
- ✅ Login to admin panel
- ✅ View admin dashboard
- ✅ Manage PG listings
- ✅ Handle cashback requests
- ✅ View analytics

## 🆘 **Still Having Issues?**

If you're still getting "Login failed", check:
1. Network tab in browser developer tools
2. Any console errors
3. Ensure the user was created in Firebase Auth
4. Verify API endpoint is accessible

**Quick Test**: Try visiting https://api-y7s7mjbnma-uc.a.run.app directly - you should see "PG Wale Bhaiya API is running!" instead of an error.

---

**🎯 Most Important**: Step 2 (making API public) is crucial for the frontend to communicate with the backend!
