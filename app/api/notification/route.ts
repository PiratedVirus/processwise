import { NextRequest, NextResponse } from "next/server";
import { NextApiResponse } from "next";
import { createResponse } from "@/app/lib/utils/prismaUtils";
import axios from "axios";


export async function POST(req: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(req.url);
  const validationToken = searchParams.get('validationToken');

  if (validationToken) {
    console.log('Validation token received:', validationToken);
    return new Response(validationToken, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    })
  }

  const body = await req.json();

  const notification = body.value[0];
  const [customerName, mailboxName] = notification.clientState.split(':');
  axios.post(`${process.env.NEXT_PUBLIC_API_URL}/mails?customer=${customerName}&mailbox=${mailboxName}`);

  return new Response(`Notification received for ${customerName}'s mailbox: ${mailboxName} `, { status: 200 })
}

