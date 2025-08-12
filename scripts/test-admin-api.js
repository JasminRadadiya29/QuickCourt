/**
 * Test script for Admin API endpoints
 * 
 * This script tests the various admin API endpoints implemented for the QuickCourt platform.
 * It requires an admin JWT token to be set in the ADMIN_TOKEN environment variable.
 * 
 * Usage: node scripts/test-admin-api.js
 */

require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');

// Configuration
const BASE_URL = 'http://localhost:3000/api/admin';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN; // Set this in your .env.local file

if (!ADMIN_TOKEN) {
  console.error('Error: ADMIN_TOKEN environment variable is not set');
  process.exit(1);
}

// Helper function for making API requests
async function apiRequest(endpoint, method = 'GET', body = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ADMIN_TOKEN}`
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error(`Error making request to ${url}:`, error);
    return { status: 500, data: { error: error.message } };
  }
}

// Test functions
async function testGetPendingVenues() {
  console.log('\n--- Testing GET /venues/pending ---');
  const { status, data } = await apiRequest('/venues/pending?page=1&size=5');
  console.log(`Status: ${status}`);
  console.log(`Total venues: ${data.pagination?.total || 'N/A'}`);
  console.log(`First venue: ${data.venues?.[0]?.name || 'None'}`);
  return status === 200;
}

async function testGetUsers() {
  console.log('\n--- Testing GET /users ---');
  const { status, data } = await apiRequest('/users?page=1&size=5');
  console.log(`Status: ${status}`);
  console.log(`Total users: ${data.pagination?.total || 'N/A'}`);
  console.log(`First user: ${data.users?.[0]?.name || 'None'}`);
  return status === 200;
}

async function testGetBookings() {
  console.log('\n--- Testing GET /bookings ---');
  const { status, data } = await apiRequest('/bookings?page=1&size=5');
  console.log(`Status: ${status}`);
  console.log(`Total bookings: ${data.pagination?.total || 'N/A'}`);
  console.log(`First booking venue: ${data.bookings?.[0]?.venue?.name || 'None'}`);
  return status === 200;
}

// Main test function
async function runTests() {
  console.log('Starting Admin API tests...');
  
  // Test API info endpoint
  console.log('\n--- Testing GET / (API Info) ---');
  const { status, data } = await apiRequest('/');
  console.log(`Status: ${status}`);
  console.log(`API Version: ${data.version || 'N/A'}`);
  console.log(`Endpoints: ${data.endpoints?.length || 0}`);
  
  // Run other tests
  const pendingVenuesResult = await testGetPendingVenues();
  const usersResult = await testGetUsers();
  const bookingsResult = await testGetBookings();
  
  // Summary
  console.log('\n--- Test Summary ---');
  console.log(`API Info: ${status === 200 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Pending Venues: ${pendingVenuesResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Users: ${usersResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Bookings: ${bookingsResult ? '✅ PASS' : '❌ FAIL'}`);
}

// Run the tests
runTests().catch(error => {
  console.error('Test execution failed:', error);
});