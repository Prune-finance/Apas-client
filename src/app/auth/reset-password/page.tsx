"use client";

import { Box, PasswordInput, Stack, Text, Title, UnstyledButton } from "@mantine/core";
import Image from "next/image";
import LogoWhite from "@/assets/img/LogoWhite.png";
import signInBg from "@/assets/auth-bg/sign-in.png";
import authStyles from "@/ui/styles/auth.module.scss";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { OtpInput } from "@/ui/components/OtpInput";
import { useForm, zodResolver } from "@mantine/form";
import {
  resetPasswordSchema,
  ResetPasswordType,
  resetPasswordValues,
} from "@/lib/schema";
import { useRouter, useSearchParams } from "next/navigation";
import useNotification from "@/lib/hooks/notification";
import { Suspense, useState } from "react";
import { parseError } from "@/lib/actions/auth";
import axios from "axios";

const passwordStyles = {
  input: {
    height: "48px",
    border: "1px solid var(--prune-text-gray-100)",
    borderRadius: "8px",
  },
  innerInput: {
    paddingLeft: "15px",
    paddingRight: "15px",
    fontSize: "14px",
    color: "var(--prune-text-gray-700)",
    height: "100%",
  },
};

function UserResetPassword() {
  const [processing, setProcessing] = useState(false);
  const [resending, setResending] = useState(false);
  const { handleError, handleSuccess } = useNotification();
  const { push } = useRouter();

  const searchParams = useSearchParams();
  const code = searchParams.get("code") ?? "";
  const email = searchParams.get("email") ?? "";

  const form = useForm<ResetPasswordType>({
    initialValues: { ...resetPasswordValues, otp: code },
    validate: zodResolver(resetPasswordSchema),
  });

  const handleResetPassword = async () => {
    setProcessing(true);
    const { otp, password } = form.values;
    try {
      // The API expects the 6-digit code as a plain number
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/reset-password`,
        { token: Number(otp), password }
      );
      handleSuccess(
        "Password Reset Complete",
        "Your password has been changed. Please log in with your new password."
      );
      push("/auth/login");
    } catch (error) {
      handleError("Password Reset Failed", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const handleResend = async () => {
    if (!email) return push("/auth/forgot-password");
    setResending(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/forgot-password`,
        { email }
      );
      form.setFieldValue("otp", "");
      handleSuccess("Code Sent", "A new 6-digit code has been sent to your email.");
    } catch (error) {
      handleError("Sending Reset Code Failed", parseError(error));
    } finally {
      setResending(false);
    }
  };

  return (
    <main className={authStyles.login}>
      {/* Left sidebar — identical to login */}
      <div className={authStyles.login__frame}>
        <div className={authStyles.bg__image}>
          <Image
            src={signInBg}
            alt="sign in background"
            fill
            style={{ objectFit: "cover", objectPosition: "center top" }}
            priority
          />
          <div className={authStyles.bg__overlay} />
        </div>

        <div className={authStyles.frame__logo}>
          <Image height={36} src={LogoWhite} alt="Prune logo" style={{ width: "auto" }} />
        </div>

        <div className={authStyles.testimonial}>
          <Title order={2} className={authStyles.testimonial__quote}>
            Just what I needed to settle my distributors.
          </Title>
          <div className={authStyles.testimonial__author}>
            <Text fz={16} fw={700} c="white">
              Karen Yue
            </Text>
            <Text fz={14} fw={400} c="white">
              Director of Digital Marketing Technology
            </Text>
          </div>
        </div>
      </div>

      {/* Right panel — reset password form */}
      <div className={authStyles.login__paper}>
        <Box w={{ base: "90vw", sm: 394 }}>
          <Title order={2} className={authStyles.paper__header}>
            Reset Password
          </Title>

          <Text className={authStyles.paper__text}>
            {email
              ? `Enter the 6-digit code sent to ${email}. It expires in 10 minutes.`
              : "Enter the 6-digit code from your email. It expires in 10 minutes."}
          </Text>

          <Box
            component="form"
            mt={32}
            onSubmit={form.onSubmit(() => handleResetPassword())}
          >
            <Stack gap={6}>
              <OtpInput
                boxSize={52}
                {...form.getInputProps("otp")}
                error={!!form.errors.otp}
              />

              {!!form.errors.otp && (
                <Text fz={12} c="var(--prune-warning)">
                  {form.errors.otp}
                </Text>
              )}

              <Text fz={12} c="var(--prune-text-gray-500)">
                Didn&apos;t get a code?{" "}
                <UnstyledButton
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  fz={12}
                  fw={600}
                  c="var(--prune-primary-800)"
                  td="underline"
                >
                  {resending ? "Sending..." : "Resend code"}
                </UnstyledButton>
              </Text>
            </Stack>

            <Stack gap={16} mt={24}>
              <PasswordInput
                styles={passwordStyles}
                placeholder="New Password"
                description="At least 8 characters, with an uppercase letter, a lowercase letter, a number and a special character."
                inputWrapperOrder={["input", "description", "error"]}
                {...form.getInputProps("password")}
              />

              <PasswordInput
                styles={passwordStyles}
                placeholder="Confirm New Password"
                {...form.getInputProps("confirmPassword")}
              />
            </Stack>

            <PrimaryBtn
              text="Reset Password"
              fullWidth
              mt={24}
              h={48}
              radius={4}
              fz={16}
              fw={500}
              type="submit"
              loading={processing}
            />

            <PrimaryBtn
              text="Go back to Login"
              link="/auth/login"
              mt={16}
              variant="transparent"
              fz={14}
              fw={600}
              fullWidth
              p={0}
              c="var(--prune-primary-800)"
              style={{ textAlign: "center" }}
            />
          </Box>
        </Box>
      </div>
    </main>
  );
}

export default function UserResetPasswordSuspense() {
  return (
    <Suspense>
      <UserResetPassword />
    </Suspense>
  );
}
