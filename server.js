const fastify = require('fastify')({ logger: true });
const { default: axios } = require('axios');
const qs = require('querystring');
require('dotenv').config();

// Configuration - these should be set as environment variables
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const TENANT_ID = process.env.TENANT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:3000/auth/callback';
const PORT = process.env.PORT || 3000;

// Auth token storage - in production use a proper token store
let tokenCache = {};

/**
 * Gets a new access token using client credentials flow
 */
async function getAccessToken() {
  try {
    const tokenEndpoint = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
    
    const params = {
      client_id: CLIENT_ID,
      scope: 'https://graph.microsoft.com/.default',
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    };
    
    const response = await axios.post(tokenEndpoint, qs.stringify(params), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    tokenCache = {
      accessToken: response.data.access_token,
      expiresAt: Date.now() + (response.data.expires_in * 1000)
    };
    
    return tokenCache.accessToken;
  } catch (error) {
    console.error('Error getting access token:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Gets a valid access token, refreshing if necessary
 */
async function getValidAccessToken() {
  if (!tokenCache.accessToken || Date.now() >= tokenCache.expiresAt) {
    await getAccessToken();
  }
  return tokenCache.accessToken;
}

/**
 * Helper to make authenticated Graph API requests
 */
async function callGraphAPI(method, endpoint, data = null) {
  try {
    const token = await getValidAccessToken();
    
    const config = {
      method,
      url: `https://graph.microsoft.com/v1.0${endpoint}`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    
    if (data && (method === 'post' || method === 'put' || method === 'patch')) {
      config.data = data;
    }
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error calling Graph API (${method} ${endpoint}):`, error.response?.data || error.message);
    throw error;
  }
}

// Register routes

// Health check endpoint
fastify.get('/health', async () => {
  return { status: 'ok' };
});

// Get all users
fastify.get('/users', async (request, reply) => {
  try {
    const users = await callGraphAPI('get', '/users');
    return users;
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// Get a specific user
fastify.get('/users/:id', async (request, reply) => {
  try {
    const user = await callGraphAPI('get', `/users/${request.params.id}`);
    return user;
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// Create a new user
fastify.post('/users', async (request, reply) => {
  try {
    const newUser = await callGraphAPI('post', '/users', request.body);
    return newUser;
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// Update a user
fastify.patch('/users/:id', async (request, reply) => {
  try {
    await callGraphAPI('patch', `/users/${request.params.id}`, request.body);
    return { success: true };
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// Delete a user
fastify.delete('/users/:id', async (request, reply) => {
  try {
    await callGraphAPI('delete', `/users/${request.params.id}`);
    return { success: true };
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// Get all groups
fastify.get('/groups', async (request, reply) => {
  try {
    const groups = await callGraphAPI('get', '/groups');
    return groups;
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// Get a specific group
fastify.get('/groups/:id', async (request, reply) => {
  try {
    const group = await callGraphAPI('get', `/groups/${request.params.id}`);
    return group;
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// Create a new group
fastify.post('/groups', async (request, reply) => {
  try {
    const newGroup = await callGraphAPI('post', '/groups', request.body);
    return newGroup;
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// Update a group
fastify.patch('/groups/:id', async (request, reply) => {
  try {
    await callGraphAPI('patch', `/groups/${request.params.id}`, request.body);
    return { success: true };
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// Delete a group
fastify.delete('/groups/:id', async (request, reply) => {
  try {
    await callGraphAPI('delete', `/groups/${request.params.id}`);
    return { success: true };
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// Get all devices
fastify.get('/devices', async (request, reply) => {
  try {
    const devices = await callGraphAPI('get', '/deviceManagement/managedDevices');
    return devices;
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// Get a specific device
fastify.get('/devices/:id', async (request, reply) => {
  try {
    const device = await callGraphAPI('get', `/deviceManagement/managedDevices/${request.params.id}`);
    return device;
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// Wipe a device
fastify.post('/devices/:id/wipe', async (request, reply) => {
  try {
    await callGraphAPI('post', `/deviceManagement/managedDevices/${request.params.id}/wipe`, {});
    return { success: true };
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// Get all device compliance policies
fastify.get('/device-compliance-policies', async (request, reply) => {
  try {
    const policies = await callGraphAPI('get', '/deviceManagement/deviceCompliancePolicies');
    return policies;
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// Get a specific device compliance policy
fastify.get('/device-compliance-policies/:id', async (request, reply) => {
  try {
    const policy = await callGraphAPI('get', `/deviceManagement/deviceCompliancePolicies/${request.params.id}`);
    return policy;
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// Create a new device compliance policy
fastify.post('/device-compliance-policies', async (request, reply) => {
  try {
    const newPolicy = await callGraphAPI('post', '/deviceManagement/deviceCompliancePolicies', request.body);
    return newPolicy;
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// Update a device compliance policy
fastify.patch('/device-compliance-policies/:id', async (request, reply) => {
  try {
    await callGraphAPI('patch', `/deviceManagement/deviceCompliancePolicies/${request.params.id}`, request.body);
    return { success: true };
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// Delete a device compliance policy
fastify.delete('/device-compliance-policies/:id', async (request, reply) => {
  try {
    await callGraphAPI('delete', `/deviceManagement/deviceCompliancePolicies/${request.params.id}`);
    return { success: true };
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// Get all device configuration profiles
fastify.get('/device-configuration-profiles', async (request, reply) => {
  try {
    const profiles = await callGraphAPI('get', '/deviceManagement/deviceConfigurations');
    return profiles;
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// Get a specific device configuration profile
fastify.get('/device-configuration-profiles/:id', async (request, reply) => {
  try {
    const profile = await callGraphAPI('get', `/deviceManagement/deviceConfigurations/${request.params.id}`);
    return profile;
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// Create a new device configuration profile
fastify.post('/device-configuration-profiles', async (request, reply) => {
  try {
    const newProfile = await callGraphAPI('post', '/deviceManagement/deviceConfigurations', request.body);
    return newProfile;
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// Update a device configuration profile
fastify.patch('/device-configuration-profiles/:id', async (request, reply) => {
  try {
    await callGraphAPI('patch', `/deviceManagement/deviceConfigurations/${request.params.id}`, request.body);
    return { success: true };
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// Delete a device configuration profile
fastify.delete('/device-configuration-profiles/:id', async (request, reply) => {
  try {
    await callGraphAPI('delete', `/deviceManagement/deviceConfigurations/${request.params.id}`);
    return { success: true };
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// Get all mobile apps
fastify.get('/mobile-apps', async (request, reply) => {
  try {
    const apps = await callGraphAPI('get', '/deviceAppManagement/mobileApps');
    return apps;
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// Get a specific mobile app
fastify.get('/mobile-apps/:id', async (request, reply) => {
  try {
    const app = await callGraphAPI('get', `/deviceAppManagement/mobileApps/${request.params.id}`);
    return app;
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// Get all conditional access policies
fastify.get('/conditional-access-policies', async (request, reply) => {
  try {
    const policies = await callGraphAPI('get', '/identity/conditionalAccess/policies');
    return policies;
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// Get a specific conditional access policy
fastify.get('/conditional-access-policies/:id', async (request, reply) => {
  try {
    const policy = await callGraphAPI('get', `/identity/conditionalAccess/policies/${request.params.id}`);
    return policy;
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// Create a new conditional access policy
fastify.post('/conditional-access-policies', async (request, reply) => {
  try {
    const newPolicy = await callGraphAPI('post', '/identity/conditionalAccess/policies', request.body);
    return newPolicy;
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// Update a conditional access policy
fastify.patch('/conditional-access-policies/:id', async (request, reply) => {
  try {
    await callGraphAPI('patch', `/identity/conditionalAccess/policies/${request.params.id}`, request.body);
    return { success: true };
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// Delete a conditional access policy
fastify.delete('/conditional-access-policies/:id', async (request, reply) => {
  try {
    await callGraphAPI('delete', `/identity/conditionalAccess/policies/${request.params.id}`);
    return { success: true };
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Server is running on port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();