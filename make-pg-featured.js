import axios from 'axios';

const API_BASE_URL = 'https://api-y7s7mjbnma-uc.a.run.app';

async function makePGFeatured() {
  try {
    console.log('Making PG featured...');
    
    // First get the PG ID
    const response = await axios.get(`${API_BASE_URL}/pgs?status=approved`);
    
    if (response.data.data && response.data.data.length > 0) {
      const pgId = response.data.data[0].id;
      console.log('PG ID:', pgId);
      
      // Update the PG to make it featured
      const updateResponse = await axios.patch(`${API_BASE_URL}/pgs/${pgId}/status`, {
        featured: true
      });
      
      console.log('Update response:', updateResponse.data);
      console.log('✅ PG is now featured!');
      
      // Verify it worked
      const verifyResponse = await axios.get(`${API_BASE_URL}/pgs?featured=true&status=approved`);
      console.log('Featured PGs count:', verifyResponse.data.data?.length || 0);
    } else {
      console.log('No approved PGs found to make featured');
    }
    
  } catch (error) {
    console.error('Error making PG featured:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

makePGFeatured();
