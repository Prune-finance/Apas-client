"use client";

import {
  Box,
  Paper,
  PasswordInput,
  PinInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import Image from "next/image";
import PruneIcon from "@/assets/icon.png";
import styles from "./style.module.scss";
import { inter } from "@/ui/fonts";
import { PrimaryBtn } from "@/ui/components/Buttons";
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

function UserForgotPassword() {
  const [processing, setProcessing] = useState(false);
  const { handleError, handleSuccess } = useNotification();
  const { push } = useRouter();

  const searchParams = useSearchParams();
  const code = searchParams.get("code") ?? "";
  const form = useForm<ResetPasswordType>({
    initialValues: { ...resetPasswordValues, otp: code },
    validate: zodResolver(resetPasswordSchema),
  });

  const handleResetPassword = async () => {
    setProcessing(true);
    const { otp, password } = form.values;
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/reset-password`,
        { token: Number(otp), password }
      );
      handleSuccess(
        "Successful! Password Reset",
        "Your password has been changed successfully"
      );
      push("/auth/login");
    } catch (error) {
      handleError("Password Reset Failed", parseError(error));
    } finally {
      setProcessing(false);
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
          c="var(--prune-text-gray-600)"
          style={{ fontFamily: inter.style.fontFamily }}
        >
          Create a new password.
        </Text>

        <Box
          component="form"
          onSubmit={form.onSubmit(() => handleResetPassword())}
          w="100%"
        >
          <PasswordInput
            mt={42}
            placeholder="Enter New Password"
            {...form.getInputProps("password")}
            classNames={{ input: styles.input }}
          />

          <PasswordInput
            mt={42}
            placeholder="Confirm New Password"
            {...form.getInputProps("confirmPassword")}
            classNames={{ input: styles.input }}
          />

          <Stack gap={3}>
            <PinInput
              oneTimeCode
              {...form.getInputProps("otp")}
              mt={30}
              type="number"
              length={6}
              error={!!form.errors.otp}
            />

            {!!form.errors.otp && (
              <Text fz={12} c="var(--prune-warning)">
                {form.errors && form.errors.otp}
              </Text>
            )}
          </Stack>

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
          link="/auth/login"
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

export default function UserForgotPasswordSuspense() {
  return (
    <Suspense>
      <UserForgotPassword />
    </Suspense>
  );
}
