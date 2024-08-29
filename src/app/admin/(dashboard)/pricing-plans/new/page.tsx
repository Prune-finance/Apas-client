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
import { IconSearch, IconX } from "@tabler/icons-react";
import useNotification from "@/lib/hooks/notification";
import { useState } from "react";
import axios from "axios";
import { parseError } from "@/lib/actions/auth";
import classes from "../styles.module.scss";

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
        { ...rest, description },
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
              // withAsterisk
              size="lg"
              classNames={{
                input: classes.custom_input,
              }}
              flex={1}
              radius={4}
              label={
                <Text fz={14}>
                  Plan Name <span style={{ color: "red" }}>*</span>
                </Text>
              }
              placeholder="Enter Plan Name"
              {...form.getInputProps("name")}
            />

            <Select
              data={["Monthly", "Annually"]}
              flex={1}
              size="lg"
              classNames={{
                input: classes.custom_input,
                option: classes.dropdown_custom,
              }}
              label={
                <Text fz={14}>
                  Billing Cycle <span style={{ color: "red" }}>*</span>
                </Text>
              }
              placeholder="Select Billing Cycle"
              {...form.getInputProps("cycle")}
            />
          </Group>

          <NumberInput
            placeholder="Enter Amount"
            size="lg"
            label={
              <Text fz={14}>
                Amount <span style={{ color: "red" }}>*</span>
              </Text>
            }
            classNames={{
              input: classes.custom_input,
            }}
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
            classNames={{
              input: classes.custom_textarea,
            }}
            {...form.getInputProps("description")}
          />

          <Select
            data={[
              "Search existing features and press Enter to add them.",
              "The feature selected shows down here as a sentence.",
              "The feature selected shows down",
            ]}
            flex={1}
            size="lg"
            classNames={{
              input: classes.custom_input,
              option: classes.dropdown_custom,
            }}
            leftSection={<IconSearch size={18} color="#667085" />}
            label={<Text fz={14}>Features:</Text>}
            placeholder="Search existing features and press Enter to add them."
            {...form.getInputProps("features")}
          />

          {/* <MultiSelectCreatable /> */}

          <Group justify="flex-end" gap={20} mt={24}>
            <SecondaryBtn
              text="Clear"
              action={open}
              w={126}
              h={40}
              radius={4}
              fz={14}
              fw={500}
            />

            <PrimaryBtn
              text="Submit"
              action={() => {}}
              type="submit"
              loading={processing}
              w={126}
              h={40}
              radius={4}
              fz={14}
              fw={500}
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
