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
  try {
    const blob = await put(filename, file, {
      access: 'public',
    });
    console.log("File uploaded " + filename + " at  URL: ", blob.url)
    return createResponse(200, {message: `Successfully uploaded ${filename}`, downloadURL: blob.url});
  } catch (error) {
    console.log("Error occured ", error);
    return createResponse(500, { Message: `Failed to upload ${filename}` });
  }
};

