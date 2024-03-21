import { NextRequest } from "next/server";
import { NextApiResponse } from "next";
import dbConnect from "@/app/lib/database/connectMongo";
import { Mails } from "@/app/lib/database/models/Mails"
import { createResponse } from "@/app/lib/utils/prismaUtils";

export async function POST(req: NextRequest) {
    await dbConnect();
    const {mailData} = await req.json();
    // map through the mailData and send the mail
    try {
        mailData.map(async (element: any, index: number) => {
            try {
                const mail = new Mails(element);
                await mail.save();
                console.log('Mail saved:', index)
            } catch (error) {
                console.error('Error in saving mail:', error);
            }
        });
        return createResponse(200, 'Mails saved');
    } catch (error) {
        console.error('Error in POST handler:', error);
        return createResponse(500, 'Mail server error');
    }
}