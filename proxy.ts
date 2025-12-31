import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "./lib/api/serverApi";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isAuthRoute = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const isPrivateRoute = pathname.startsWith("/notes") || pathname.startsWith("/profile");

  if (isAuthRoute && !accessToken && !refreshToken) {
    return NextResponse.next();
  }

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isPrivateRoute) {
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (!accessToken && refreshToken) {
      try {
        const sessionResponse = await checkSession(refreshToken);
        const { accessToken: newAccess, refreshToken: newRefresh } = sessionResponse.data;
        
        const response = NextResponse.next();

        if (newAccess && newRefresh) {
          response.cookies.set("accessToken", newAccess, { httpOnly: true, secure: true });
          response.cookies.set("refreshToken", newRefresh, { httpOnly: true, secure: true });
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