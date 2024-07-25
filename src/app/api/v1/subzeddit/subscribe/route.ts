import { type NextRequest, NextResponse } from "next/server";
import { isCuid } from "@paralleldrive/cuid2";
import { db } from "@/libs/db";

import { getAuthSession } from "@/libs/auth";
import { CustomException } from "@/libs/utils";

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session) throw new CustomException("Unauthorized! Proceed to sign in and let's know each other first 😉", 401);

    const { subZedditId } = await request.json();

    if (!isCuid(subZedditId))
      throw new CustomException("Uh oh, Looks like this subzeddit is either misplaced or removed permanently 😵", 422);

    const isSubscriptionExists = await db.subscription.findFirst({
      where: {
        subZedditId,
        userId: session.user.id,
      },
    });

    if (isSubscriptionExists) {
      await db.subscription.delete({
        where: {
          userId_subZedditId: {
            subZedditId: subZedditId,
            userId: session.user.id,
          },
        },
      });

      return NextResponse.json({
        data: "unsubscribed",
        error: false,
        message: "You have been unsubscribed, sad to see you leave 🥲",
      });
    }

    await db.subscription.create({
      data: {
        subZedditId,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      {
        data: subZedditId,
        error: false,
        message: "You are officially a knight of this community, welcome to the gang ✌️",
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { data: null, error: true, message: error.message },
      { status: error instanceof CustomException ? error.code : 500 }
    );
  }
}
