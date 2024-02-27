import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const createResponse = (status: number, message: string | Record<string, unknown>) => {
    return new NextResponse(JSON.stringify(typeof message === 'string' ? { error: message } : message), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
};

export async function POST(req: NextRequest) {
    try {
        const { modelName, userData: data } = await req.json();

        if (!modelName || !data) 
            return createResponse(400, 'Please provide both modelName and data.');

        if (!prisma[modelName]) 
            return createResponse(400, 'Model not found.');
        // @ts-ignore
        const newRecord = await prisma[modelName].create({ data });
        return createResponse(200, newRecord);
    } catch (error) {
        return createResponse(500, 'An error occurred while creating the record: ' + error);
    }
}
