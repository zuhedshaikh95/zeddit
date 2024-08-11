import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/libs/auth";
import { db } from "@/libs/db";
import { CustomException } from "@/libs/utils";
import { commentValidator } from "@/libs/validations";

export async function PATCH(request: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session?.user)
      throw new CustomException("Unauthorized! Proceed to sign in and let's know each other first 😉", 401);

    const body = await request.json();

    const { postId, text, replyToId } = commentValidator.parse(body);

    await db.comment.create({
      data: {
        text,
        postId,
        replyToId,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(
      {
        data: "OK",
        message: "success",
        error: false,
      },
      { status: 201 }
    );
  } catch (error: any) {
    const isZodError = error instanceof z.ZodError;
    const isCustomException = error instanceof CustomException;

    return NextResponse.json(
      {
        data: null,
        error: true,
        message: isZodError ? "Invalid payload, looks like somethings missing 😖" : error.message,
      },
      { status: isCustomException ? error.code : isZodError ? 422 : 500 }
    );
  }
}
