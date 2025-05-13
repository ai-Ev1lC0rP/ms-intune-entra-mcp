# Microsoft Intune and Entra MCP Usage Guide

This guide provides instructions on how to set up and use the Microsoft Intune and Entra MCP (Machine Callable Program).

## Prerequisites

Before using this MCP, you need:

1. An Azure subscription with administrative access
2. Permissions to create app registrations in Microsoft Entra ID (Azure AD)
3. Node.js 16 or higher installed

## Setting Up Microsoft Entra ID App Registration

1. Sign in to the [Azure Portal](https://portal.azure.com)
2. Navigate to **Microsoft Entra ID** (formerly Azure Active Directory)
3. Select **App registrations** and click **New registration**
4. Provide the following details:
   - Name: `Intune-Entra-MCP`
   - Supported account types: `Accounts in this organizational directory only`
   - Redirect URI: (Web) `http://localhost:3000/auth/callback`
5. Click **Register**

### Configuring API Permissions

1. In your newly created app registration, navigate to **API permissions**
2. Click **Add a permission**
3. Select **Microsoft Graph**
4. Choose **Application permissions**
5. Add the following permissions:
   - `Device.Read.All`
   - `Device.ReadWrite.All`
   - `DeviceManagementApps.Read.All`
   - `DeviceManagementApps.ReadWrite.All`
   - `DeviceManagementConfiguration.Read.All`
   - `DeviceManagementConfiguration.ReadWrite.All`
   - `DeviceManagementManagedDevices.Read.All`
   - `DeviceManagementManagedDevices.ReadWrite.All`
   - `Directory.Read.All`
   - `Directory.ReadWrite.All`
   - `Group.Read.All`
   - `Group.ReadWrite.All`
   - `Policy.Read.All`
   - `Policy.ReadWrite.ConditionalAccess`
   - `User.Read.All`
   - `User.ReadWrite.All`
6. Click **Add permissions**
7. Click **Grant admin consent for [Your Tenant]**

### Creating a Client Secret

1. In your app registration, navigate to **Certificates & secrets**
2. Under **Client secrets**, click **New client secret**
3. Provide a description and select an expiration period
4. Click **Add**
5. **IMPORTANT**: Copy the secret value immediately and store it securely. You will not be able to view it again.

## Deployment Options

### Local Deployment

1. Clone the repository
   ```
   git clone https://github.com/ai-Ev1lC0rP/ms-intune-entra-mcp.git
   cd ms-intune-entra-mcp
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file using the `.env.example` template
   ```
   cp .env.example .env
   ```

4. Edit the `.env` file with your app registration details
   ```
   CLIENT_ID=your-client-id
   CLIENT_SECRET=your-client-secret
   TENANT_ID=your-tenant-id
   PORT=3000
   ```

5. Start the server
   ```
   npm start
   ```

### Docker Deployment

1. Clone the repository
   ```
   git clone https://github.com/ai-Ev1lC0rP/ms-intune-entra-mcp.git
   cd ms-intune-entra-mcp
   ```

2. Create a `.env` file using the `.env.example` template
   ```
   cp .env.example .env
   ```

3. Edit the `.env` file with your app registration details

4. Build and start the Docker container
   ```
   docker-compose up -d
   ```

## Using the MCP API

### Examples

#### List all users

```bash
curl -X GET http://localhost:3000/users
```

#### Get a specific user

```bash
curl -X GET http://localhost:3000/users/john.doe@example.com
```

#### Create a new user

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "Jane Smith",
    "userPrincipalName": "jane.smith@example.com",
    "mailNickname": "jsmith",
    "accountEnabled": true,
    "passwordProfile": {
      "forceChangePasswordNextSignIn": true,
      "password": "StrongP@ssw0rd!"
    }
  }'
```

#### List all devices

```bash
curl -X GET http://localhost:3000/devices
```

#### List all conditional access policies

```bash
curl -X GET http://localhost:3000/conditional-access-policies
```

## Error Handling

The API returns standard HTTP status codes:

- `200 OK`: Request successful
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Authentication failed
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Error responses include an error message in the response body:

```json
{
  "error": "Error message details"
}
```

## Troubleshooting

### Common Issues

1. **Authentication failed**: Verify your CLIENT_ID, CLIENT_SECRET, and TENANT_ID in the .env file.

2. **Insufficient permissions**: Ensure your app registration has all the required permissions and admin consent has been granted.

3. **API errors**: Check the server logs for detailed error messages from the Microsoft Graph API.

## Security Considerations

- Store your client secret securely
- Use HTTPS in production environments
- Implement proper authentication for the MCP API in production
- Regularly rotate your client secrets
- Use the principle of least privilege when assigning permissions

## API Documentation

For detailed API documentation, refer to the OpenAPI specification in the `docs/openapi.json` file or browse the API documentation at `http://localhost:3000/docs` when the server is running.

## Support

For issues, questions, or contributions, please open an issue on the GitHub repository.