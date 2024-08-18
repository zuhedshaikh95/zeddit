import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { CustomException } from "@/libs/utils";
import { getAuthSession } from "@/libs/auth";
import { usernameValidator } from "@/libs/validations";
import { db } from "@/libs/db";

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session?.user)
      throw new CustomException("Unauthorized! Proceed to sign in and let's know each other first 😉", 401);

    const body = await request.json();

    const { name } = usernameValidator.parse(body);

    const userNameTaken = await db.user.findFirst({
      where: {
        username: name,
      },
    });

    if (userNameTaken) throw new CustomException("This username is already taken, you’re a little late.😐", 409);

    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        username: name,
      },
    });

    return NextResponse.json({
      data: name,
      error: false,
      message: "Success",
    });
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
