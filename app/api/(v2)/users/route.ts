import { NextRequest } from 'next/server';
import {  NextApiResponse } from 'next';
import { prisma, createResponse, handlePrismaOperation } from '@/app/lib/prismaUtils';
import { Prisma } from '@prisma/client';

export async function DELETE(req: NextRequest) {
    const {  idKey, idValue } = await req.json();
    const modelName = 'userDetails';

    if (!idKey || !idValue) {
        return createResponse(400, 'Please provide modelName, idKey, and idValue.');
    }

    return handlePrismaOperation(async () => {
        // Cast the where object to UserDetailsWhereUniqueInput
        const where = { [idKey]: idValue } as Prisma.UserDetailsWhereUniqueInput;

        // @ts-ignore
        return prisma[modelName].delete({ where });
    });
}

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

export async function PUT(req: NextRequest) {
    const { modelName, idKey, idValue, userData, columnToUpdate } = await req.json();
  
    if (!modelName || !idKey || !idValue || !userData) {
      return createResponse(400, 'Please provide both modelName and data.');
    }
  
    return handlePrismaOperation(() =>
      //   @ts-ignore 
      prisma[modelName].update({
        where: { [idKey]: idValue },
        data: columnToUpdate ? { [columnToUpdate]: userData[columnToUpdate] } : userData,
      })
    );
}

export async function GET(req: Request, res: NextApiResponse) {
    const { searchParams } = new URL(req.url)

    // Dynamically construct the where condition based on all query parameters
    const whereCondition = Array.from(searchParams.keys()).reduce((coloumn: any, key) => {
        coloumn[key] = searchParams.get(key);
        return coloumn;
    }, {});
    console.log('whereCondition', whereCondition);
    try {
        const results = await prisma.userDetails.findMany({
            where: whereCondition,
        });

        return createResponse(200, results);
    } catch (error) {
        console.error("Prisma operation failed: ", error);
        return createResponse(500, { error: "Failed to fetch data" });
    }
}