import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

export const proxyConfig = {
  target: "https://notehub-api.goit.study",
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();

  const sessionCookie =
    cookieStore.get("session") || cookieStore.get("connect.sid");

  const isPrivateRoute =
    pathname.startsWith("/notes") || pathname.startsWith("/profile");

  if (isPrivateRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isPrivateRoute && sessionCookie) {
    try {
      await axios.get(`${proxyConfig.target}/auth/session`, {
        headers: {
          Cookie: `${sessionCookie.name}=${sessionCookie.value}`,
        },
      });
      return NextResponse.next();
    } catch {
      const response = NextResponse.redirect(new URL("/sign-in", request.url));
      if (sessionCookie) response.cookies.delete(sessionCookie.name);
      return response;
    }
  }

  return NextResponse.next();
}

export default proxy;
