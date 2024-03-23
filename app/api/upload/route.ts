import { NextResponse, NextRequest } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { NextApiRequest } from "next";
import { put } from "@vercel/blob";

export const POST = async (req: NextRequest, res: NextResponse) => {
  const formData = await req.formData();

  const file = formData.get("file");
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  const fileObj = file as File;
  const filename =  fileObj.name.replaceAll(" ", "_");
  console.log(filename);
  try {

    const blob = await put(filename, file, {
      access: 'public',
    });
    return NextResponse.json({ Message: `Success ${filename}`, status: 200 });
  } catch (error) {
    console.log("Error occured ", error);
    return NextResponse.json({ Message: `Failed ${filename}`, status: 500 });
  }
};

