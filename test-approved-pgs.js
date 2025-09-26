import axios from 'axios';

const API_BASE_URL = 'https://api-y7s7mjbnma-uc.a.run.app';

async function testApprovedPGs() {
  try {
    console.log('Testing approved PGs API...');
    
    // Test getting all PGs
    const allResponse = await axios.get(`${API_BASE_URL}/pgs?status=all`);
    console.log('\n=== ALL PGs ===');
    console.log(`Total PGs: ${allResponse.data.data?.length || 0}`);
    
    if (allResponse.data.data) {
      const statusCounts = allResponse.data.data.reduce((acc, pg) => {
        acc[pg.status] = (acc[pg.status] || 0) + 1;
        return acc;
      }, {});
      console.log('Status breakdown:', statusCounts);
      
      // Show first few PGs with their status
      console.log('\nFirst 5 PGs:');
      allResponse.data.data.slice(0, 5).forEach(pg => {
        console.log(`- ${pg.name || pg.title} | Status: ${pg.status} | ID: ${pg.id}`);
      });
    }
    
    // Test getting only approved PGs
    const approvedResponse = await axios.get(`${API_BASE_URL}/pgs?status=approved`);
    console.log('\n=== APPROVED PGs RESPONSE STRUCTURE ===');
    console.log('Response structure:', {
      success: approvedResponse.data.success,
      hasData: !!approvedResponse.data.data,
      dataLength: approvedResponse.data.data?.length || 0,
      pagination: approvedResponse.data.pagination
    });
    console.log('Full response keys:', Object.keys(approvedResponse.data));
    console.log(`Total approved PGs: ${approvedResponse.data.data?.length || 0}`);
    
    if (approvedResponse.data.data) {
      console.log('Approved PGs:');
      approvedResponse.data.data.forEach(pg => {
        console.log(`- ${pg.name || pg.title} | Status: ${pg.status} | ID: ${pg.id}`);
        console.log('  Full PG data:', JSON.stringify({
          id: pg.id,
          name: pg.name,
          title: pg.title,
          location: pg.location,
          price: pg.price,
          monthlyRent: pg.monthlyRent,
          status: pg.status,
          type: pg.type,
          roomType: pg.roomType,
          amenities: pg.amenities
        }, null, 2));
      });
    }
    
  } catch (error) {
    console.error('Error testing API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testApprovedPGs();
