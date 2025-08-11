const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testCompleteFlow() {
  console.log('🧪 Testing Complete OTP Registration Flow...\n');

  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'TestPassword123',
    role: 'user'
  };

  try {
    // Test 1: Send OTP
    console.log('1️⃣ Sending OTP...');
    const sendResponse = await axios.post(`${API_BASE}/auth/send-otp`, {
      email: testUser.email
    });
    console.log('✅ OTP sent successfully:', sendResponse.data);

    // Test 2: Try to send OTP again immediately (should fail)
    console.log('\n2️⃣ Testing rate limiting...');
    try {
      await axios.post(`${API_BASE}/auth/send-otp`, {
        email: testUser.email
      });
      console.log('❌ Should have failed with rate limiting');
    } catch (error) {
      if (error.response?.status === 429) {
        console.log('✅ Rate limiting working correctly:', error.response.data.error);
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }

    // Test 3: Try to register with invalid OTP
    console.log('\n3️⃣ Testing invalid OTP registration...');
    try {
      await axios.post(`${API_BASE}/auth/register-with-otp`, {
        ...testUser,
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

    // Test 4: Try to register without OTP
    console.log('\n4️⃣ Testing registration without OTP...');
    try {
      await axios.post(`${API_BASE}/auth/register-with-otp`, {
        name: testUser.name,
        email: testUser.email,
        password: testUser.password,
        role: testUser.role
        // Missing OTP
      });
      console.log('❌ Should have failed without OTP');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Missing OTP correctly rejected:', error.response.data.error);
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }

    console.log('\n🎉 Complete flow tests completed!');
    console.log('\n📧 Check your email for the actual OTP code to test successful registration.');
    console.log('\n💡 To test successful registration, use the OTP from your email with:');
    console.log(`   POST ${API_BASE}/auth/register-with-otp`);
    console.log('   Body:', JSON.stringify({ ...testUser, otp: 'XXXXXX' }, null, 2));

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run the test
testCompleteFlow();
