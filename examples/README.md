# MS Intune and Entra MCP Examples

This directory contains example scripts demonstrating how to use the MCP API.

## Setup

1. Install dependencies
   ```
   npm install axios dotenv
   ```

2. Create a `.env` file based on the `.env.example` template
   ```
   cp .env.example .env
   ```

3. Edit the `.env` file with your MCP configuration
   ```
   MCP_BASE_URL=http://localhost:3000
   ```

## Running the examples

### Basic client

The `client.js` script demonstrates basic operations:
- Checking MCP health
- Listing users
- Listing devices
- Listing conditional access policies

```
node client.js
```

## Creating your own clients

You can use the basic pattern in `client.js` to create your own client applications that interact with the MCP. The key components are:

1. Configuration (from environment variables)
2. Helper function for making API requests
3. Business logic that calls the MCP endpoints

Feel free to modify these examples or create new ones for your specific use cases.