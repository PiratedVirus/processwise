import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getAccessToken } from '@/app/lib/utils/msalUtils';
import { createResponse } from '@/app/lib/utils/prismaUtils';
import { put } from '@vercel/blob'

interface EmailAttachment {
    id: string;
    name: string;
    contentType: string;
    contentBytes?: string;
}


async function fetchEmails(accessToken: string, mailboxName: string): Promise<{ data: any[]; error?: string }> {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    };
    const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailboxName)}/messages?$orderby=receivedDateTime desc&$top=1&$select=id,sender,receivedDateTime,bodyPreview,subject,hasAttachments`;

    try {
        const response = await axios.get(url, config);
        const emailsWithAttachments = { data: response.data.value.filter((email: any) => email.hasAttachments) || []};
        return emailsWithAttachments;


    } catch (error) {
        console.error('Error fetching emails:', error);
        return { data: [], error: "Failed to fetch emails" };
    }
}

async function fetchAndDownloadPdfAttachments(accessToken: string, mailboxName: string, messageId: string, mailCount: number): Promise<{ data?: EmailAttachment[]; error?: string }> {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    };
    const url = `https://graph.microsoft.com/v1.0/users/${mailboxName}/messages/${messageId}/attachments`;

    try {
        const response = await axios.get(url, config);
        const attachments: any[] = response.data.value;

        // Filter to keep only PDF attachments
        const pdfAttachments = attachments.filter((attachment) => attachment.contentType === 'application/pdf');

        console.log(`Fetched successfully ${pdfAttachments.length} PDF attachments for Mail #`, mailCount);
        return { data: Array.isArray(pdfAttachments) ? pdfAttachments : [pdfAttachments] }; // Ensure data is always an array



    } catch (error) {
        console.error(`Error fetching attachments for message ${mailCount}:`, error);
        return { error: `Failed to fetch attachments for message ${messageId}` };
    }
}

async function uploadAttachmentToVercelBlob(attachment: EmailAttachment, customerName: string, mailboxName: string,): Promise<{ downloadURL?: string; error?: string }> {
    if (!attachment.contentBytes) {
        return { error: "Attachment content is missing" };
    }

    const contentBuffer = Buffer.from(attachment.contentBytes, 'base64');
    const blobName = attachment.name;

    try {
        const pathName = `${customerName}-${mailboxName}-${blobName}`;
        const blob = await put(pathName, contentBuffer, {
            contentType: 'application/pdf',
            access: 'public'
        })
        return { downloadURL: blob.url };
    } catch (error) {
        console.error(`Failed to upload attachment ${blobName} to Azure Blob Storage`, error);
        return { error: `Failed to upload attachment ${blobName}` };
    }


}

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(req.url);
        const mailboxName = searchParams.get('mailbox');
        const customerName = searchParams.get('customer');
        if (!mailboxName) {
            return createResponse(400, 'User email is required in the request body.');
        }

        const accessToken = await getAccessToken();
        const emails = await fetchEmails(accessToken, mailboxName);
        const modelId = 'newtekpotricolite2';
        const apiVersion = '2024-02-29-preview';

        const emailsData = await Promise.all(emails.data.map(async (email: any, index: number) => {
            const mailCount = index + 1;
            const { data: attachments, error: attachmentsError } = await fetchAndDownloadPdfAttachments(accessToken, mailboxName, email.id, mailCount);

            if (attachmentsError) {
                console.error(`Error with mail #${mailCount}: ${attachmentsError}`);
                return []; // Skip this email or handle the error as needed
            }

            const downloadURLPromises = attachments?.map(async (attachment: EmailAttachment) => {
                const { downloadURL, error } = await uploadAttachmentToVercelBlob(attachment, customerName || '', mailboxName || '');
                if (error) {
                    console.error(`Error uploading attachment for mail #${mailCount}: ${error}`);
                    return null; 
                }
                return downloadURL;
            }) ?? [];

            const downloadURLs = (await Promise.all(downloadURLPromises)).filter(url => url != null);
            console.log(`downloadURLs for mail# ${mailCount}:`, downloadURLs.join(','));

            return await Promise.all(downloadURLs.map(async (url, index) => {

                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/extract?model-id=${modelId}&api-version=${apiVersion}`, { documentURL: url });
                console.log('response:', response)
                return {
                    senderName: email.sender?.emailAddress?.name,
                    senderEmail: email.sender?.emailAddress?.address,
                    dateTime: email.receivedDateTime,
                    subject: email.subject,
                    bodyPreview: email.bodyPreview,
                    attachmentNames: attachments?.map(a => a.name),
                    downloadURL: url,
                    extractedData: response.data[0]
                };
            }));
        }));
        const filteredEmailsData = emailsData.flat().filter(data => data != null) as Record<string, unknown>[];
        return createResponse(200, filteredEmailsData);
    } catch (error) {
        return createResponse(500, `An error occurred while processing the request: ${error}`);
    }
}