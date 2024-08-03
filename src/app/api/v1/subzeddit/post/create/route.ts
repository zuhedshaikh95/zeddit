import { isCuid } from "@paralleldrive/cuid2";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/libs/auth";
import { db } from "@/libs/db";
import { CustomException } from "@/libs/utils";
import { postValidator } from "@/libs/validations";

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session) throw new CustomException("Unauthorized! Proceed to sign in and let's know each other first 😉", 401);

    const body = await request.json();

    const { subZedditId, title, content } = postValidator.parse(body);

    if (!isCuid(subZedditId)) throw new CustomException("Uh oh, Looks like this subzeddit is 😵", 422);

    const isSubscriptionExists = await db.subscription.findFirst({
      where: {
        subZedditId,
        userId: session.user.id,
      },
    });

    if (!isSubscriptionExists)
      throw new CustomException("You're not a part of this community 😑! Subscribe first, pleaseeee", 400);

    await db.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        subZedditId,
      },
    });

    return NextResponse.json(
      { data: subZedditId, error: false, message: "Can't wait for others to see this 😆" },
      { status: 201 }
    );
  } catch (error: any) {
    const isZodError = error instanceof z.ZodError;
    const isCustomException = error instanceof CustomException;

    return NextResponse.json(
      {
        data: null,
        error: true,
        message: isZodError ? "Invalid post data, looks like somethings missing 😖" : error.message,
      },
      { status: isCustomException ? error.code : 500 }
    );
  }
}
