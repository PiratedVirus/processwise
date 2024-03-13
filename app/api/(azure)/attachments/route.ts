// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
const { 
  BlobServiceClient, 
  generateAccountSASQueryParameters, 
  AccountSASPermissions, 
  AccountSASServices,
  AccountSASResourceTypes,
  StorageSharedKeyCredential,
  SASProtocol,
  BlobSASPermissions 
} = require('@azure/storage-blob');
import axios from 'axios';
import { getAccessToken } from '@/app/lib/msalUtils';
import { createResponse } from '@/app/lib/prismaUtils';
import { parseISO } from 'date-fns';
import { create } from 'domain';
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING || '';

const constants = {
  accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME,
  accountKey: process.env.AZURE_STORAGE_ACCOUNT_KEY
};
const sharedKeyCredential = new StorageSharedKeyCredential(
  constants.accountName,
  constants.accountKey
);
async function createAccountSas() {
  const sasOptions = {
    services: AccountSASServices.parse("btqf").toString(),          // blobs, tables, queues, files
    resourceTypes: AccountSASResourceTypes.parse("sco").toString(), // service, container, object
    permissions: AccountSASPermissions.parse("rwdlacupi"),          // permissions
    protocol: SASProtocol.Https,
    startsOn: new Date(),
    expiresOn: new Date(new Date().valueOf() + (10 * 60 * 1000)),   // 10 minutes
  };

  const sasToken = generateAccountSASQueryParameters(sasOptions, sharedKeyCredential).toString();

  // console.log(`sasToken = '${sasToken}'\n`);

  return sasToken.startsWith('?') ? sasToken : `?${sasToken}`;
}

interface EmailAttachment {
  id: string;
  name: string;
  contentType: string;
  contentBytes?: string;
}

async function fetchEmailsWithAttachments(userEmail: string, accessToken: string): Promise<any[]> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
   // Replace with actual user email
  const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(userEmail)}/messages?$filter=hasAttachments eq true&$select=id`;

  try {
    const response = await axios.get(url, config);
    return response.data.value;
  } catch (error) {
    console.error('Error fetching emails with attachments:', error);
    return createResponse(500, `Failed to fetch emails with attachments: ${error}`);
  }
}

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
    return createResponse(500, `Failed to fetch attachments for message ${messageId}: ${error}`);
  }
}

async function uploadAttachmentToAzureBlob(attachment: EmailAttachment): Promise<string> {
  if (!attachment.contentBytes) {
    console.log(`Attachment content for ${attachment.name} is missing or undefined`)
    return createResponse(400, `Attachment content for ${attachment.name} is missing or undefined`);
  }

  const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  console.log('blobServiceClient ->', blobServiceClient);
  const containerName = 'invoices'; // Ensure this container exists in Azure Blob Storage
  const containerClient = blobServiceClient.getContainerClient(containerName);
  console.log('containerClient ->', containerClient);
  const attachmentContentString = (attachment.contentBytes).toString() || '';
  const contentBuffer = Buffer.from(attachmentContentString, 'base64');
  console.log('contentBuffer ->', contentBuffer);

  const blobName = attachment.name;

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  console.log('blockBlobClient ->', blockBlobClient);

  try {
    await blockBlobClient.upload(contentBuffer, contentBuffer.length);
    console.log(`Attachment ${blobName} uploaded to Blob storage successfully`);

    const sasToken = await createAccountSas(); // Ensure this is awaited properly

    const attachmentDownloadURL = blockBlobClient.url + sasToken;
    console.log('attachmentDownloadURL', attachmentDownloadURL);
    return attachmentDownloadURL;
  } catch (error) {
    console.error(`Failed to upload attachment ${blobName} to Azure Blob Storage`, error);
    return createResponse(500, `Failed to upload attachment ${blobName}`);
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get('user');
    if (!userEmail) {
        return createResponse(400, 'User email is required in the request body.');
    }
    const accessToken = await getAccessToken();
    const emails = await fetchEmailsWithAttachments(userEmail, accessToken);
    if (emails.length > 0) {
      for (const email of emails) {
        const messageId = email.id;
        const attachments = await fetchAndDownloadAttachments(accessToken, messageId);
    
        for (const attachment of attachments) {
          console.log('Downloading attachment:', attachment.name);
          await uploadAttachmentToAzureBlob(attachment);
        }
    
        console.log(`Downloaded attachments for message ${messageId}:`);
      }
    
      return createResponse(200, { message: `Downloaded attachments for all messages` });
    } else {
      return createResponse(404, { message: 'No emails with attachments found.' });
    }
  } catch (error) {
    console.error('Error in POST method:', error);
    return createResponse(500, `An error occurred: ${error}`);
  }
}
