import { NextRequest } from 'next/server';
import axios from 'axios';
import { getAccessToken } from '@/app/lib/msalUtils';
import { createResponse } from '@/app/lib/prismaUtils';

export async function POST(req: NextRequest) {
  try {
    const { userEmail } = await req.json();
    if (!userEmail) {
      return createResponse(400, 'User email is required in the request body.');
    }

    const accessToken = await getAccessToken();
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const url = `https://graph.microsoft.com/v1.0/users/${userEmail}`;
    const response = await axios.get(url, config);

    return createResponse(200, response.data);
  } catch (error) {
    console.error('Error in POST handler:', error);
    return createResponse(500, 'An error occurred while fetching the user profile: ' + error);
  }
}
