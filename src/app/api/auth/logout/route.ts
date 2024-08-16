import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/logout`, {
      headers: {
        Authorization: `Bearer ${cookies().get("auth")?.value}`,
      },
      // withCredentials: true,
    });

    return NextResponse.json({});
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const res = error.response?.data;
      return NextResponse.json({ message: res.message }, { status: res.code });
    }
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}
