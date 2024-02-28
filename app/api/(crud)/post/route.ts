import { NextRequest } from 'next/server';
import { prisma, createResponse, handlePrismaOperation } from '@/app/lib/prismaUtils';

export async function POST(req: NextRequest) {
    const { modelName, userData: data } = await req.json();

    if (!modelName || !data) 
        return createResponse(400, 'Please provide both modelName and data.');

    if (!prisma[modelName]) 
        return createResponse(400, 'Model not found.');

    return handlePrismaOperation(async () => {
        // @ts-ignore
        const newRecord = await prisma[modelName].create({ data });
        return newRecord;
    });
}