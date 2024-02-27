// api/getUserDetails.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const { modelName, userData: data } = await req.json();
        console.log('modelName', modelName, 'data', data);
        if (!modelName || !data) {
            return new NextResponse(JSON.stringify({ error: 'Please provide both modelName and data.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (!prisma[modelName]) {
            return new NextResponse(JSON.stringify({ error: 'Model not found.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        console.log('modelName', modelName, 'data', data);
        // @ts-ignore
        const newRecord = await prisma[modelName].create({ data });
        console.log('newRecord', newRecord);
        return new NextResponse(JSON.stringify(newRecord), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new NextResponse(JSON.stringify({ error: 'An error occurred while creating the record.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });


    }
}

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
