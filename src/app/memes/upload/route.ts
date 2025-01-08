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
  const tokenId = data.get("tokenId");

  if (!file) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `memes/nft/${tokenId}.gif`,
      Body: buffer,
      ContentType: file.type,
    })
  );

  const imageUrl = process.env.AWS_BUCKET_URL + `/memes/nft/${tokenId}.gif`;

  const json = {
    name: `Meme #${tokenId}`,
    description:
      "Morph your Morphy, download or mint on-chain to rep on socials. Simple!",
    symbol: "MORPHD",
    image: imageUrl,
    external_url: "https://morphd.com",
    attributes: [],
    properties: {
      files: [
        {
          id: "portrait",
          uri: imageUrl,
          type: "image/gif",
        },
      ],
      category: "image",
      collection: {
        name: "MORPHD",
        family: "MORPHD",
      },
    },
  };

  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `memes/metadata/${tokenId}.json`,
      Body: JSON.stringify(json),
      ContentType: "application/json",
    })
  );

  return NextResponse.json({ message: "Ok" }, { status: 200 });
}
