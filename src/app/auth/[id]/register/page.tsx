import { Box, Flex, Group, Text, Title } from "@mantine/core";
import Image from "next/image";

import styles from "@/ui/styles/auth.module.scss";
import PruneIcon from "@/assets/icon.png";
import signInBg from "@/assets/auth-bg/sign-in.png";

import FormComponent from "./form";
import { checkToken } from "@/lib/actions/server";
import { PrimaryBtn } from "@/ui/components/Buttons";

type Props = {
  params: {
    id?: string;
  };
};

export default async function Register({ params }: Props) {
  const id = params.id;
  const res = await checkToken(id || "");

  return (
    <main className={styles.login}>
      {/* Left sidebar — same as login */}
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
          <Image width={29} height={29} src={PruneIcon} alt="prune icon" />

          <Title order={2} className={styles.paper__header}>
            Create Account
          </Title>

          <Text className={styles.paper__text}>
            Create your payment account now
          </Text>

          <FormComponent email={res.email} />

          <Group gap={4} mt={16}>
            <Text fz={14} c="var(--prune-text-gray-600)">
              Already have an account?
            </Text>
            <PrimaryBtn
              variant="transparent"
              text="Sign In"
              link="/auth/login"
              c="var(--prune-primary-700)"
              fz={14}
              px={0}
              fw={600}
            />
          </Group>

          <Flex gap={4} align="center" wrap="wrap" mt={12}>
            <Text fz={14} c="var(--prune-text-gray-600)">
              By clicking on Sign Up, you agree to our
            </Text>
            <PrimaryBtn
              text="Privacy Policy"
              variant="transparent"
              fz={14}
              fw={600}
              p={0}
              m={0}
              c="var(--prune-primary-800)"
              link="https://prunepayments.com/privacy-policy"
              h="auto"
            />
            <Text fz={14} c="var(--prune-text-gray-600)">
              and
            </Text>
            <PrimaryBtn
              text="Terms of Use"
              variant="transparent"
              fz={14}
              fw={600}
              p={0}
              m={0}
              c="var(--prune-primary-800)"
              link="https://prunepayments.com/terms-and-conditions"
              h="auto"
            />
          </Flex>
        </Box>
      </div>
    </main>
  );
}
