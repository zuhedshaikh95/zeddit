import { NextResponse, type NextRequest } from "next/server";

import { CustomException } from "@/libs/utils";
import { db } from "@/libs/db";
import { SUBZEDDIT_SEARCH_QUERY_LIMIT } from "@/configs";

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get("q");

    if (!q) throw new CustomException("Invalid query!", 400);

    const results = await db.subZeddit.findMany({
      where: {
        name: {
          startsWith: q,
        },
      },
      include: {
        _count: true,
      },
      take: SUBZEDDIT_SEARCH_QUERY_LIMIT,
    });

    return NextResponse.json({ data: results, error: false, message: "success!" });
  } catch (error: any) {
    return NextResponse.json(
      { data: [], error: true, message: error.message },
      { status: error instanceof CustomException ? error.code : 500 }
    );
  }
}
