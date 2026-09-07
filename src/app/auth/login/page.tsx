import { Box, Group, Text, Title } from "@mantine/core";
import { Suspense } from "react";
import Image from "next/image";

import styles from "@/ui/styles/auth.module.scss";
import PruneIcon from "@/assets/icon.png";
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
          <Image width={33} height={33} src={PruneIcon} alt="Prune icon" />
          <Text fz={20} fw={600} c="white" lh={1}>
            Prune Payments
          </Text>
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
