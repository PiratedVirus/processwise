import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/database/connectMongo";
import { Customers } from "@/app/lib/database/models/Customers";
import { createResponse } from "@/app/lib/utils/prismaUtils";
import axios from "axios";
import {v4 as uuidv4} from 'uuid';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function convertItems(items: any[]): any {
    const result: any = {};

    items.forEach((item, index) => {
        const newItem = { ...item.valueObject };

        Object.keys(newItem).forEach((key) => {
            const newKey = `row-${index + 1}-${key}`;
            result[newKey] = newItem[key];
        });
    });

    return result;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(req.url);
    const rowId = searchParams.get('id');
    const customerName = searchParams.get('customer');
    const mailboxName = searchParams.get('mailbox');
    if (!customerName || !mailboxName || !rowId) {
        return createResponse(400, 'Missing required parameters');
    }
    try {
        const response = await axios.get(`${API_URL}/mails?id=${rowId}&customer=${customerName}&mailbox=${mailboxName}`);
        const mailData = response.data[0];
        const extractedData = mailData.extractedData.fields;
        const {Items, ...mailDataWithoutItems} = extractedData;
        const convertedItemsFromMail = convertItems(extractedData.Items.valueArray);
        const mailDataWithConvertedItems = { ...convertedItemsFromMail, ...mailDataWithoutItems };
    
        const mailRowdata = {
            mailDataWithoutItems,
            mailDataWithConvertedItems,
            convertedItemsFromMail,
            documentUrl: mailData.downloadURL
    
        }
    
        console.log('GET response extractedData:', mailRowdata);
        return createResponse(200, mailRowdata);  
    } catch (error) {
        console.error('Error fetching mailbox content:', error);
        return createResponse(500, 'Failed to fetch mailbox content');
    }

}

