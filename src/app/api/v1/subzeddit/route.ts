import { type NextRequest, NextResponse } from "next/server";

import { CustomException } from "@/libs/utils";
import { getAuthSession } from "@/libs/auth";
import { db } from "@/libs/db";

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session) throw new CustomException("Unauthorized! Proceed to sign in and let's know each other first 😉", 401);

    const { name } = await request.json();

    if (!name || name.length < 3 || name.length > 21)
      throw new CustomException("A subzeddit name should be betweeen 3 to 21 characters 🙄", 422);

    const subZedditExists = await db.subZeddit.findFirst({
      where: {
        name,
      },
    });

    if (subZedditExists) throw new CustomException("This subzeddit is already taken, you’re a little late 😐", 409);

    const subZeddit = await db.subZeddit.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    });

    await db.subscription.create({
      data: {
        userId: session.user.id,
        subZedditId: subZeddit.id,
      },
    });

    return NextResponse.json(
      {
        data: subZeddit.name,
        error: false,
        message: "subzeddit created!😁. Invite fellow zedditors to subscribe and catch up!",
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
