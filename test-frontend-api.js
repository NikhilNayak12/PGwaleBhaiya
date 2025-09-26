import axios from 'axios';

const API_BASE_URL = 'https://api-y7s7mjbnma-uc.a.run.app';

// Simulate exactly what the frontend Listings.jsx does
async function testFrontendListings() {
  try {
    console.log('Testing frontend listings API call...');
    
    // This is exactly what the frontend does in Listings.jsx
    const response = await axios.get(`${API_BASE_URL}/pgs`, {
      params: { 
        status: 'approved'
      }
    });
    
    console.log('\n=== Frontend API Response ===');
    console.log('Status:', response.status);
    console.log('Response success:', response.data.success);
    console.log('Data available:', !!response.data.data);
    console.log('PGs count:', response.data.data?.length || 0);
    
    if (response.data.data && response.data.data.length > 0) {
      console.log('\n=== PGs Data Structure (as frontend sees it) ===');
      response.data.data.forEach((pg, index) => {
        console.log(`\nPG ${index + 1}:`);
        console.log(`  ID: ${pg.id}`);
        console.log(`  Name/Title: ${pg.name || pg.title || 'N/A'}`);
        console.log(`  Status: ${pg.status}`);
        console.log(`  Price: ${pg.price || pg.monthlyRent || 'N/A'}`);
        console.log(`  Location: ${typeof pg.location === 'object' ? JSON.stringify(pg.location) : pg.location || 'N/A'}`);
        console.log(`  Type: ${pg.type || pg.roomType || 'N/A'}`);
        console.log(`  Amenities: ${JSON.stringify(pg.amenities || [])}`);
      });
    } else {
      console.log('\n❌ No PGs found or data structure issue');
    }
    
  } catch (error) {
    console.error('❌ Frontend API Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testFrontendListings();
