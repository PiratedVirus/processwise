import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getAccessToken } from '@/app/lib/msalUtils';
import { createResponse } from '@/app/lib/prismaUtils';

interface InvitationData {
  [key: string]: any; // Define more specific types as needed
}

async function sendUserInvitation(invitationData: InvitationData): Promise<any> {
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
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const invitationData = await req.json();
    if (!invitationData) {
      return createResponse(400, "Required invitation data is missing in the request body.");
    }

    const invitationResponse = await sendUserInvitation(invitationData);
    return createResponse(200, invitationResponse);
  } catch (error) {
    console.error('Error sending user invitation', error);
    return createResponse(500, `An error occurred while sending the user invitation: ${error}`);
  }
}
