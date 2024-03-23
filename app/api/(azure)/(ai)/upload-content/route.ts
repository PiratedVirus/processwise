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

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(req.url);
        const mailboxName = searchParams.get('mailbox');
        const customerName = searchParams.get('customer');
        const uploaderName = searchParams.get('uploader');
        const documentURL = searchParams.get('documentURL');
        if (!mailboxName) {
            return createResponse(400, 'User email is required in the request body.');
        }


        const modelId = 'newtekpotricolite2';
        const apiVersion = '2024-02-29-preview';


        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/extract?model-id=${modelId}&api-version=${apiVersion}`, { documentURL: documentURL });
        console.log('[UPLOAD] response from upload-content:', response)
        const documentData = [{
            senderName: uploaderName,
            senderEmail: 'Manual Upload',
            dateTime: new Date(),
            subject: 'Manual Upload',
            bodyPreview: 'Manual Upload',
            attachmentNames: [],
            downloadURL: documentURL,
            extractedData: response.data[0]
        }];
 
        // const filteredEmailsData = documentData.flat().filter((data: Record<string, unknown>) => data != null) as Record<string, unknown>[];
        return createResponse(200, documentData);
    } catch (error) {
        return createResponse(500, `An error occurred while processing the request: ${error}`);
    }
}