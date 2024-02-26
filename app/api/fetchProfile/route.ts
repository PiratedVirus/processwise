// app/routes/api/fetchProfile.ts

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { ConfidentialClientApplication, Configuration } from '@azure/msal-node';

// MSAL configuration
const msalConfig: Configuration = {
  auth: {
    clientId: process.env.AZURE_AD_CLIENT_ID ?? '',
    authority: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}`,
    clientSecret: process.env.AZURE_AD_CLIENT_SECRET ?? '',
  },
};

const cca = new ConfidentialClientApplication(msalConfig);

// Function to get access token
async function getAccessToken(): Promise<string> {
  const tokenRequest = {
    scopes: ['https://graph.microsoft.com/.default'],
  };

  try {
    const response = await cca.acquireTokenByClientCredential(tokenRequest);
    if (!response || !response.accessToken) {
      throw new Error('Failed to acquire access token');
    }
    return response.accessToken;
  } catch (error) {
    console.error('Error acquiring access token', error);
    throw new Error('Error acquiring access token');
  }
}

// Interface for the user profile - adjust according to your needs
interface UserProfile {
  displayName?: string;
  mail?: string;
  userPrincipalName?: string;
}

// Function to fetch user profile from Microsoft Graph
async function fetchUserProfile(userEmail: string): Promise<UserProfile> {
  const accessToken = await getAccessToken();
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const url = `https://graph.microsoft.com/v1.0/users/${userEmail}`;
  const response = await axios.get<UserProfile>(url, config);
  return response.data;
}

// POST handler
export async function POST(req: NextRequest) {
  try {
    const { userEmail } = await req.json();
    if (!userEmail) {
      return new NextResponse(JSON.stringify({ error: 'User email is required in the request body.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const profile = await fetchUserProfile(userEmail);
    return new NextResponse(JSON.stringify(profile), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error in POST handler:', error);
    return new NextResponse(JSON.stringify({ error: 'An error occurred while fetching the user profile.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Optionally, handle GET requests or other methods
export function GET() {
  console.log('GET request received');
  // Example response for GET requests
  return new NextResponse('GET request method not supported.', { status: 405 });
}
