import { isCuid } from "@paralleldrive/cuid2";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/libs/auth";
import { db } from "@/libs/db";
import { CustomException } from "@/libs/utils";
import { postVoteValidator } from "@/libs/validations";
import { CachedPostT } from "@types";
import { redis } from "@/libs/redis";

const CACHE_AFTER_UPVOTES = 1;

export async function PATCH(request: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session?.user)
      throw new CustomException("Unauthorized! Proceed to sign in and let's know each other first 😉", 401);

    const body = await request.json();

    const { postId, voteType } = postVoteValidator.parse(body);

    if (!isCuid(postId)) throw new CustomException("Uh oh, Looks like this post is 😵", 422);

    const existingVote = await db.vote.findFirst({
      where: {
        userId: session.user.id,
        postId,
      },
    });

    const post = await db.post.findFirst({
      where: {
        id: postId,
      },
      include: {
        author: true,
        votes: true,
      },
    });

    if (!post)
      throw new CustomException("Uh oh, Looks like this post is either renamed, removed, or misplaced 😵", 404);

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.vote.delete({
          where: {
            userId_postId: {
              postId,
              userId: session.user.id,
            },
          },
        });

        return NextResponse.json({ data: true, error: false, mesage: "OK" });
      }

      await db.vote.update({
        where: {
          userId_postId: {
            postId,
            userId: session.user.id,
          },
        },
        data: {
          type: voteType,
        },
      });

      // recount the votes
      const votesAmt = post.votes.reduce((acc, post) => (post.type === "UP" ? acc + 1 : acc - 1), 0);

      if (votesAmt >= CACHE_AFTER_UPVOTES) {
        const cachePayload: CachedPostT = {
          authorUserName: post.author.username ?? "",
          content: JSON.stringify(post.content),
          id: post.id,
          title: post.title,
          currentVote: voteType,
          createdAt: post.createdAt,
        };

        await redis.hset(`post:${post.id}`, cachePayload);
      }

      return NextResponse.json({ data: null, error: false, message: "OK" });
    }

    await db.vote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        postId,
      },
    });

    const votesAmt = post.votes.reduce((acc, post) => (post.type === "UP" ? acc + 1 : acc - 1), 0);

    if (votesAmt >= CACHE_AFTER_UPVOTES) {
      const cachePayload: CachedPostT = {
        authorUserName: post.author.username ?? "",
        content: JSON.stringify(post.content),
        id: post.id,
        title: post.title,
        currentVote: voteType,
        createdAt: post.createdAt,
      };

      await redis.hset(`post:${post.id}`, cachePayload);
    }

    return NextResponse.json({ data: null, error: false, message: "OK" });
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
