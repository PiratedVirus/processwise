import { NextRequest } from 'next/server';
import {  NextApiResponse } from 'next';
import { prisma, createResponse, handlePrismaOperation } from '@/app/lib/utils/prismaUtils';
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
    const { userData: data } = await req.json();
    const modelName = 'userDetails';
    if (!data) 
        return createResponse(400, 'Please provide  data.');

    if (!prisma[modelName]) 
        return createResponse(400, 'Model not found.');

    return handlePrismaOperation(async () => {
        // @ts-ignore
        const newRecord = await prisma[modelName].create({ data });
        return newRecord;
    });
}

export async function PUT(req: NextRequest) {
    const {  idKey, idValue, userData, columnToUpdate } = await req.json();
    const modelName = 'userDetails';
    if (!idKey || !idValue || !userData) {
      return createResponse(400, 'Please provide both modelName and data.');
    }
  
    return handlePrismaOperation(() =>
      //   @ts-ignore 
      prisma[modelName].update({
        where: { [idKey]: idValue } as Prisma.UserDetailsWhereUniqueInput,
        data: columnToUpdate ? { [columnToUpdate]: userData[columnToUpdate] } : userData,
      })
    );
}

export async function GET(req: Request, res: NextApiResponse) {
    const { searchParams } = new URL(req.url)

    // Dynamically construct the where condition based on all query parameters
    const whereCondition = Array.from(searchParams.keys()).reduce((coloumn: any, key) => {
        const value = searchParams.get(key);
        // If the value contains %, use the contains keyword for wildcard search
        if (value && value.includes('%')) {
            coloumn[key] = { contains: value.replace(/%/g, '') };
        } else {
            coloumn[key] = value;
        }
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