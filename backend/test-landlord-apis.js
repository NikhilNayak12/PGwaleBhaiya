// Test script for Landlord Dashboard APIs
// Run this with: node test-landlord-apis.js

const BASE_URL = 'http://localhost:5001/your-project-id/us-central1/api';

// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    console.log(`${options.method || 'GET'} ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error.message);
    return null;
  }
}

async function testLandlordAPIs() {
  console.log('🏘️  Testing Landlord Dashboard APIs\n');

  // 1. Test Health Check
  console.log('1. Health Check');
  await apiCall('/health');
  console.log('\n');

  // 2. Test Landlord Registration
  console.log('2. Landlord Registration');
  const registerData = {
    name: 'Test Landlord',
    email: 'testlord@example.com',
    phone: '+91 98765 43210',
    password: 'password123',
    whatsapp: '+91 98765 43210',
    address: '123 Test Street, Phagwara',
    documentType: 'Aadhaar',
    documentNumber: '1234 5678 9012'
  };
  
  const registerResult = await apiCall('/landlord-register', {
    method: 'POST',
    body: JSON.stringify(registerData),
  });
  console.log('\n');

  // 3. Test Landlord Login
  console.log('3. Landlord Login');
  const loginResult = await apiCall('/landlord-login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'testlord@example.com',
      password: 'password123'
    }),
  });
  
  const landlordId = loginResult?.data?.landlord?.id;
  console.log('Landlord ID:', landlordId);
  console.log('\n');

  if (landlordId) {
    // 4. Test Create PG Listing
    console.log('4. Create PG Listing');
    const pgData = {
      title: 'Test Green Valley PG',
      roomType: 'Single/Double',
      area: 'Law Gate',
      locality: 'Near Test Market',
      fullAddress: '123 Law Gate, Phagwara',
      monthlyRent: 8500,
      totalRooms: 20,
      availableRooms: 5,
      genderPreference: 'Boys Only',
      contactPerson: 'Test Landlord',
      phoneNumber: '+91 98765 43210',
      email: 'testlord@example.com',
      whatsappNumber: '+91 98765 43210',
      amenities: ['WiFi', 'Parking', 'Meals'],
      otherAmenities: 'Study Room, Garden',
      images: ['/pgs/test-1.jpg'],
      landlordId: landlordId
    };

    const pgResult = await apiCall('/pgs', {
      method: 'POST',
      body: JSON.stringify(pgData),
    });
    
    const pgId = pgResult?.data?.id;
    console.log('Created PG ID:', pgId);
    console.log('\n');

    // 5. Test Dashboard Stats
    console.log('5. Get Dashboard Stats');
    await apiCall(`/landlord/${landlordId}/dashboard`);
    console.log('\n');

    // 6. Test Get Landlord's PGs
    console.log('6. Get Landlord PGs');
    await apiCall(`/landlord/${landlordId}/pgs`);
    console.log('\n');

    // 7. Test Get Landlord's Inquiries
    console.log('7. Get Landlord Inquiries');
    await apiCall(`/landlord/${landlordId}/inquiries`);
    console.log('\n');

    // 8. Test Update Profile
    console.log('8. Update Landlord Profile');
    await apiCall(`/landlord/${landlordId}/profile`, {
      method: 'PUT',
      body: JSON.stringify({
        name: 'Updated Test Landlord',
        address: '456 Updated Street, Phagwara'
      }),
    });
    console.log('\n');

    if (pgId) {
      // 9. Test Create Inquiry
      console.log('9. Create Inquiry for PG');
      await apiCall(`/pgs/${pgId}/inquire`, {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test Student',
          phone: '+91 87654 32109',
          email: 'student@example.com',
          message: 'I am interested in this PG. Can I visit tomorrow?',
          inquiryType: 'general'
        }),
      });
      console.log('\n');

      // 10. Test Get PG Inquiries
      console.log('10. Get PG Inquiries');
      await apiCall(`/pgs/${pgId}/inquiries`);
      console.log('\n');
    }
  }

  // 11. Test Get All Landlords (Admin endpoint)
  console.log('11. Get All Landlords');
  await apiCall('/landlords');
  console.log('\n');

  console.log('✅ All Landlord Dashboard API tests completed!');
}

// Run the tests
testLandlordAPIs().catch(console.error);
