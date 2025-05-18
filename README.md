# Microsoft Intune and Entra MCP

A Machine Callable Program (MCP) server for Microsoft Intune and Entra (Azure AD) management via Microsoft Graph API.

## Features

- **User Management**:
  - List, create, read, update, and delete users
  - Manage user attributes, account status, and security properties

- **Group Management**:
  - List, create, read, update, and delete groups
  - Manage group membership and attributes

- **Device Management**:
  - View all managed devices and their details
  - Perform device operations (wipe, restart, etc.)
  - Get device compliance status
  - Apply configurations to devices

- **Policy Management**:
  - Manage device compliance policies
  - Manage device configuration profiles
  - Configure security settings

- **Application Management**:
  - View and manage mobile applications
  - Configure app protection policies

- **Conditional Access**:
  - View, create, update, and delete conditional access policies
  - Define authentication requirements based on conditions

## Prerequisites

- Node.js 16 or higher
- Microsoft Entra ID (Azure AD) app registration with appropriate permissions

## Quick Start

### Setup and Configuration

1. **Clone this repository**
   ```
   git clone https://github.com/ai-Ev1lC0rP/ms-intune-entra-mcp.git
   cd ms-intune-entra-mcp
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Create a Microsoft Entra ID app registration**
   - Follow the instructions in the [docs/USAGE.md](docs/USAGE.md) file to create and configure an app registration with the necessary permissions

4. **Configure environment variables**
   ```
   cp .env.example .env
   ```
   Edit the `.env` file with your app registration details:
   ```
   CLIENT_ID=your-client-id
   CLIENT_SECRET=your-client-secret
   TENANT_ID=your-tenant-id
   PORT=3000
   ```

5. **Start the server**
   ```
   npm start
   ```

### Docker Deployment

1. **Build and start with Docker Compose**
   ```
   docker-compose up -d
   ```

## API Documentation

The API follows REST principles and supports the following operations:

- **GET** - Retrieve resources
- **POST** - Create resources
- **PATCH** - Update resources
- **DELETE** - Remove resources

Detailed API documentation is available in the [/docs/openapi.json](docs/openapi.json) file, which follows the OpenAPI 3.0 specification.

## Examples

Example clients demonstrating how to use the MCP API are available in the `/examples` directory:

- **Node.js client**: [examples/client.js](examples/client.js)
- **Python client**: [examples/python_client.py](examples/python_client.py)
- **Power Automate flow**: [examples/power-automate-new-device-flow.json](examples/power-automate-new-device-flow.json)

See the [examples/README.md](examples/README.md) file for more information on how to use these examples.

## Usage Guide

For detailed instructions on how to set up, configure, and use the MCP, see the [docs/USAGE.md](docs/USAGE.md) file.

## Architecture

This MCP server follows a simple architecture:

1. **Authentication**: Uses client credentials flow to authenticate with Microsoft Graph API
2. **API Layer**: RESTful API endpoints for various Intune and Entra resources
3. **Graph API Integration**: Makes authenticated requests to Microsoft Graph API
4. **Response Handling**: Formats responses for consistent client consumption

## Security Considerations

- Always use HTTPS in production environments
- Store client secrets securely
- Regularly rotate client secrets
- Implement proper authentication in front of the MCP API in production
- Use the principle of least privilege when assigning Microsoft Graph API permissions

## Development

1. **Install development dependencies**
   ```
   npm install --include=dev
   ```

2. **Run in development mode** (with auto-restart on file changes)
   ```
   npm run dev
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.