import { NextRequest } from 'next/server';
import { prisma, createResponse, handlePrismaOperation } from '@/app/lib/prismaUtils';

export async function PUT(req: NextRequest) {
  const { modelName, idKey, idValue } = await req.json();

  if (!modelName || !idKey || !idValue) {
    return createResponse(400, 'Please provide modelName, idKey, and idValue.');
  }

  return handlePrismaOperation(() =>
    //  @ts-ignore
    prisma[modelName].delete({
      where: { [idKey]: idValue },
    })
  );
}
