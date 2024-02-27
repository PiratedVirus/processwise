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
        const { modelName, conditions } = await req.json();
        console.log("REQ: Inside fetch FETCH route modelName: ", modelName, " conditions: ", JSON.stringify(conditions));
        if (!prisma[modelName]) {
            return createResponse(400, 'Model not found.');
        }

        let data;
        if (conditions && conditions.length > 0) {
            const whereConditions = conditions.reduce((acc: any, condition: any) => {
                acc[condition.columnName] = condition.contains ? { contains: condition.columnValue } : condition.columnValue;
                return acc;
            }, {});
            // @ts-ignore
            data = await prisma[modelName].findMany({
                where: whereConditions
            });
            
        } else {
            // @ts-ignore
            data = await prisma[modelName].findMany();
        }
        // console.log("RESPONSE: Inside fetch FETCH route data: ", JSON.stringify(data));

        return createResponse(200,  data ); // Update the argument to pass an object with the records property
    } catch (error) {
        return createResponse(500, 'An error occurred while fetching the records.');
    }
}