import { redirect } from "next/navigation";

export default function OnboardingLoginRedirect() {
  redirect("/auth/login");
}
