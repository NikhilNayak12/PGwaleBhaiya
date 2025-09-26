// Manual admin setup script for Firebase Auth
// This script will be run locally to set up the admin user with custom claims

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin (using the service account key)
const serviceAccount = {
  "type": "service_account",
  "project_id": "pg-walebhaiya",
  "private_key_id": "your-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@pg-walebhaiya.iam.gserviceaccount.com",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40pg-walebhaiya.iam.gserviceaccount.com"
};

// Note: You'll need to replace the above with actual service account details
// Get them from: https://console.firebase.google.com/project/pg-walebhaiya/settings/serviceaccounts/adminsdk

async function setupAdmin() {
  try {
    console.log('🚀 Setting up Firebase Admin...');
    
    // Initialize admin if not already done
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: 'pg-walebhaiya'
      });
    }

    const auth = admin.auth();
    const email = 'hello.pgwalebhaiya@gmail.com';
    
    console.log('👤 Creating admin user...');
    
    let user;
    try {
      // Try to get existing user
      user = await auth.getUserByEmail(email);
      console.log('✅ User already exists:', user.uid);
    } catch (error) {
      // Create new user if doesn't exist
      user = await auth.createUser({
        email: email,
        password: 'admin123',
        displayName: 'PG Wale Bhaiya Admin',
        emailVerified: true
      });
      console.log('✅ Created new user:', user.uid);
    }
    
    // Set custom claims for admin privileges
    await auth.setCustomUserClaims(user.uid, {
      admin: true,
      role: 'admin',
      permissions: ['read', 'write', 'delete', 'admin']
    });
    
    console.log('🎯 Set admin custom claims for user:', user.uid);
    console.log('✅ Admin setup complete!');
    console.log('\n📝 Admin Credentials:');
    console.log('Email:', email);
    console.log('Password: admin123');
    console.log('UID:', user.uid);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error setting up admin:', error);
    process.exit(1);
  }
}

// Only run if service account is properly configured
if (serviceAccount.private_key.includes('YOUR_PRIVATE_KEY_HERE')) {
  console.log('⚠️  Please configure the service account details first!');
  console.log('1. Go to: https://console.firebase.google.com/project/pg-walebhaiya/settings/serviceaccounts/adminsdk');
  console.log('2. Click "Generate new private key"');
  console.log('3. Download the JSON file');
  console.log('4. Replace the serviceAccount object in this file with the downloaded content');
  console.log('5. Run: node setup-admin-manual.js');
} else {
  setupAdmin();
}

module.exports = { setupAdmin };
