import { NextRequest } from 'next/server';
import { prisma, createResponse, handlePrismaOperation } from '@/app/lib/prismaUtils';

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
