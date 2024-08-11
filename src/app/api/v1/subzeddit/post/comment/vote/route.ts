import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/libs/auth";
import { db } from "@/libs/db";
import { CustomException } from "@/libs/utils";
import { commentVoteValidator } from "@/libs/validations";

export async function PATCH(request: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session?.user)
      throw new CustomException("Unauthorized! Proceed to sign in and let's know each other first 😉", 401);

    const body = await request.json();

    const { commentId, voteType } = commentVoteValidator.parse(body);

    const existingVote = await db.commentVote.findFirst({
      where: {
        userId: session.user.id,
        commentId,
      },
    });

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.commentVote.delete({
          where: {
            userId_commentId: {
              commentId,
              userId: session.user.id,
            },
          },
        });

        return NextResponse.json({ data: "OK", error: false, mesage: "success" });
      }

      await db.commentVote.update({
        where: {
          userId_commentId: {
            commentId,
            userId: session.user.id,
          },
        },
        data: {
          type: voteType,
        },
      });

      return NextResponse.json({ data: "OK", error: false, message: "success" });
    }

    await db.commentVote.create({
      data: {
        commentId,
        type: voteType,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ data: "OK", error: false, message: "success" });
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
