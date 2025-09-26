const emailService = require('./functions/emailService');

async function testEmailService() {
  console.log('🧪 Testing Email Service...\n');
  
  // Test email configuration
  console.log('1. Testing email configuration...');
  const configValid = await emailService.verifyEmailConfig();
  if (!configValid) {
    console.log('❌ Email configuration failed');
    return;
  }
  console.log('✅ Email configuration is valid\n');
  
  // Test registration notification
  console.log('2. Testing registration notification...');
  const testLandlord = {
    name: 'Test Landlord',
    email: 'testlanlord@example.com', // Change this to your email for testing
    phone: '+91 9876543210',
    businessName: 'Test PG Business'
  };
  
  const registrationResult = await emailService.sendLandlordRegistrationNotification(testLandlord);
  if (registrationResult) {
    console.log('✅ Registration notification sent successfully\n');
  } else {
    console.log('❌ Registration notification failed\n');
  }
  
  // Test login notification
  console.log('3. Testing login notification...');
  const loginResult = await emailService.sendLandlordLoginNotification(testLandlord);
  if (loginResult) {
    console.log('✅ Login notification sent successfully\n');
  } else {
    console.log('❌ Login notification failed\n');
  }
  
  console.log('🏁 Email service testing completed!');
}

// Run the test
if (require.main === module) {
  testEmailService().catch(console.error);
}

module.exports = testEmailService;
