import { NextRequest } from "next/server";
import { NextApiResponse } from "next";
import dbConnect from "@/app/lib/database/connectMongo";
import { Customers } from "@/app/lib/database/models/Customers"

import { createResponse } from "@/app/lib/utils/prismaUtils";

export async function POST(req: NextRequest) {
    await dbConnect();
    const {mailData} = await req.json();
    try {
        let customer = await Customers.findOne({ customerName: 'customer 1' });
        if (!customer) {
          // If customer not found, create a new one
          customer = new Customers({ customerName: 'customer 1', mails: [] });
        }

        mailData.map((element: any, index: number) => {
            try {
                customer.mails.push(element);
                console.log('Mail added:', index)
            } catch (error) {
                console.error('Error in adding mail:', error);
            }
        });

        await customer.save();
        return createResponse(200, 'Mails saved');
    } catch (error) {
        console.error('Error in POST handler:', error);
        return createResponse(500, 'Mail server error');
    }
}