"use client";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import {
  Paper,
  Button,
  Title,
  Box,
  Group,
  TextInput,
  Select,
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
              label="Plan Name"
              placeholder="Enter plan name"
              // value={planName}
              // onChange={(e) => setPlanName(e.currentTarget.value)}
            />

            <Select
              data={["Monthly", "Annually"]}
              flex={1}
              label="Cycle"
              placeholder="Select cycle"
            />
          </Group>
        </Box>
      </Paper>
    </main>
  );
}
