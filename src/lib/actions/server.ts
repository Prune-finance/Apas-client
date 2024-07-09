"use server";

import axios from "axios";
import { redirect } from "next/navigation";

export async function checkToken(id: string) {
  try {
    await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/validate-token/${id}`
    );
  } catch (error) {
    redirect("/404");
    return {
      status: false,
    };
  }
}
