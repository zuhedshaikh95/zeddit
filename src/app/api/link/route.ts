import axios from "axios";
import { NextResponse, type NextRequest } from "next/server";

import { CustomException } from "@/libs/utils";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const href = url.searchParams.get("url");

  try {
    if (!href) throw new CustomException("Invalid url", 422);

    const response = await axios.get(href);

    const titleMatch = response.data.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1] : "";

    const descriptionMatch = response.data.match(/<meta name="description" content="(.*?)"/);
    const description = descriptionMatch ? descriptionMatch[1] : "";

    const imageMatch = response.data.match(/<meta property="og:image" content="(.*?)"/);
    const imageUrl = imageMatch ? imageMatch[1] : "";

    return new NextResponse(
      JSON.stringify({
        success: 1,
        meta: {
          title,
          description,
          image: {
            url: imageUrl,
          },
        },
      })
    );
  } catch (error: any) {
    return new NextResponse(error.message);
  }
}
