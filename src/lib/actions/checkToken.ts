"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { AdminData } from "../hooks/admins";

export async function checkToken(
  isAdmin: boolean = false
): Promise<{ user: AdminData | null; success: boolean }> {
  const token = cookies().get("auth")?.value;

  try {
    const { data: res } = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/${isAdmin ? "admin" : "auth"}/me`,
      {
        headers: { Authorization: `Bearer ${token}` },
        // withCredentials: true,
      }
    );

    return { success: true, user: res.data };
  } catch (error) {
    console.log(error);
    return { user: null, success: false };
  }
}

export async function clearSession() {
  cookies().delete("session");
}
