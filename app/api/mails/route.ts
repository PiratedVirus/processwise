import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/database/connectMongo";
import { Customers } from "@/app/lib/database/models/Customers";
import { createResponse } from "@/app/lib/utils/prismaUtils";
import axios from "axios";
import {v4 as uuidv4} from 'uuid';
import { NextApiRequest, NextApiResponse } from "next";


const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest): Promise<NextResponse> {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const customerName = searchParams.get('customer');
    const mailboxName = searchParams.get('mailbox');
 
    if (!customerName || !mailboxName || !API_URL) {
        return createResponse(400, 'Missing required parameters or environment variables');
    }
    const aiModelUrl = `${API_URL}/mailbox-content?mailbox=${mailboxName}&customer=${customerName}`;

    let mailData;
    try {
        const {data} = await axios.get(aiModelUrl);
        mailData = data;
        console.log('Mail data:', mailData);
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
        rowId: uuidv4()
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
    const mailKey = searchParams.get('id');

    if (!customerName || !mailboxName) {
        return createResponse(400, 'Missing required parameters');
    }

    try {
        const customer = await Customers.findOne({ customerName: customerName });
        if (!customer) {
            console.log(" /api/mails: Customer not found")
            return createResponse(404, []);
        }

        const mailbox = customer.mailboxes.find((mb:any) => mb.mailboxName === mailboxName);
        if (!mailbox) {
            console.log(" /api/mails: Mailbox not found")
            return createResponse(404, []);
        }
        let mails = mailbox.mails;
        if (mailKey) {
            
            mails = mails.filter((mail: any) => mail.rowId === mailKey);
            // console.log(" /api/mails: Mail with ID found", mails)
        }

        return createResponse(200, mails);
    } catch (error) {
        console.error('Error fetching mails:', error);
        return createResponse(500, 'Failed to fetch mails');
    }
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
    const updateData  = await req.json();
    const { searchParams } = new URL(req.url);
    const customerName = searchParams.get('customer');
    const mailboxName = searchParams.get('mailbox');
    const mailKey = searchParams.get('id');
    const sendForApproval = searchParams.get('sendForApproval');

    await dbConnect();
    const rowId = searchParams.get('id');
    console.log('PUT request body:', updateData);

    if (!rowId || !updateData) {
        return createResponse(400, 'Missing required parameters');
    }
  
    try {
        let combinedData = {};
    if (updateData) {
      
        const customer = await Customers.findOne({ customerName: customerName });
        if (!customer) {
            console.log(" /api/mails: Customer not found")
            return createResponse(404, []);
        }

        const mailbox = customer.mailboxes.find((mb:any) => mb.mailboxName === mailboxName);
        if (!mailbox) {
            console.log(" /api/mails: Mailbox not found")
            return createResponse(404, []);
        }
        let mails = mailbox.mails;
        if (mailKey) {
            mails = mails.filter((mail: any) => mail.rowId === mailKey);
        }
        if(sendForApproval){ mails[0].mailStatus = 'Pending Approval'}
        console.log("selected mail is ", mails[0])
        const Items = {
            Items: mails[0].extractedData.fields.Items
        }
        console.log("update data is ", updateData)
        combinedData = {...updateData, ...Items}
        console.log("combined data is ", combinedData)


    }
  
      const result = await Customers.findOneAndUpdate(
        { "mailboxes.mails.rowId": rowId },
        { 
            $set: { 
              "mailboxes.$.mails.$[mail].extractedData.fields": combinedData,
              "mailboxes.$.mails.$[mail].mailStatus": "Pending approval"
            } 
          },
        { arrayFilters: [{ "mail.rowId": rowId }], new: true }
      );
        console.log('PUT updateData:', JSON.stringify(combinedData));
        console.log('PUT result:', result);

      if (!result) {
        return createResponse(404, 'Mail not found');
      }
      return createResponse(200, 'Mail updated successfully');
    } catch (error) {
        console.error('Error updating mail:', error);
        return createResponse(500, 'Failed to update mail');
    }
  }
