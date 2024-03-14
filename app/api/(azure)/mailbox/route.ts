import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getAccessToken } from '@/app/lib/msalUtils';
import { createResponse } from '@/app/lib/prismaUtils';
export const runtime = 'nodejs';
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

  const sasToken = generateAccountSASQueryParameters(
      sasOptions,
      sharedKeyCredential 
  ).toString();

//   console.log(`sasToken = '${sasToken}'\n`);

  // prepend sasToken with `?`
  return (sasToken[0] === '?') ? sasToken : `?${sasToken}`;
}

interface EmailAttachment {
  id: string;
  name: string;
  contentType: string;
  contentBytes?: string; // This might not be needed for the initial fetch
}

// Function to fetch emails (including those without attachments)
async function fetchEmails(accessToken: string, userEmail: string): Promise<{data: any[], error?: string}> {
  const config = {
      headers: {
          Authorization: `Bearer ${accessToken}`,
      },
  };
  const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(userEmail)}/messages?$filter=hasAttachments eq true&$select=id,sender,receivedDateTime,bodyPreview,subject,hasAttachments`;

  try {
      const response = await axios.get(url, config);
      return { data: response.data.value || [] }; // Ensure data is never undefined
  } catch (error) {
      console.error('Error fetching emails:', error);
      return { data: [], error: "Failed to fetch emails" };
  }
}

async function fetchAttachmentNamesIfPresent(accessToken: string, messageId: string, hasAttachments: boolean): Promise<{data?: any[], error?: string}> {
    if (!hasAttachments) {
      return { error: "Attachment content is missing" };
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
        return { error: `Failed to fetch attachments for message ${messageId}` };

    }
}

async function fetchAndDownloadAttachments(accessToken: string, messageId: string): Promise<{data?: EmailAttachment[], error?: string}> {
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
      return { error: `Failed to fetch attachments for message ${messageId}` };

    }
  }
  
async function uploadAttachmentToAzureBlob(attachment: EmailAttachment): Promise<{ downloadURL?: string; error?: string }> {
if (!attachment.contentBytes) {
    return {error: "Attachment content is missing"};
}

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerName = 'invoices'; // Ensure this container exists in your Azure Blob Storage
const containerClient = blobServiceClient.getContainerClient(containerName);

const contentBuffer = Buffer.from(attachment.contentBytes, 'base64');
const blobName = attachment.name;
const blockBlobClient = containerClient.getBlockBlobClient(blobName);
// console.log('blockBlobClient', blockBlobClient.url)

try {
    await blockBlobClient.uploadData(contentBuffer, contentBuffer.length);
    // console.log(`Attachment ${blobName} uploaded to Blob storage successfully`);

    // Generate SAS token for the blob
    const sasToken = await createAccountSas(); // Make sure to await the async function call

    // Return the blob URL with the SAS token
    const attachmentDownloadURL = blockBlobClient.url + sasToken;
    // console.log('attachmentDownloadURL', attachmentDownloadURL)
    return attachmentDownloadURL; // Ensure proper concatenation
} catch (error) {
    console.error(`Failed to upload attachment ${blobName} to Azure Blob Storage`, error);
    return {error: `Failed to upload attachment ${blobName}`};
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
        const emails = await fetchEmails(accessToken, userEmail);


        // Process each email to fetch attachment names if present
        const emailsData = await Promise.all(emails?.data.map(async (email: any) => {
            const attachmentNames = await fetchAttachmentNamesIfPresent(accessToken, email.id, email.hasAttachments);
            
            // Ensure attachments are fetched only if present
            let attachments: any = [];
            if (email.hasAttachments) {
                attachments = await fetchAndDownloadAttachments(accessToken, email.id);
            }
            
            const downloadURLPromises = attachments.map(async (attachment: any) => {
                return uploadAttachmentToAzureBlob(attachment); // This returns a promise
            });
            
            // Wait for all download URL promises to resolve
            const downloadURLs = await Promise.all(downloadURLPromises);
            console.log('downloadURLs', downloadURLs);

            const extractedData = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/extract?model-id=newtekapimodel&api-version=2023-10-31-preview`, {documentURL: downloadURLs[0]});
            console.log('extractedData', extractedData.data[0]);
            return {
                senderName: email.sender?.emailAddress?.name,
                senderEmail: email.sender?.emailAddress?.address,
                dateTime: email.receivedDateTime,
                subject: email.subject,
                bodyPreview: email.bodyPreview,
                attachmentNames,
                downloadURLs, // This will now contain all resolved download URLs
                extractedData: extractedData.data[0]
            };
        }));
        

        return createResponse(200, emailsData);
    } catch (error) {
        console.error('Error in POST handler:', error);
        return createResponse(500, `An error occurred while processing the request: ${error}`);
    }
}