// app/api/tweet/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { EUploadMimeType, TwitterApi } from "twitter-api-v2";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  // 1) pega a sessão e checa tokens
  const session: any = await getServerSession(authOptions);
  console.log(session)
  if (!session?.user?.accessToken || !session.user.refreshToken) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  // 2) lê body
  const { imageUrl, text } = await request.json();
  if (!imageUrl || !text) {
    return NextResponse.json(
      { error: "É preciso enviar imageUrl e text" },
      { status: 400 }
    );
  }

  // 3) baixa a imagem do S3
  const resImg = await fetch(imageUrl);
  if (!resImg.ok) {
    return NextResponse.json(
      { error: `Erro ao baixar imagem: ${resImg.status}` },
      { status: 502 }
    );
  }
  const arrayBuffer = await resImg.arrayBuffer();
  const mediaBuffer = Buffer.from(arrayBuffer);
  const mimeType = resImg.headers.get("content-type")!;

  // 4) instancia cliente APP (OAuth2) e “refresh” para user context
  const clientApp = new TwitterApi({
    clientId: "cHUwRjV2Ykt0SllYMnFjZkV5TWw6MTpjaQ",
    clientSecret: "igHiIi4ZadfgglRSeypVNVJeTu867EWwddCmApXoHawYFrlHpT",
  });
  const {
    client: clientUser /* já autenticado */,
    accessToken, // novo accessToken
    refreshToken, // novo refreshToken
  } = await clientApp.refreshOAuth2Token(session.user.refreshToken);

  // (Opcional: persistir os novos tokens na sessão/jwt)

  // 5) faz upload da mídia e cria o tweet
  const mediaId = await clientUser.v2.uploadMedia(mediaBuffer, { media_type: mimeType as EUploadMimeType });
  const tweet = await clientUser.v2.tweet({
    text,
    media: { media_ids: [mediaId] },
  });

  return NextResponse.json(tweet, { status: 200 });
}
