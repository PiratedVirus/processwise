// api/getUserDetails.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export  async function GET(req: NextRequest, res: NextResponse) {
    try {
        const userDetails = await prisma.userDetails.findMany();
        return new NextResponse(JSON.stringify(userDetails), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: 'An error occurred while fetching the user profile.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });


    }
}
