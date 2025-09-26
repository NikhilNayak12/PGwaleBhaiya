import axios from 'axios';

const API_BASE_URL = 'https://api-y7s7mjbnma-uc.a.run.app';

async function makeAllPGsFeatured() {
  try {
    console.log('Making all approved PGs featured...');
    
    // Get all PGs first
    const response = await axios.get(`${API_BASE_URL}/pgs?status=approved`);
    const pgs = response.data.data || [];
    
    console.log(`Found ${pgs.length} approved PGs`);
    
    for (const pg of pgs) {
      console.log(`\nMaking PG featured: ${pg.name} (${pg.id})`);
      
      try {
        const updateResponse = await axios.patch(`${API_BASE_URL}/pgs/${pg.id}/status`, {
          featured: true
        });
        
        if (updateResponse.data.success) {
          console.log(`✅ ${pg.name} is now featured!`);
        } else {
          console.log(`❌ Failed to make ${pg.name} featured:`, updateResponse.data.message);
        }
      } catch (error) {
        console.error(`❌ Error making ${pg.name} featured:`, error.message);
      }
    }
    
    // Verify featured PGs
    console.log('\n=== Verifying Featured PGs ===');
    const featuredResponse = await axios.get(`${API_BASE_URL}/pgs?status=approved&featured=true`);
    console.log(`Featured PGs count: ${featuredResponse.data.data?.length || 0}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

makeAllPGsFeatured();
