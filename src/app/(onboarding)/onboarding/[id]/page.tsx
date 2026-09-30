import { Box, Flex, Group, Stack, Text, Title } from "@mantine/core";
import Image from "next/image";
import { Suspense } from "react";

import LogoWhite from "@/assets/LogoWhite.png";
import Photo1 from "@/assets/questionnaire/questionnaire1.png";

import { checkOnboardingInvite } from "@/lib/actions/server";
import { PrimaryBtn } from "@/ui/components/Buttons";
import OnboardingInviteForm from "./form";

type Props = {
  params: { id: string };
  searchParams: { token?: string };
};

export default async function OnboardingInvitePage({ params, searchParams }: Props) {
  const reference = params.id;
  const token = searchParams.token ?? "";

  const invite = await checkOnboardingInvite(reference, token);

  return (
    <Box pos="fixed" top={0} left={0} right={0} bottom={0} style={{ zIndex: 100, background: "#fff" }}>
      <Flex h="100%" w="100%">
        {/* Left sidebar — hidden below md */}
        <Box
          pos="relative"
          w={{ base: 0, md: "45%" }}
          style={{ flexShrink: 0, overflow: "hidden" }}
          visibleFrom="md"
        >
          <Image
            src={Photo1}
            alt="onboarding background"
            fill
            style={{ objectFit: "cover", objectPosition: "center top" }}
            priority
          />
          {/* gradient overlay */}
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
              Create Account
            </Title>

            <Text fz={14} mt={10} c="var(--prune-text-gray-600)">
              {invite.contactName
                ? `Welcome, ${invite.contactName.charAt(0).toUpperCase() + invite.contactName.slice(1)}. Set up your password to get started.`
                : "Set up your password to get started."}
            </Text>

            <Suspense>
              <OnboardingInviteForm
                email={invite.email}
                contactName={invite.contactName}
                businessName={invite.businessName}
              />
            </Suspense>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
