"use client";

import { Box, Text, Title } from "@mantine/core";
import Image from "next/image";
import PruneIcon from "@/assets/icon.png";
import signInBg from "@/assets/auth-bg/sign-in.png";
import authStyles from "@/ui/styles/auth.module.scss";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useState } from "react";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function UserForgotPassword() {
  const [processing, setProcessing] = useState(false);
  const { handleError, handleSuccess } = useNotification();
  const { push } = useRouter();

  const schema = z.object({
    email: z.string().email("Invalid Email").min(1, "Email is required"),
  });

  const form = useForm({
    initialValues: { email: "" },
    validate: zodResolver(schema),
  });

  const handleResetLink = async () => {
    setProcessing(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/forgot-password`,
        { ...form.values }
      );
      handleSuccess(
        "Email Sent",
        "A password reset link has been sent to your email."
      );
      push("/auth/reset-password");
    } catch (error) {
      handleError("Sending Reset Link Failed", parseError(error));
    } finally {
      setProcessing(false);
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
          <Image width={33} height={33} src={PruneIcon} alt="Prune icon" />
          <Text fz={20} fw={600} c="white" lh={1}>
            Prune Payments
          </Text>
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

      {/* Right panel — forgot password form */}
      <div className={authStyles.login__paper}>
        <Box w={{ base: "90vw", sm: 394 }}>
          {/* <Image width={29} height={29} src={PruneIcon} alt="prune icon" /> */}

          <Title order={2} className={authStyles.paper__header}>
            Forgot Password
          </Title>

          <Text className={authStyles.paper__text}>
            Do not worry, we would help you reset it.
          </Text>

          <Box
            component="form"
            mt={32}
            onSubmit={form.onSubmit(() => handleResetLink())}
          >
            <TextInput
              styles={{
                input: {
                  height: "48px",
                  border: "1px solid var(--prune-text-gray-100)",
                  borderRadius: "8px",
                  paddingLeft: "15px",
                  paddingRight: "15px",
                  fontSize: "14px",
                  color: "var(--prune-text-gray-700)",
                },
              }}
              placeholder="Enter Email"
              {...form.getInputProps("email")}
            />

            <PrimaryBtn
              text="Send Reset Link"
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
