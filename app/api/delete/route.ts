import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const createResponse = (status: number, message: string | Record<string, unknown>) => {
    return new NextResponse(JSON.stringify(typeof message === 'string' ? { error: message } : message), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
};

export async function PUT(req: NextRequest) {
    try {
        const { modelName, idKey, idValue } = await req.json();

        if (!modelName || !idKey || !idValue)
            return createResponse(400, 'Please provide both modelName and data.');
        

        if (!prisma[modelName]) 
            return createResponse(400, 'Model not found.');
        

        // @ts-ignore
        const deletedRecord = await prisma[modelName].delete({
            where: {
                [idKey]: idValue, 
            },
        });

        return createResponse(200, `Record deleted successfully: ${JSON.stringify(deletedRecord)}`);
    } catch (error) {
        return createResponse(500, 'An error occurred while deleting the record: ' + error);
    }
}

export  async function GET() {
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