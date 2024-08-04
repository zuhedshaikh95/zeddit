import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/libs/auth";
import { CustomException } from "@/libs/utils";
import { db } from "@/libs/db";
import { postsRouteQueryValidator } from "@/libs/validations";

export async function GET(request: NextRequest) {
  const session = await getAuthSession();

  let followedCommunitiesIds: string[] = [];

  if (session) {
    const followedCommunities = await db.subscription.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        subZeddit: true,
      },
    });

    followedCommunitiesIds = followedCommunities.map(({ subZeddit }) => subZeddit.id);
  }

  const { nextUrl } = request;

  try {
    const { limit, page, subZedditName } = postsRouteQueryValidator.parse({
      limit: nextUrl.searchParams.get("limit"),
      page: nextUrl.searchParams.get("page"),
      subZedditName: nextUrl.searchParams.get("subZedditName"),
    });

    let whereClause = {};

    if (subZedditName) {
      whereClause = {
        subZeddit: {
          name: subZedditName,
        },
      };
    } else if (session) {
      whereClause = {
        subZeddit: {
          id: {
            in: followedCommunitiesIds,
          },
        },
      };
    }

    const posts = await db.post.findMany({
      where: whereClause,
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      include: {
        author: true,
        comments: true,
        subZeddit: true,
        votes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ data: posts, error: true, message: "success" });
  } catch (error: any) {
    const isZodError = error instanceof z.ZodError;
    const isCustomException = error instanceof CustomException;

    return NextResponse.json(
      {
        data: null,
        error: true,
        message: isZodError ? "Invalid query, looks like somethings missing 😖" : error.message,
      },
      { status: isCustomException ? error.code : isZodError ? 422 : 500 }
    );
  }
}
