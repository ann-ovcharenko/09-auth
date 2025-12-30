import { NextResponse } from "next/server";
import api from "../../api";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();

  try {
    const res = await api.get("/users/me", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
        response: error.response?.data,
      },
      { status: error.status || 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const cookieStore = await cookies();

  try {
    const res = await api.patch("/users/me", body, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
        response: error.response?.data,
      },
      { status: error.status || 500 }
    );
  }
}