const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./service-account-key.json'); // You'll need to download this
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'pg-walebhaiya'
});

async function createAdminUser() {
  try {
    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email: 'hello.pgwalebhaiya@gmail.com',
      password: 'admin123',
      displayName: 'PG Wale Bhaiya Admin',
    });

    console.log('Successfully created new user:', userRecord.uid);

    // Set admin custom claims
    await admin.auth().setCustomUserClaims(userRecord.uid, { 
      admin: true,
      role: 'admin' 
    });

    console.log('Admin claims set successfully');
    
    process.exit(0);
  } catch (error) {
    console.log('Error creating new user:', error);
    process.exit(1);
  }
}

createAdminUser();
