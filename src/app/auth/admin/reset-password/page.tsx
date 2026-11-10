"use client";

import { Box, Paper, PasswordInput, Stack, Text, UnstyledButton } from "@mantine/core";
import Image from "next/image";
import PruneIcon from "@/assets/img/icon.png";
import styles from "./style.module.scss";
import { inter } from "@/ui/fonts";
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
import useCountdown from "@/lib/hooks/countdown";

// A code is sent before this page opens, so the resend timer starts straight away
const RESEND_COOLDOWN = 90;

function AdminResetPassword() {
  const [processing, setProcessing] = useState(false);
  const [resending, setResending] = useState(false);
  const resendTimer = useCountdown(RESEND_COOLDOWN, true);
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
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/reset-password`,
        { token: Number(otp), password }
      );
      handleSuccess(
        "Password Reset Complete",
        "Your password has been changed. Please log in with your new password."
      );
      push("/auth/admin/login");
    } catch (error) {
      handleError("Password Reset Failed", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const handleResend = async () => {
    if (!email) return push("/auth/admin/forgot-password");
    if (resendTimer.running) return;
    setResending(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/forgot-password`,
        { email }
      );
      form.setFieldValue("otp", "");
      resendTimer.start();
      handleSuccess("Code Sent", "A new 6-digit code has been sent to your email.");
    } catch (error) {
      handleError("Sending Reset Code Failed", parseError(error));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className={styles.container}>
      <Paper w={476} className={styles.paper}>
        <Image width={29} height={29} src={PruneIcon} alt="prune icon" />
        <Text c="var(--prune-text-gray-900)" fz={24} fw={600} mt={27} mb={0}>
          Reset Password
        </Text>
        <Text
          fz={14}
          fw={400}
          m={0}
          p={0}
          ta="center"
          c="var(--prune-text-gray-600)"
          style={{ fontFamily: inter.style.fontFamily }}
        >
          {email
            ? `Enter the 6-digit code sent to ${email}. It expires in 10 minutes.`
            : "Enter the 6-digit code from your email. It expires in 10 minutes."}
        </Text>

        <Box
          component="form"
          onSubmit={form.onSubmit(() => handleResetPassword())}
          w="100%"
        >
          <Stack gap={6} mt={32} align="center">
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
                disabled={resending || resendTimer.running}
                fz={12}
                fw={600}
                c={resendTimer.running ? "var(--prune-text-gray-400)" : "var(--prune-primary-800)"}
                td={resendTimer.running ? "none" : "underline"}
                style={{ cursor: resendTimer.running ? "default" : "pointer" }}
              >
                {resending
                  ? "Sending..."
                  : resendTimer.running
                  ? `Resend in ${resendTimer.label}`
                  : "Resend code"}
              </UnstyledButton>
            </Text>
          </Stack>

          <PasswordInput
            mt={32}
            placeholder="Enter New Password"
            description="At least 8 characters, with an uppercase letter, a lowercase letter, a number and a special character."
            inputWrapperOrder={["input", "description", "error"]}
            {...form.getInputProps("password")}
            classNames={{ input: styles.input }}
          />

          <PasswordInput
            mt={24}
            placeholder="Confirm New Password"
            {...form.getInputProps("confirmPassword")}
            classNames={{ input: styles.input }}
          />

          <PrimaryBtn
            text="Reset Password"
            fullWidth
            mt={39}
            fw={600}
            type="submit"
            loading={processing}
          />
        </Box>

        <PrimaryBtn
          text="Go back to Login"
          link="/auth/admin/login"
          mt={10}
          td="underline"
          variant="transparent"
          c="var(--prune-primary-700)"
          fz={14}
          fw={600}
        />
      </Paper>
    </div>
  );
}

export default function AdminResetPasswordSuspense() {
  return (
    <Suspense>
      <AdminResetPassword />
    </Suspense>
  );
}
