"use client";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import { MultiSelectCreatable } from "@/ui/components/SelectCreatable";
import {
  Paper,
  Button,
  Title,
  Box,
  Group,
  TextInput,
  Select,
  NumberInput,
  Textarea,
  Text,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function CreateNewPlan() {
  const { back } = useRouter();
  return (
    <main>
      <Breadcrumbs
        items={[
          { title: "Pricing Plan", href: "/admin/pricing-plan" },
          {
            title: "New Plan",
            href: `/admin/pricing-plan/new`,
          },
        ]}
      />

      <Paper mih="calc(100vh - 150px)" px={28} py={32} mt={16} radius="xs">
        <Button
          fz={14}
          c="var(--prune-text-gray-500)"
          fw={400}
          px={0}
          variant="transparent"
          onClick={back}
          leftSection={
            <IconArrowLeft
              color="#1D2939"
              style={{ width: "70%", height: "70%" }}
            />
          }
        >
          Pricing Plans
        </Button>

        <Title order={1} fz={24} fw={500} mt={28} mb={32}>
          Create New Plan
        </Title>

        {/* Form goes here */}
        <Box component="form">
          <Group>
            {/* Plan Name */}
            <TextInput
              required
              flex={1}
              // label="Plan Name"
              placeholder="Plan name"
              // value={planName}
              // onChange={(e) => setPlanName(e.currentTarget.value)}
            />

            <Select
              data={["Monthly", "Annually"]}
              flex={1}
              // label="Cycle"
              placeholder="Billing Cycle"
            />
          </Group>

          <NumberInput placeholder="Amount" required mt={24} />

          <Textarea
            placeholder="Describe what business can use this plan here..."
            autosize
            minRows={5}
            maxRows={5}
            mt={24}
            h={88}
            mb={60}
          />

          <Text mb={21} fz={16} fw={500}>
            Features:
          </Text>

          <MultiSelectCreatable />
        </Box>
      </Paper>
    </main>
  );
}
