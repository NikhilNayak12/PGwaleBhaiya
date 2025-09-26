// Test the actual API endpoint
const testAdminLogin = async () => {
  console.log('Testing admin login API...');
  
  const credentials = {
    email: 'hello.pgwalebhaiya@gmail.com',
    password: 'pgw@lebh@1y@@)@%'
  };
  
  try {
    const response = await fetch('https://api-y7s7mjbnma-uc.a.run.app/admin-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });
    
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
    
  } catch (error) {
    console.error('Error:', error);
  }
};

testAdminLogin();
