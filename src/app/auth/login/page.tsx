import { Box, Group, Text, Title } from "@mantine/core";
import { Suspense } from "react";
import Image from "next/image";

import styles from "@/ui/styles/auth.module.scss";
import LogoWhite from "@/assets/LogoWhite.png";
import signInBg from "@/assets/auth-bg/sign-in.png";
import LoginForm from "./form";
import { checkToken } from "@/lib/actions/checkToken";
import { redirect } from "next/navigation";
import { PrimaryBtn } from "@/ui/components/Buttons";

async function Login() {
  const { success } = await checkToken();
  if (success) return redirect("/");

  return (
    <main className={styles.login}>
      <div className={styles.login__frame}>
        <div className={styles.bg__image}>
          <Image
            src={signInBg}
            alt="sign in background"
            fill
            style={{ objectFit: "cover", objectPosition: "center top" }}
            priority
          />
          <div className={styles.bg__overlay} />
        </div>

        <div className={styles.frame__logo}>
          <Image height={36} src={LogoWhite} alt="Prune logo" style={{ width: "auto" }} />
        </div>

        <div className={styles.testimonial}>
          <Title order={2} className={styles.testimonial__quote}>
            Just what I needed to settle my distributors.
          </Title>
          <div className={styles.testimonial__author}>
            <Text fz={16} fw={700} c="white">
              Karen Yue
            </Text>
            <Text fz={14} fw={400} c="white">
              Director of Digital Marketing Technology
            </Text>
          </div>
        </div>
      </div>

      <div className={styles.login__paper}>
        <Group gap={2} justify="flex-end" pos="absolute" top={36} right={43}>
          <Text fz={14} className={styles.rdr__text}>
            Having Issues?{" "}
          </Text>
          <PrimaryBtn
            text="Contact Us"
            variant="transparent"
            fz={14}
            fw={600}
            p={0}
            c="var(--prune-primary-800)"
            link="https://prunepayments.com/contact-us"
          />
        </Group>
        <Box w={{ base: "90vw", sm: 394 }}>
          <Title order={2} className={styles.paper__header}>
            Login
          </Title>

          <Text className={styles.paper__text}>
            Enter your details below to have access to your account
          </Text>
          <LoginForm />

          <Group gap={4} mt={16} justify="center">
            <Text fz={14} c="var(--prune-text-gray-600)">
              Don&apos;t have an account?
            </Text>
            <PrimaryBtn
              variant="transparent"
              text="Answer the questionnaire"
              link="/questionnaire"
              c="var(--prune-primary-700)"
              fz={14}
              px={0}
              fw={600}
            />
          </Group>
        </Box>
      </div>
    </main>
  );
}

export default function LoginWithSuspense() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}
