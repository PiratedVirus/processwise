// Assuming this is in a Next.js API route file like pages/api/downloadAttachments.ts

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getAccessToken } from '@/app/lib/msalUtils';
import { createResponse } from '@/app/lib/prismaUtils';
import fs from 'fs';
import path from 'path';



interface EmailAttachment {
  id: string;
  name: string;
  contentType: string;
  contentBytes?: string; // This might not be needed for the initial fetch
}

// Function to fetch emails with attachments
async function fetchEmailsWithAttachments(accessToken: string): Promise<any[]> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const userEmail = 'tech@63qz7w.onmicrosoft.com'; // Replace with the actual user email
  const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(userEmail)}/messages?$filter=hasAttachments eq true&$select=id`;

  try {
    const response = await axios.get(url, config);
    return response.data.value;
  } catch (error) {
    console.error('Error fetching emails with attachments:', error);
    throw new Error('Failed to fetch emails with attachments');
  }
}

// Function to fetch and download attachments for a given message
async function fetchAndDownloadAttachments(accessToken: string, messageId: string): Promise<EmailAttachment[]> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const url = `https://graph.microsoft.com/v1.0/users/tech@63qz7w.onmicrosoft.com/messages/${messageId}/attachments`;

  try {
    const response = await axios.get(url, config);
    return response.data.value;
  } catch (error) {
    console.error(`Error fetching attachments for message ${messageId}:`, error);
    throw new Error(`Failed to fetch attachments for message ${messageId}`);
  }
}

async function saveAttachmentToFile(attachment: EmailAttachment) {
    if (!attachment.contentBytes) return;
  
    // Convert base64 encoded content to binary
    const contentBuffer = Buffer.from(attachment.contentBytes, 'base64');
    
    // Define the path where the file will be saved
    const attachmentsDirPath = path.resolve('./app/public/attachments');
    const filePath = path.join(attachmentsDirPath, attachment.name);
  
    // Ensure the attachments directory exists, create it if it doesn't
    if (!fs.existsSync(attachmentsDirPath)) {
      fs.mkdirSync(attachmentsDirPath, { recursive: true });
    }
  
    // Save the file
    fs.writeFileSync(filePath, contentBuffer);
  
    console.log(`Attachment saved to ${filePath}`);
  }


export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const accessToken = await getAccessToken();
    const emails = await fetchEmailsWithAttachments(accessToken);

    // Assuming you want to download attachments for the first email found
    if (emails.length > 0) {
      const messageId = emails[0].id;
      const attachments = await fetchAndDownloadAttachments(accessToken, messageId);

      // Here you would add logic to handle the attachment data, e.g., saving it to a database or a file system
      // Example usage within your fetchAndDownloadAttachments function or similar
      attachments.forEach(async (attachment) => {
            await saveAttachmentToFile(attachment);
        });
      console.log(`Downloaded attachments for message ${messageId}:`, attachments);

      return createResponse(200, { message: `Downloaded attachments for message ${messageId}` });
    } else {
      return createResponse(404, { message: 'No emails with attachments found.' });
    }
  } catch (error) {
    console.error('Error in POST method:', error);
    return createResponse(500, `An error occurred: ${error}`);
  }
}
