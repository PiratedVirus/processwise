// pages/api/downloadCsv.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import { parse, FieldInfo } from 'json2csv';
import axios from 'axios';
import {createResponse} from "@/app/lib/utils/prismaUtils";


export async function POST(req: NextRequest, res: NextResponse) {

    const data = await req.json();

    // const items: any[] = data.extractedData.fields.Items.valueArray;
    console.log('Items:', data);
    return createResponse(200, data);

    // Use a more specific type for headers to satisfy TypeScript's indexing requirements

}
