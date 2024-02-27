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
        const { modelName, idKey, idValue, userData, columnToUpdate } = await req.json();
        console.log("$% REQ: Inside update PUT route modelName: ", modelName, " idKey: ", idKey, " idValue: ", idValue, " userData: ", JSON.stringify(userData), " columnToUpdate: ", columnToUpdate);

        if (!modelName || !idKey || !idValue || !userData)
            return createResponse(400, 'Please provide both modelName and data.');

        if (!prisma[modelName]) 
            return createResponse(400, 'Model not found.');
        

        const updateData = columnToUpdate ? { [columnToUpdate]: userData[columnToUpdate] } : userData;
        // @ts-ignore
        const updatedRecord = await prisma[modelName].update({
            where: { [idKey]: idValue },
            data: updateData
        });
        console.log("$% RESPONSE: Inside update PUT route updatedRecord: ", JSON.stringify(updatedRecord));
        return createResponse(200, updatedRecord);
    } catch (error) {
        return createResponse(500, 'An error occurred while updating the record: ' + error);
    }
}
