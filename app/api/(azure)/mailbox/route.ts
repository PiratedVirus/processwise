import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getAccessToken } from '@/app/lib/msalUtils';
import { createResponse } from '@/app/lib/prismaUtils';

// Function to fetch emails (including those without attachments)
async function fetchEmails(accessToken: string, userEmail: string): Promise<any[]> {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    };
    // Fetch all emails with necessary fields, not just those with attachments
    const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(userEmail)}/messages?$select=id,sender,receivedDateTime,bodyPreview,subject,hasAttachments`;

    try {
        const response = await axios.get(url, config);
        return response.data.value;
    } catch (error) {
        console.error('Error fetching emails:', error);
        throw new Error('Failed to fetch emails');
    }
}

// Adjusted function to conditionally fetch attachment names if the email has attachments
async function fetchAttachmentNamesIfPresent(accessToken: string, messageId: string, hasAttachments: boolean): Promise<string[]> {
    if (!hasAttachments) {
        return []; // Return an empty array if the email has no attachments
    }

    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    };
    const url = `https://graph.microsoft.com/v1.0/users/tech@63qz7w.onmicrosoft.com/messages/${messageId}/attachments?$select=name`;

    try {
        const response = await axios.get(url, config);
        return response.data.value.map((attachment: { name: string }) => attachment.name);
    } catch (error) {
        console.error(`Error fetching attachments for message ${messageId}:`, error);
        throw new Error(`Failed to fetch attachments for message ${messageId}`);
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const { userEmail } = await req.json();
        if (!userEmail) {
            return createResponse(400, 'User email is required in the request body.');
        }

        const accessToken = await getAccessToken();
        const emails = await fetchEmails(accessToken, userEmail);

        // Process each email to fetch attachment names if present
        const emailsData = await Promise.all(emails.map(async (email: any) => {
            const attachmentNames = await fetchAttachmentNamesIfPresent(accessToken, email.id, email.hasAttachments);
            return {
                senderName: email.sender?.emailAddress?.name,
                senderEmail: email.sender?.emailAddress?.address,
                dateTime: email.receivedDateTime,
                subject: email.subject,
                bodyPreview: email.bodyPreview,
                attachmentNames,
            };
        }));

        return createResponse(200, emailsData);
    } catch (error) {
        console.error('Error in POST handler:', error);
        return createResponse(500, `An error occurred while processing the request: ${error}`);
    }
}
