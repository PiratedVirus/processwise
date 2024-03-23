import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/database/connectMongo";
import { Customers } from "@/app/lib/database/models/Customers";
import { createResponse } from "@/app/lib/utils/prismaUtils";
import axios from "axios";


const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest): Promise<NextResponse> {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const customerName = searchParams.get('customer');
    const mailboxName = searchParams.get('mailbox');

    if (!customerName || !mailboxName || !API_URL) {
        return createResponse(400, 'Missing required parameters or environment variables');
    }

    let mailData;
    try {
        const { data } = await axios.get(`${API_URL}/mailbox-content?mailbox=${mailboxName}&customer=${customerName}`);
        mailData = data;
    } catch (error) {
        console.error('Error fetching mailbox content:', error);
        return createResponse(500, 'Failed to fetch mailbox content');
    }

    // Ensure the customer exists, or create a new one if not
    let customer = await Customers.findOneAndUpdate(
        { customerName: customerName },
        { $setOnInsert: { customerName: customerName, mailboxes: [{ mailboxName: mailboxName, mails: [] }] } },
        { upsert: true, new: true }
    );

    // Prepare mails for insertion
    const preparedMails = mailData.map((element: any) => ({
        ...element,
        customerName: customerName,
        mailboxName: mailboxName,
        mailStatus: 'Unprocessed',
    }));

    // Directly update the customer to add mails to the specific mailbox
    await Customers.updateOne(
        { _id: customer._id, "mailboxes.mailboxName": mailboxName },
        { $push: { "mailboxes.$.mails": { $each: preparedMails } } }
    );

    console.log(`Mails added successfully to mailbox: ${mailboxName} for customer: ${customerName}`);
    return createResponse(200, `Mails added successfully to mailbox: ${mailboxName} for customer: ${customerName}`);
}

export async function GET(req: NextRequest): Promise<NextResponse> {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const customerName = searchParams.get('customer');
    const mailboxName = searchParams.get('mailbox');

    if (!customerName || !mailboxName) {
        return createResponse(400, 'Missing required parameters');
    }

    try {
        const customer = await Customers.findOne({ customerName: customerName });
        if (!customer) {
            return createResponse(404, 'Customer not found');
        }

        const mailbox = customer.mailboxes.find((mb:any) => mb.mailboxName === mailboxName);
        if (!mailbox) {
            return createResponse(404, 'Mailbox not found');
        }
        // console.log("mailbox.mails", mailbox.mails)
        return createResponse(200, mailbox.mails);
    } catch (error) {
        console.error('Error fetching mails:', error);
        return createResponse(500, 'Failed to fetch mails');
    }
}

