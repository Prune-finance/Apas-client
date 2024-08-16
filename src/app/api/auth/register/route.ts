import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { email, password, token } = await request.json();

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/register`,
      { email, password, token }
    );

    // const responseCookies = response.headers["set-cookie"];
    // if (!responseCookies) {
    //   return;
    // }
    // const session = responseCookies[0].split(";")[0].split("=")[1];

    // cookies().set("session", session, {
    //   httpOnly: true,
    //   ...(process.env.NODE_ENV === "production" && {
    //     sameSite: "none",
    //     secure: true,
    //     domain: ".prunepayments.net",
    //     // domain: "prune-liard.vercel.app",
    //   }),
    // });

    return NextResponse.json({ ...response.data });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const res = error.response?.data;
      return NextResponse.json({ message: res.message }, { status: res.code });
    }
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}
