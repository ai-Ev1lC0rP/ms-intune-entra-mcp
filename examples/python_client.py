#!/usr/bin/env python3
import os
import json
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
MCP_BASE_URL = os.getenv("MCP_BASE_URL", "http://localhost:3000")

# Helper function to make API requests to the MCP
def call_mcp(method, endpoint, data=None):
    """
    Make an API request to the MCP
    
    Args:
        method (str): HTTP method (get, post, patch, delete)
        endpoint (str): API endpoint
        data (dict, optional): Request payload for POST, PATCH, PUT
        
    Returns:
        dict: Response data
    """
    url = f"{MCP_BASE_URL}{endpoint}"
    headers = {"Content-Type": "application/json"}
    
    try:
        if method.lower() == "get":
            response = requests.get(url, headers=headers)
        elif method.lower() == "post":
            response = requests.post(url, headers=headers, json=data)
        elif method.lower() == "patch":
            response = requests.patch(url, headers=headers, json=data)
        elif method.lower() == "delete":
            response = requests.delete(url, headers=headers)
        else:
            raise ValueError(f"Unsupported HTTP method: {method}")
        
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error calling MCP API ({method} {endpoint}): {str(e)}")
        if hasattr(e, "response") and e.response is not None:
            try:
                error_data = e.response.json()
                print(f"Error details: {json.dumps(error_data, indent=2)}")
            except:
                print(f"Status code: {e.response.status_code}")
                print(f"Response text: {e.response.text}")
        raise

def main():
    try:
        # Check MCP health
        print("Checking MCP health...")
        health = call_mcp("get", "/health")
        print(f"MCP health: {json.dumps(health, indent=2)}")
        
        # Example 1: List all users
        print("\nListing all users...")
        users = call_mcp("get", "/users")
        print(f"Found {len(users.get('value', []))} users:")
        for user in users.get("value", []):
            print(f"- {user.get('displayName')} ({user.get('userPrincipalName')})")
        
        # Example 2: List all devices
        print("\nListing all devices...")
        devices = call_mcp("get", "/devices")
        print(f"Found {len(devices.get('value', []))} devices:")
        for device in devices.get("value", []):
            print(f"- {device.get('deviceName')} | OS: {device.get('operatingSystem')} {device.get('osVersion')} | Compliance: {device.get('complianceState')}")
        
        # Example 3: List all conditional access policies
        print("\nListing all conditional access policies...")
        policies = call_mcp("get", "/conditional-access-policies")
        print(f"Found {len(policies.get('value', []))} policies:")
        for policy in policies.get("value", []):
            print(f"- {policy.get('displayName')} | State: {policy.get('state')}")
        
    except Exception as e:
        print(f"Error in main function: {str(e)}")

if __name__ == "__main__":
    main()