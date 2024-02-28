// utils/prismaUtils.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export const prisma = new PrismaClient();

export const createResponse = (status: number, message: string | Record<string, unknown>) => {
  return new NextResponse(JSON.stringify(typeof message === 'string' ? { error: message } : message), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const handlePrismaOperation = async (operation: () => Promise<any>) => {
  try {
    const result = await operation();
    return createResponse(200, result);
  } catch (error) {
    console.error(error);
    return createResponse(500, 'An error occurred during the operation.');
  }
};
