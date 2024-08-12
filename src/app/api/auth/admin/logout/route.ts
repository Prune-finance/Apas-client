import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";

    await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/logout`, {
      headers: {
        Cookie: cookieHeader, // Pass the cookies received from the client
      },
      // withCredentials: true,
    });

    cookies().delete("session");
    cookies().set("session", "", {
      httpOnly: true,
      ...(process.env.NODE_ENV === "production" && {
        sameSite: "none",
        secure: true,
        domain: ".prunepayments.net",
        // domain: "prune-liard.vercel.app",
      }),
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
