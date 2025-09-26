// API Connection Test
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5001/pg-walebhaiya/us-central1/api';

console.log('🚀 Testing PG Wale Bhaiya API Connection...\n');

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

async function testAPIConnection() {
  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await api.get('/health');
    console.log('✅ Health Check Status:', healthResponse.status);
    console.log('✅ Health Data:', healthResponse.data);
    console.log('');

    // Test 2: Get Amenities
    console.log('2. Testing Amenities Endpoint...');
    const amenitiesResponse = await api.get('/amenities');
    console.log('✅ Amenities Status:', amenitiesResponse.status);
    console.log('✅ Available Amenities:', amenitiesResponse.data.data?.slice(0, 5) || 'None');
    console.log('');

    // Test 3: Get PGs (with limit to avoid too much output)
    console.log('3. Testing PGs Endpoint...');
    const pgsResponse = await api.get('/pgs?limit=3');
    console.log('✅ PGs Status:', pgsResponse.status);
    console.log('✅ Total PGs:', pgsResponse.data.data?.length || 0);
    if (pgsResponse.data.data?.length > 0) {
      console.log('✅ First PG:', {
        id: pgsResponse.data.data[0].id,
        title: pgsResponse.data.data[0].title,
        location: pgsResponse.data.data[0].location,
        price: pgsResponse.data.data[0].price
      });
    }
    console.log('');

    // Test 4: Search functionality
    console.log('4. Testing Search Endpoint...');
    const searchResponse = await api.get('/search?query=Law Gate&limit=2');
    console.log('✅ Search Status:', searchResponse.status);
    console.log('✅ Search Results:', searchResponse.data.data?.length || 0);
    console.log('');

    console.log('🎉 All API tests passed successfully!');
    console.log('🔗 Backend API is running at:', API_BASE_URL);
    console.log('📊 Firebase Emulator UI: http://127.0.0.1:4000/');
    
  } catch (error) {
    console.error('❌ API Test Failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Is the backend running?');
      console.error('Expected backend URL:', API_BASE_URL);
    } else {
      console.error('Error:', error.message);
    }
    
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure Firebase emulator is running: npm run start:backend');
    console.log('2. Check if backend is accessible at: http://127.0.0.1:5001');
    console.log('3. Verify Firebase project configuration');
  }
}

// Run the test
testAPIConnection();
