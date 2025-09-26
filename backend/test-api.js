// Simple test script to verify PG Wale Bhaiya APIs
// Run this with: node test-api.js (after starting Firebase emulator)

const axios = require('axios');

const BASE_URL = 'http://127.0.0.1:5001/pg-walebhaiya/us-central1/api';

async function testAPIs() {
  console.log('🚀 Testing PG Wale Bhaiya APIs...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data);
    console.log('');

    // Test 2: Get Amenities
    console.log('2. Testing Amenities Endpoint...');
    const amenitiesResponse = await axios.get(`${BASE_URL}/amenities`);
    console.log('✅ Amenities:', amenitiesResponse.data);
    console.log('');

    // Test 3: Admin Login
    console.log('3. Testing Admin Login...');
    const loginResponse = await axios.post(`${BASE_URL}/admin-login`, {
      email: 'admin@pgwalebhaiya.com',
      password: 'admin123'
    });
    console.log('✅ Admin Login:', loginResponse.data);
    console.log('');

    // Test 4: Create PG Listing
    console.log('4. Testing PG Creation...');
    const pgData = {
      title: 'Test PG for API',
      roomType: 'Single',
      area: 'Law Gate',
      locality: 'Near BB Mart',
      monthlyRent: 8500,
      availableRooms: 3,
      genderPreference: 'Boys Only',
      contactPerson: 'Test User',
      phoneNumber: '+91 98765 43210',
      email: 'test@example.com',
      amenities: ['WiFi', 'Parking', 'Meals']
    };

    const createPGResponse = await axios.post(`${BASE_URL}/pgs`, pgData);
    console.log('✅ PG Created:', createPGResponse.data);
    const pgId = createPGResponse.data.data.id;
    console.log('');

    // Test 5: Get All PGs
    console.log('5. Testing Get All PGs...');
    const pgsResponse = await axios.get(`${BASE_URL}/pgs`);
    console.log('✅ Get PGs:', {
      success: pgsResponse.data.success,
      count: pgsResponse.data.data.length,
      pagination: pgsResponse.data.pagination
    });
    console.log('');

    // Test 6: Get Single PG
    console.log('6. Testing Get Single PG...');
    const singlePGResponse = await axios.get(`${BASE_URL}/pgs/${pgId}`);
    console.log('✅ Single PG:', {
      success: singlePGResponse.data.success,
      title: singlePGResponse.data.data.title,
      status: singlePGResponse.data.data.status
    });
    console.log('');

    // Test 7: Create Inquiry
    console.log('7. Testing Create Inquiry...');
    const inquiryData = {
      name: 'Test Student',
      phone: '+91 87654 32109',
      email: 'student@example.com',
      message: 'I am interested in this PG. Can I visit tomorrow?'
    };

    const inquiryResponse = await axios.post(`${BASE_URL}/pgs/${pgId}/inquire`, inquiryData);
    console.log('✅ Inquiry Created:', inquiryResponse.data);
    console.log('');

    // Test 8: Search PGs
    console.log('8. Testing Search...');
    const searchResponse = await axios.get(`${BASE_URL}/search?query=law gate&minPrice=5000&maxPrice=10000`);
    console.log('✅ Search Results:', {
      success: searchResponse.data.success,
      count: searchResponse.data.data.length
    });
    console.log('');

    // Test 9: Contact Form
    console.log('9. Testing Contact Form...');
    const contactData = {
      name: 'Test Contact',
      email: 'contact@example.com',
      message: 'This is a test contact message'
    };

    const contactResponse = await axios.post(`${BASE_URL}/contact`, contactData);
    console.log('✅ Contact Form:', contactResponse.data);
    console.log('');

    console.log('🎉 All tests passed! Your API is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure Firebase emulator is running:');
      console.log('cd backend && firebase emulators:start --only functions');
    }
  }
}

// Run the tests
testAPIs();
