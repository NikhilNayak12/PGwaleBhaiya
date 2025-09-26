const config = require('./config');

// Test the config values
console.log('Testing admin config:');
console.log('DEFAULT_ADMIN_EMAIL:', config.DEFAULT_ADMIN_EMAIL);
console.log('DEFAULT_ADMIN_PASSWORD:', config.DEFAULT_ADMIN_PASSWORD);

// Test the comparison
const testEmail = 'hello.pgwalebhaiya@gmail.com';
const testPassword = 'pgw@lebh@1y@@)@%';

console.log('\nTesting credentials:');
console.log('Email match:', testEmail === config.DEFAULT_ADMIN_EMAIL);
console.log('Password match:', testPassword === config.DEFAULT_ADMIN_PASSWORD);
console.log('Test email length:', testEmail.length);
console.log('Config email length:', config.DEFAULT_ADMIN_EMAIL.length);
console.log('Test password length:', testPassword.length);
console.log('Config password length:', config.DEFAULT_ADMIN_PASSWORD.length);
