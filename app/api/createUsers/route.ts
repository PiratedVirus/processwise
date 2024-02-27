import axios from 'axios';
import { ConfidentialClientApplication, Configuration } from '@azure/msal-node';
import { NextResponse, NextRequest } from 'next/server';

// Utility function to create responses
const createResponse = (status: number, message: string | Record<string, unknown>) => {
    return new NextResponse(JSON.stringify(typeof message === 'string' ? { error: message } : message), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
  };

// MSAL configuration with explicit type
const msalConfig: Configuration = {
  auth: {
    clientId: process.env.AZURE_AD_CLIENT_ID ?? '',
    authority: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID ?? ''}`,
    clientSecret: process.env.AZURE_AD_CLIENT_SECRET ?? '',
  },
};
const cca = new ConfidentialClientApplication(msalConfig);

// Function to get access token with added type for response
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

interface InvitationData {
  [key: string]: any;
}

async function sendUserInvitation(invitationData: InvitationData): Promise<any> {
  try {
    const accessToken = await getAccessToken();
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    };

    const url = 'https://graph.microsoft.com/v1.0/invitations';
    const response = await axios.post(url, invitationData, config);
    return response.data;
  } catch (error) {
    console.error('Error sending user invitation', error);
    throw new Error('Error sending user invitation');
  }
}



export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const invitationData  = await req.json(); 
        if (!invitationData) {
            return createResponse(400, "Required invitation data is missing in the request body.");
        }
        
        const invitationResponse = await sendUserInvitation(invitationData);
        return createResponse(200, invitationResponse);
    } catch (error) {
        return createResponse(500, "An error occurred while sending the user invitation.");
    }
}
