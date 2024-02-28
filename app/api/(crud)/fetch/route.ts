import { NextRequest } from 'next/server';
import { prisma, createResponse, handlePrismaOperation } from '@/app/lib/prismaUtils';

export async function POST(req: NextRequest) {
  const { modelName, conditions } = await req.json();

  return handlePrismaOperation(() => {
    const whereConditions = conditions?.reduce((acc: any, condition: any) => {
      acc[condition.columnName] = condition.contains ? { contains: condition.columnValue } : condition.columnValue;
      return acc;
    }, {});
    // @ts-ignore
    return prisma[modelName].findMany({
      where: whereConditions || {},
    });
  });
}
