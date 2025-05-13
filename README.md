# Microsoft Intune and Entra MCP

A Machine Callable Program (MCP) server for Microsoft Intune and Entra (Azure AD) management via Microsoft Graph API.

## Features

- User management (create, read, update, delete)
- Group management
- Device management
- Policy management (compliance, configuration)
- Application management
- Conditional access policy management

## Prerequisites

- Node.js 16 or higher
- Microsoft Entra ID (Azure AD) app registration with appropriate permissions

## Setup

1. Clone this repository
2. Install dependencies: `npm install`
3. Create a `.env` file with your configuration (see `.env.example`)
4. Run the server: `npm start`

## Environment Variables

```
CLIENT_ID=your-client-id
CLIENT_SECRET=your-client-secret
TENANT_ID=your-tenant-id
PORT=3000
```

## API Endpoints

Detailed API documentation is available in the `/docs` directory.

## License

MIT
