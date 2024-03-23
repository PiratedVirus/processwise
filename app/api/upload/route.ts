import { NextResponse, NextRequest } from "next/server";
import path from "path";
import { put } from "@vercel/blob";
import { createResponse } from "@/app/lib/utils/prismaUtils";

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();

  const file = formData.get("file");
  if (!file) {
    return createResponse(400, { Message: "No files received." });
  }

  const fileObj = file as File;
  const filename =  fileObj.name.replaceAll(" ", "_");
  console.log(filename);
  try {
    const blob = await put(filename, file, {
      access: 'public',
    });
    return createResponse(200, { Message: `Successfully uploaded ${filename}` });
  } catch (error) {
    console.log("Error occured ", error);
    return createResponse(500, { Message: `Failed to upload ${filename}` });
  }
};

