const axios = require('axios');
require('dotenv').config();

// Configuration
const MCP_BASE_URL = process.env.MCP_BASE_URL || 'http://localhost:3000';

// Helper function to make API requests to the MCP
async function callMcp(method, endpoint, data = null) {
  try {
    const config = {
      method,
      url: `${MCP_BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (data && (method === 'post' || method === 'put' || method === 'patch')) {
      config.data = data;
    }
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error calling MCP API (${method} ${endpoint}):`, error.response?.data || error.message);
    throw error;
  }
}

async function main() {
  try {
    // Check MCP health
    console.log('Checking MCP health...');
    const health = await callMcp('get', '/health');
    console.log('MCP health:', health);
    
    // Example 1: List all users
    console.log('\nListing all users...');
    const users = await callMcp('get', '/users');
    console.log(`Found ${users.value.length} users:`);
    users.value.forEach(user => {
      console.log(`- ${user.displayName} (${user.userPrincipalName})`);
    });
    
    // Example 2: List all devices
    console.log('\nListing all devices...');
    const devices = await callMcp('get', '/devices');
    console.log(`Found ${devices.value.length} devices:`);
    devices.value.forEach(device => {
      console.log(`- ${device.deviceName} | OS: ${device.operatingSystem} ${device.osVersion} | Compliance: ${device.complianceState}`);
    });
    
    // Example 3: List all conditional access policies
    console.log('\nListing all conditional access policies...');
    const policies = await callMcp('get', '/conditional-access-policies');
    console.log(`Found ${policies.value.length} policies:`);
    policies.value.forEach(policy => {
      console.log(`- ${policy.displayName} | State: ${policy.state}`);
    });
    
  } catch (error) {
    console.error('Error in main function:', error.message);
  }
}

main();