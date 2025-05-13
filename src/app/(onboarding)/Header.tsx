import Onboarding from "@/lib/store/onboarding";
import {
  Container,
  Flex,
  Stack,
  Group,
  ThemeIcon,
  Button,
  Text,
} from "@mantine/core";
import { IconHeadset, IconLogout } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

export default function Header() {
  const { business } = Onboarding();
  return (
    <Container size={1200} h="100%">
      <Flex justify="space-between" align="center" h="100%">
        <Stack gap={4}>
          <Text fz={16} fw={500} c="var(--prune-text-gray-700)" lh={1}>
            Hello, {business?.businessName || ""}
          </Text>
          <Text fz={14} fw={400} c="var(--prune-text-gray-500)" lh={1}>
            You’re one step closer to your API account
          </Text>
        </Stack>

        <Group gap={34}>
          <Group>
            <ThemeIcon
              variant="light"
              color="var(--prune-text-gray-700)"
              radius="xl"
              size={32}
            >
              <IconHeadset />
            </ThemeIcon>
            <Text fz={14}>
              Need Help?{" "}
              <Text
                span
                inherit
                component={Link}
                href={"onboarding/contact"}
                c="var(--prune-primary-800)"
              >
                Contact Support
              </Text>
            </Text>
          </Group>

          <Button
            rightSection={<IconLogout />}
            variant="transparent"
            fz={14}
            fw={500}
            color="var(--prune-warning)"
          >
            Logout
          </Button>
        </Group>
      </Flex>
    </Container>
  );
}
