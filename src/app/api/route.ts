import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { generateImage } from "@/util/generateImage";

export async function POST(request: NextRequest) {
  const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION as string,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACESS_KEY as string,
    },
  });

  const data = await request.json();

  const image = await generateImage({
    height: data.height,
    width: data.width,
    layers: data.layers,
  });

  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `morphy/nft/${data.tokenId}.png`,
      Body: image,
      ContentType: "image/png",
    })
  );

  const imageUrl = process.env.AWS_BUCKET_URL + `/morphy/nft/${data.tokenId}.png`

  const json = {
    name: `Morphy #${data.tokenId}`,
    description: "Morph your Morphy, download or mint on-chain to rep on socials. Simple!",
    symbol: "MORPHD",
    image: imageUrl,
    external_url: "https://morphd.com",
    attributes: data.attributes,
    properties: {
      files: [
        {
          id: "portrait",
          uri: imageUrl,
          type: "image/png",
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
      Key: `morphy/metadata/${data.tokenId}.json`,
      Body: JSON.stringify(json),
      ContentType: 'application/json',
    }),
  );

  return NextResponse.json({ message: "Ok" }, { status: 200 });
}
