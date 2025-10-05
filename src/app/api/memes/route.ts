// app/api/memes/route.ts
import { NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

export const runtime = "nodejs"; 
export const dynamic = "force-dynamic"; 

const s3 = new S3Client({
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACESS_KEY!,
  },
});

const BUCKET = process.env.S3_BUCKET!;
const PUBLIC_BASE = process.env.S3_PUBLIC_BASE_URL!.replace(/\/+$/, "");

type Item = {
  id: string;
  type: "Background" | "GIFs" | "Stickers";
  image: { url: string };
};

async function listAllKeys(prefix: string): Promise<string[]> {
  let keys: string[] = [];
  let ContinuationToken: string | undefined;

  do {
    try {
      const res = await s3.send(
        new ListObjectsV2Command({
          Bucket: BUCKET,
          Prefix: prefix,
          ContinuationToken,
        })
      );
      const pageKeys =
        res.Contents?.map((c) => c.Key!).filter(
          (k) => !!k && !k.endsWith("/") // ignora “pastas”
        ) ?? [];

      keys = keys.concat(pageKeys);
      ContinuationToken = res.IsTruncated
        ? res.NextContinuationToken
        : undefined;
    } catch (error) {
      console.log(error, "error");
    }
  } while (ContinuationToken);

  return keys;
}

function toPublicUrl(key: string) {
  const parts = key.split("/").map(encodeURIComponent);
  return `${PUBLIC_BASE}/${parts.join("/")}`;
}

// Mapeia suas pastas do bucket → labels que seu front já usa nos tabs
const FOLDER_TO_TYPE: Record<string, Item["type"]> = {
  "Backgrounds/": "Background",
  "Gifs/": "GIFs",
  "Stickers/": "Stickers",
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(parseInt(searchParams.get("page") ?? "1", 10), 1);
    const pageSize = Math.min(
      Math.max(parseInt(searchParams.get("pageSize") ?? "10", 10), 1),
      500
    );

    const [bg, gifs, stickers] = await Promise.all([
      listAllKeys("Backgrounds/"),
      listAllKeys("Gifs/"),
      listAllKeys("Stickers/"),
    ]);

    const toItem = (key: string): Item => {
      const type = key.startsWith("Backgrounds/")
        ? FOLDER_TO_TYPE["Backgrounds/"]
        : key.startsWith("Gifs/")
        ? FOLDER_TO_TYPE["Gifs/"]
        : FOLDER_TO_TYPE["Stickers/"];
      return { id: key, type, image: { url: toPublicUrl(key) } };
    };

    const items: Item[] = [...bg, ...gifs, ...stickers].map(toItem);

    items.sort((a, b) => a.id.localeCompare(b.id));

    const total = items.length;
    const pageCount = Math.max(Math.ceil(total / pageSize), 1);
    const start = (page - 1) * pageSize;
    const data = items.slice(start, start + pageSize);

    return NextResponse.json({
      data,
      meta: { pagination: { page, pageSize, pageCount, total } },
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Falha ao listar imagens do S3" },
      { status: 500 }
    );
  }
}
