import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";


export async function POST(request: NextRequest) {
  const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION as string,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACESS_KEY as string,
    },
  });

  const data = await request.formData();
  const file = data.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `memes/nft/1.gif`,
      Body: buffer,
      ContentType: file.type,
    })
  );

  return NextResponse.json({ message: "Ok" }, { status: 200 });
}
