import { NextResponse } from "next/server";
import api from "@/lib/api/api"; 
import { cookies } from "next/headers";

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies();

  try {
    const res = await api.get(`/notes/${id}`, {
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

export async function PATCH(request: Request, { params }: Props) {
  const { id } = await params;
  const body = await request.json();
  const cookieStore = await cookies();

  try {
    const res = await api.patch(`/notes/${id}`, body, {
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

export async function DELETE(request: Request, { params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies();

  try {
    const res = await api.delete(`/notes/${id}`, {
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