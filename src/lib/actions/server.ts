"use server";

import axios from "axios";
import { redirect } from "next/navigation";

export async function checkToken(id: string) {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/validate-token/${id}`
    );
    return data.data;
  } catch (error) {
    redirect("/auth/login");
    // redirect("/404");
    return {
      status: false,
    };
  }
}

export async function checkOnboardingInvite(reference: string, token: string) {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_QUESTIONNAIRE_URL}/business/onboarding/auth/invite`,
      { params: { reference, token } }
    );
    return data.data as {
      email: string;
      contactName: string;
      businessName: string;
    };
  } catch {
    redirect("/auth/login");
    return { email: "", contactName: "", businessName: "" };
  }
}
