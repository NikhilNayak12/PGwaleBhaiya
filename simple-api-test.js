// Simple test without external dependencies
const http = require('http');

const API_BASE_URL = 'http://127.0.0.1:5001/pg-walebhaiya/us-central1/api';

function testHealthEndpoint() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: 5001,
      path: '/pg-walebhaiya/us-central1/api/health',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: parsedData
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function runTest() {
  console.log('🚀 Testing PG Wale Bhaiya API Connection...\n');
  
  try {
    console.log('Testing Health Endpoint...');
    const result = await testHealthEndpoint();
    
    console.log('✅ API Connection Successful!');
    console.log('Status Code:', result.status);
    console.log('Response Data:', result.data);
    console.log('\n🎉 Backend and Frontend are ready to connect!');
    
    console.log('\n📊 Connection Details:');
    console.log('- Backend API:', API_BASE_URL);
    console.log('- Frontend Dev Server: http://localhost:3000');
    console.log('- Firebase Emulator UI: http://127.0.0.1:4000');
    
  } catch (error) {
    console.error('❌ API Connection Failed:');
    console.error('Error:', error.message);
    
    console.log('\n🔧 Troubleshooting Steps:');
    console.log('1. Ensure Firebase emulator is running:');
    console.log('   cd backend/functions && firebase emulators:start --only functions');
    console.log('2. Check if port 5001 is available');
    console.log('3. Verify Firebase project configuration');
    console.log('4. Check firewall settings');
  }
}

runTest();
