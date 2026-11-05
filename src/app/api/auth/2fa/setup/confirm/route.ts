import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login/2fa/setup/confirm`,
      body
    );
    return NextResponse.json({ ...response.data });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const res = error.response?.data;
      return NextResponse.json(
        { message: res?.message ?? "Confirmation failed" },
        { status: error.response?.status ?? 400 }
      );
    }
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
