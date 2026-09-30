import { Box, Flex, Group, Text, Title } from "@mantine/core";
import Image from "next/image";
import { Suspense } from "react";

import styles from "@/ui/styles/auth.module.scss";
import LogoWhite from "@/assets/LogoWhite.png";
import Photo1 from "@/assets/questionnaire/questionnaire1.png";

import { checkOnboardingInvite } from "@/lib/actions/server";
import { PrimaryBtn } from "@/ui/components/Buttons";
import OnboardingForm from "./form";

type Props = {
  params: { id: string };
  searchParams: { token?: string };
};

export default async function OnboardingInvitePage({ params, searchParams }: Props) {
  const reference = params.id;
  const token = searchParams.token ?? "";

  const invite = await checkOnboardingInvite(reference, token);

  return (
    <main className={styles.login}>
      {/* Left sidebar */}
      <div className={styles.login__frame}>
        <div className={styles.bg__image}>
          <Image
            src={Photo1}
            alt="onboarding background"
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

      {/* Right panel */}
      <div className={styles.login__paper}>
        <Group gap={2} pos="absolute" top={36} right={43} justify="flex-end">
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
            Create Account
          </Title>

          <Text className={styles.paper__text}>
            {invite.contactName
              ? `Welcome, ${invite.contactName}. Set up your password to get started.`
              : "Set up your password to get started."}
          </Text>

          <Suspense>
            <OnboardingForm
              email={invite.email}
              contactName={invite.contactName}
              businessName={invite.businessName}
            />
          </Suspense>
        </Box>
      </div>
    </main>
  );
}
