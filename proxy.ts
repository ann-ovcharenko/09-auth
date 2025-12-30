import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "./lib/api/serverApi";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isAuthRoute = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const isPrivateRoute = pathname.startsWith("/notes") || pathname.startsWith("/profile");

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL("/notes", request.url));
  }

  if (isPrivateRoute) {
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (!accessToken && refreshToken) {
      try {
        const sessionData = await checkSession(refreshToken);
        
        const response = NextResponse.next();

        if (sessionData.accessToken && sessionData.refreshToken) {
          response.cookies.set("accessToken", sessionData.accessToken, { httpOnly: true, secure: true });
          response.cookies.set("refreshToken", sessionData.refreshToken, { httpOnly: true, secure: true });
        }

        return response;
      } catch (error) {
        const errorResponse = NextResponse.redirect(new URL("/sign-in", request.url));
        errorResponse.cookies.delete("accessToken");
        errorResponse.cookies.delete("refreshToken");
        return errorResponse;
      }
    }
  }

  return NextResponse.next();
}

export default proxy;