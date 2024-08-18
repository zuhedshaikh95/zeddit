import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token) return NextResponse.redirect(new URL("/sign-in", request.url));
}

export const config = {
  matcher: ["/z/:path*/create-post"],
};
