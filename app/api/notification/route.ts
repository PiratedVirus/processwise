import { NextRequest, NextResponse } from "next/server";
import { NextApiResponse } from "next";
import { createResponse } from "@/app/lib/utils/prismaUtils";


export async function POST(req: NextRequest, res: NextResponse) {
    const { searchParams } = new URL(req.url);
    const validationToken = searchParams.get('validationToken');

    if (validationToken) {
        return new Response(null, {status: 200})
      }
    
      // Handle the actual notifications here
      console.log(req.body);
    
      // Your logic to handle notifications, e.g., read the resource data
      
      // createResponse(200, 'Notification received');
      return new Response('Notification received', {status: 200})

}