import { generateImage } from "@/util/generateImage";
import { NextResponse, NextRequest } from "next/server";

// To handle a GET request to /api
export async function POST(request: NextRequest) {
    try {
      const data = await request.json();
      const image = await generateImage({
        height: 2048,
        width: 2048,
        layers: data.layers,
      });
  
      return new NextResponse(image, {
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": 'attachment; filename="generated-image.png"',
        },
      });
    } catch (error) {
      console.error("Error generating image:", error);
      return NextResponse.json(
        { message: "Error generating image" },
        { status: 500 }
      );
    }
  }
