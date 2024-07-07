import NextAuth from "next-auth/next";

import { authOptions } from "@/libs/auth";

const handler = NextAuth(authOptions);

export const POST = handler;

export const GET = handler;
