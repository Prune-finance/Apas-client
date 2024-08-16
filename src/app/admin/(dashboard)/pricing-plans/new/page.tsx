"use client";
import Cookies from "js-cookie";

import { BackBtn, PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
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
import { useRouter } from "next/navigation";
import { useForm, zodResolver } from "@mantine/form";
import {
  newPricingPlan,
  pricingPlanSchema,
  PricingPlanType,
} from "@/lib/schema";
import { useDisclosure } from "@mantine/hooks";
import ModalComponent from "@/ui/components/Modal";
import { IconX } from "@tabler/icons-react";
import useNotification from "@/lib/hooks/notification";
import { useState } from "react";
import axios from "axios";
import { parseError } from "@/lib/actions/auth";

export default function CreateNewPlan() {
  const [opened, { open, close }] = useDisclosure(false);
  const { handleError, handleSuccess } = useNotification();
  const { push } = useRouter();

  const [processing, setProcessing] = useState(false);

  const form = useForm<PricingPlanType>({
    initialValues: newPricingPlan,
    validate: zodResolver(pricingPlanSchema),
  });

  const handleSubmit = async () => {
    setProcessing(true);
    const { description, ...rest } = form.values;
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/pricing-plan`,
        { ...rest },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      push("/admin/pricing-plans");
      handleSuccess(
        "Successful! Creating Pricing Plan",
        `${form.values.name} plan was successfully created`
      );
    } catch (error) {
      handleError("Creating Pricing Plan Failed", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main>
      <Breadcrumbs
        items={[
          { title: "Pricing Plan", href: "/admin/pricing-plans" },
          {
            title: "New Plan",
            href: `/admin/pricing-plans/new`,
          },
        ]}
      />

      <Paper mih="calc(100vh - 150px)" px={28} py={32} mt={16} radius="xs">
        <BackBtn text="Pricing Plans" />

        <Title order={1} fz={24} fw={500} mt={28} mb={32}>
          Create New Plan
        </Title>

        {/* Form goes here */}
        <Box component="form" onSubmit={form.onSubmit(() => handleSubmit())}>
          <Group>
            {/* Plan Name */}
            <TextInput
              withAsterisk
              flex={1}
              label="Plan Name"
              placeholder="Enter Plan Name"
              {...form.getInputProps("name")}
            />

            <Select
              data={["Monthly", "Annually"]}
              flex={1}
              withAsterisk
              label="Billing Cycle"
              placeholder="Select Billing Cycle"
              {...form.getInputProps("cycle")}
            />
          </Group>

          <NumberInput
            label="Amount"
            placeholder="Enter Amount"
            withAsterisk
            mt={24}
            min={0}
            allowNegative={false}
            {...form.getInputProps("cost")}
          />

          <Textarea
            placeholder="Describe what business can use this plan here..."
            autosize
            minRows={5}
            maxRows={5}
            mt={24}
            h={88}
            mb={60}
            {...form.getInputProps("description")}
          />

          {/* <Text mb={21} fz={16} fw={500}>
            Features:
          </Text>

          <MultiSelectCreatable /> */}

          <Group justify="flex-end" gap={20}>
            <SecondaryBtn text="Clear" action={open} />

            <PrimaryBtn
              text="Submit"
              action={() => {}}
              type="submit"
              loading={processing}
            />
          </Group>
        </Box>
      </Paper>

      <ModalComponent
        opened={opened}
        close={close}
        icon={<IconX color="var(--prune-warning)" />}
        title="Clear Form?"
        text="Are you sure you want to clear this form? All entered data will be permanently lost."
        action={() => {
          form.reset();
          close();
        }}
        color="hsl(from var(--prune-warning) h s l / .1)"
      />
    </main>
  );
}
