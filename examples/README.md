# MS Intune and Entra MCP Examples

This directory contains example scripts demonstrating how to use the MCP API.

## Setup

1. Install dependencies
   ```
   # For Node.js examples
   npm install axios dotenv
   
   # For Python examples
   pip install requests python-dotenv
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

### Node.js Client

The `client.js` script demonstrates basic operations:
- Checking MCP health
- Listing users
- Listing devices
- Listing conditional access policies

```
node client.js
```

### Python Client

The `python_client.py` script demonstrates the same basic operations as the Node.js client but using Python:

```
python python_client.py
```

### Power Automate Flow

The `power-automate-new-device-flow.json` file contains a Microsoft Power Automate flow definition that:
1. Checks for new devices in Intune every hour
2. Sends email notifications when new devices are enrolled
3. Automatically applies a security configuration to non-compliant devices

To use this flow:
1. Import the JSON into Power Automate
2. Update the HTTP connector URLs to point to your MCP server
3. Configure the Office 365 Outlook connector to use your email account
4. Save and enable the flow

## Creating your own clients

You can use the basic patterns in the example clients to create your own applications that interact with the MCP. The key components are:

1. Configuration (from environment variables)
2. Helper function for making API requests
3. Business logic that calls the MCP endpoints

Feel free to modify these examples or create new ones for your specific use cases.