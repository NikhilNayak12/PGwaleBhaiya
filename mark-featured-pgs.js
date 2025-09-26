// Script to mark approved PGs as featured
const admin = require('firebase-admin');
const serviceAccount = require('./backend/pg-walebhaiya-firebase-adminsdk-v6b8g-23e6e97dff.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'pg-walebhaiya'
});

const db = admin.firestore();

async function markPGsAsFeatured() {
  try {
    console.log('🔍 Fetching approved PGs...');
    
    // Get all approved PGs
    const pgsSnapshot = await db.collection('pgs')
      .where('status', '==', 'approved')
      .get();
    
    if (pgsSnapshot.empty) {
      console.log('❌ No approved PGs found');
      return;
    }
    
    console.log(`✅ Found ${pgsSnapshot.size} approved PGs`);
    
    // Update each PG to be featured
    const batch = db.batch();
    let updateCount = 0;
    
    pgsSnapshot.forEach(doc => {
      const pgData = doc.data();
      console.log(`📝 Marking as featured: ${pgData.title || pgData.name}`);
      
      batch.update(doc.ref, {
        featured: true,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      updateCount++;
    });
    
    // Commit the batch
    await batch.commit();
    
    console.log(`🎉 Successfully marked ${updateCount} PGs as featured!`);
    
  } catch (error) {
    console.error('❌ Error marking PGs as featured:', error);
  } finally {
    process.exit(0);
  }
}

// Run the script
markPGsAsFeatured();
