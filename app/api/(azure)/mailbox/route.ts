import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getAccessToken } from '@/app/lib/msalUtils';
import { createResponse } from '@/app/lib/prismaUtils';

const {
    BlobServiceClient, 
    generateAccountSASQueryParameters, 
    AccountSASPermissions, 
    AccountSASServices,
    AccountSASResourceTypes,
    StorageSharedKeyCredential,
    SASProtocol,
    BlobSASPermissions,
} = require('@azure/storage-blob');

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING || '';

const constants = {
    accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME,
    accountKey: process.env.AZURE_STORAGE_ACCOUNT_KEY,
};

const sharedKeyCredential = new StorageSharedKeyCredential(constants.accountName, constants.accountKey);

async function createAccountSas(): Promise<string> {
    const sasOptions = {
        services: AccountSASServices.parse("btqf").toString(),
        resourceTypes: AccountSASResourceTypes.parse("sco").toString(),
        permissions: AccountSASPermissions.parse("rwdlacupi"),
        protocol: SASProtocol.Https,
        startsOn: new Date(),
        expiresOn: new Date(new Date().valueOf() + (10 * 60 * 1000)),
    };

    const sasToken = generateAccountSASQueryParameters(sasOptions, sharedKeyCredential).toString();
    return sasToken.startsWith('?') ? sasToken : `?${sasToken}`;
}

interface EmailAttachment {
    id: string;
    name: string;
    contentType: string;
    contentBytes?: string;
}

async function fetchEmails(accessToken: string, userEmail: string): Promise<{ data: any[]; error?: string }> {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    };
    const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(userEmail)}/messages?$filter=hasAttachments eq true&$select=id,sender,receivedDateTime,bodyPreview,subject,hasAttachments`;

    try {
        const response = await axios.get(url, config);
        return { data: response.data.value || [] };
    } catch (error) {
        console.error('Error fetching emails:', error);
        return { data: [], error: "Failed to fetch emails" };
    }
}

async function fetchAndDownloadAttachments(accessToken: string, messageId: string, mailCount: number): Promise<{ data?: EmailAttachment[]; error?: string }> {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    };
    const url = `https://graph.microsoft.com/v1.0/users/tech@63qz7w.onmicrosoft.com/messages/${messageId}/attachments`;

    try {
        const response = await axios.get(url, config);
        console.log('Fetched successfully for Mail #', mailCount);
        return { data: Array.isArray(response.data.value) ? response.data.value : [response.data.value] }; // Ensure data is always an array
    } catch (error) {
        console.error(`Error fetching attachments for message ${mailCount}:`, error);
        return { error: `Failed to fetch attachments for message ${messageId}` };
    }
}

async function uploadAttachmentToAzureBlob(attachment: EmailAttachment): Promise<{ downloadURL?: string; error?: string }> {
    if (!attachment.contentBytes) {
        return { error: "Attachment content is missing" };
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    const containerName = 'invoices'; // Ensure this container exists in your Azure Blob Storage
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const contentBuffer = Buffer.from(attachment.contentBytes, 'base64');
    const blobName = attachment.name;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
        await blockBlobClient.uploadData(contentBuffer, contentBuffer.length);
        const sasToken = await createAccountSas();
        const attachmentDownloadURL = blockBlobClient.url + sasToken;
        console.log('attachmentDownloadURL', attachmentDownloadURL);
        return { downloadURL: attachmentDownloadURL };
    } catch (error) {
        console.error(`Failed to upload attachment ${blobName} to Azure Blob Storage`, error);
        return { error: `Failed to upload attachment ${blobName}` };
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

        const emailsData = await Promise.all(emails.data.map(async (email: any, index: number) => {
            const mailCount = index + 1;
            const { data: attachments, error: attachmentsError } = await fetchAndDownloadAttachments(accessToken, email.id, mailCount);

            if (attachmentsError) {
                console.error(`Error with mail #${mailCount}: ${attachmentsError}`);
                return null; // Skip this email or handle the error as needed
            }

            const downloadURLPromises = attachments?.map(async (attachment: EmailAttachment) => {
              const { downloadURL, error } = await uploadAttachmentToAzureBlob(attachment);
              if (error) {
                console.error(`Error uploading attachment for mail #${mailCount}: ${error}`);
                return null; // Handle as needed
              }
              return downloadURL;
            }) ?? [];

            const downloadURLs = (await Promise.all(downloadURLPromises)).filter(url => url != null);
            console.log(`downloadURLs for mail# ${mailCount}:`, downloadURLs.join(','));

            // Example of proceeding with extractedData, adjust as needed
            // const extractedData = await someExtractionFunction(downloadURLs);
            // console.log('extractedData', extractedData);

            return {
                senderName: email.sender?.emailAddress?.name,
                senderEmail: email.sender?.emailAddress?.address,
                dateTime: email.receivedDateTime,
                subject: email.subject,
                bodyPreview: email.bodyPreview,
                attachmentNames: attachments?.map(a => a.name),
                downloadURLs, // This will now contain all resolved download URLs
                // extractedData: extractedData
            };
        }));

        const filteredEmailsData = emailsData.filter(data => data != null) as Record<string, unknown>[];
        return createResponse(200, filteredEmailsData);
    } catch (error) {
        console.error('Error in POST handler:', error);
        return createResponse(500, `An error occurred while processing the request: ${error}`);
    }
}
