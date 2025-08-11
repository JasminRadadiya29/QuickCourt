const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testOTPSystem() {
  console.log('🧪 Testing OTP System...\n');

  const testEmail = 'test@example.com';

  try {
    // Test 1: Send OTP
    console.log('1️⃣ Sending OTP...');
    const sendResponse = await axios.post(`${API_BASE}/auth/send-otp`, {
      email: testEmail
    });
    console.log('✅ OTP sent successfully:', sendResponse.data);

    // Test 2: Verify with invalid OTP
    console.log('\n2️⃣ Testing invalid OTP...');
    try {
      await axios.post(`${API_BASE}/auth/verify-otp`, {
        email: testEmail,
        otp: '000000'
      });
      console.log('❌ Should have failed with invalid OTP');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Invalid OTP correctly rejected:', error.response.data.error);
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }

    // Test 3: Verify with non-existent email
    console.log('\n3️⃣ Testing non-existent email...');
    try {
      await axios.post(`${API_BASE}/auth/verify-otp`, {
        email: 'nonexistent@example.com',
        otp: '123456'
      });
      console.log('❌ Should have failed with non-existent email');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Non-existent email correctly rejected:', error.response.data.error);
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }

    console.log('\n🎉 OTP system tests completed!');
    console.log('\n📧 Check your email for the actual OTP code to test verification.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run the test
testOTPSystem();
