import { Box, Flex, Group, Stack, Text, Title } from "@mantine/core";
import { Suspense } from "react";
import Image from "next/image";

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
    <Flex h="100vh" w="100%">
      {/* Left sidebar — hidden below md */}
      <Box
        pos="relative"
        w={{ base: 0, md: "45%" }}
        style={{ flexShrink: 0, overflow: "hidden" }}
        visibleFrom="md"
      >
        <Image
          src={signInBg}
          alt="sign in background"
          fill
          style={{ objectFit: "cover", objectPosition: "center top" }}
          priority
        />
        <Box
          pos="absolute"
          top={0} left={0} right={0} bottom={0}
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.6) 7.8%, rgba(0,0,0,0) 33.6%)",
            zIndex: 1,
          }}
        />

        <Stack justify="space-between" h="100%" p={32} pos="relative" style={{ zIndex: 2 }}>
          <Group gap={8} wrap="nowrap">
            <Image src={LogoWhite} height={36} alt="Prune logo" style={{ width: "auto" }} />
          </Group>

          <Stack gap={4}>
            <Title order={2} c="white" fz={24} fw={700} lh={1.2} mb={12}>
              Just what I needed to settle my distributors.
            </Title>
            <Text fz={16} fw={700} c="white">Karen Yue</Text>
            <Text fz={14} fw={400} c="white">Director of Digital Marketing Technology</Text>
          </Stack>
        </Stack>
      </Box>

      {/* Right panel */}
      <Flex
        flex={1}
        direction="column"
        align="center"
        justify="center"
        pos="relative"
        px={{ base: 24, sm: 50 }}
        py={40}
        bg="#fff"
        style={{ overflowY: "auto" }}
      >
        <Group gap={2} pos="absolute" top={36} right={43} justify="flex-end">
          <Text fz={14} c="var(--prune-text-gray-600)">Having Issues?</Text>
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

        <Box w="100%" maw={394}>
          <Title order={2} fz={32} mt={24} c="var(--prune-text-gray-700)" lh={1.2}>
            Login
          </Title>

          <Text fz={14} mt={10} c="var(--prune-text-gray-600)">
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
      </Flex>
    </Flex>
  );
}

export default function LoginWithSuspense() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}
