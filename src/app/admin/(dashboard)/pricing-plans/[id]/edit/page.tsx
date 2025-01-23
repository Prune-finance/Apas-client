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
  Flex,
} from "@mantine/core";
import { useParams, useRouter } from "next/navigation";
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
import { useEffect, useState } from "react";
import axios from "axios";
import { parseError } from "@/lib/actions/auth";
import { useSinglePricingPlan } from "@/lib/hooks/pricing-plan";
import classes from "@/app/admin/(dashboard)/pricing-plans/styles.module.scss";

export default function EditPlan() {
  const params = useParams<{ id: string }>();
  const [opened, { open, close }] = useDisclosure(false);
  const { handleError, handleSuccess } = useNotification();
  const { push } = useRouter();
  const { loading, pricingPlan } = useSinglePricingPlan(params.id);

  const [processing, setProcessing] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [value, setValue] = useState<string[]>([]);

  const initialPlan: PricingPlanType = {
    cycle: pricingPlan?.cycle || "",
    cost: pricingPlan?.cost,
    name: pricingPlan?.name || "",
    description: "",
  };

  const form = useForm<PricingPlanType>({
    initialValues: initialPlan,
    validate: zodResolver(pricingPlanSchema),
  });

  useEffect(() => {
    if (!loading && pricingPlan)
      return form.initialize({
        name: pricingPlan.name,
        cost: pricingPlan.cost,
        description: pricingPlan.description,
        features: pricingPlan.features,
        cycle: pricingPlan.cycle,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pricingPlan, loading]);

  useEffect(() => {
    if (pricingPlan?.features) {
      setValue(pricingPlan.features);
      setSelectedValues(pricingPlan.features);
    }
  }, [pricingPlan]);

  const handleSubmit = async () => {
    setProcessing(true);
    const { description, ...rest } = form.values;
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/pricing-plan/${params.id}`,
        { ...form.values, features: selectedValues },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      push("/admin/pricing-plans");
      handleSuccess(
        "Successful! Pricing Plan Update",
        `${form.values.name} plan was successfully updated`
      );
    } catch (error) {
      handleError("Updating Pricing Plan Failed", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = (item: string) => {
    setSelectedValues((current) => current.filter((v) => v !== item));
    setValue((current) => current.filter((v) => v !== item));
  };

  return (
    <main>
      <Breadcrumbs
        items={[
          { title: "Pricing Plan", href: "/admin/pricing-plans" },
          {
            title: `Edit "${pricingPlan?.name}" plan`,
            href: `/admin/pricing-plans/${params.id}/edit`,
            loading: loading,
          },
        ]}
      />

      <Paper mih="calc(100vh - 150px)" px={28} py={32} mt={16} radius="xs">
        <BackBtn text="Pricing Plans" />

        <Title order={1} fz={24} fw={500} mt={28} mb={32}>
          Edit Plan
        </Title>

        {/* Form goes here */}
        <Box component="form" onSubmit={form.onSubmit(() => handleSubmit())}>
          <Group>
            {/* Plan Name */}
            <TextInput
              // withAsterisk
              flex={1}
              size="lg"
              classNames={{
                input: classes.custom_input,
              }}
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
              // withAsterisk
              size="lg"
              label={
                <Text fz={14}>
                  Billing Cycle <span style={{ color: "red" }}>*</span>
                </Text>
              }
              placeholder="Select Billing Cycle"
              classNames={{
                input: classes.custom_input,
                option: classes.dropdown_custom,
              }}
              {...form.getInputProps("cycle")}
            />
          </Group>

          <NumberInput
            label={
              <Text fz={14}>
                Amount <span style={{ color: "red" }}>*</span>
              </Text>
            }
            placeholder="Enter Amount"
            // withAsterisk
            mt={24}
            min={0}
            allowNegative={false}
            size="lg"
            classNames={{
              input: classes.custom_input,
            }}
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

          <MultiSelectCreatable
            setSelectedValues={setSelectedValues}
            value={value}
            setValue={setValue}
            placeholder="Search existing features and press Enter to add them."
            multiSelectData={pricingPlan?.features}
          />
          <Flex align="center" gap={10} mt={20}>
            {selectedValues?.length > 0 &&
              selectedValues.map((item) => (
                <Flex
                  key={item}
                  align="center"
                  gap={18}
                  p={10}
                  bg="#f9fafb"
                  style={{ borderRadius: 4, border: "1px solid #f2f4f7" }}
                >
                  <Text fz={12} fw={500} c="#344054">
                    {item}
                  </Text>
                  <IconX
                    size={16}
                    color="#344054"
                    // onClick={() =>
                    //   setSelectedValues((current) =>
                    //     current.filter((v) => v !== item)
                    //   )
                    // }
                    onClick={() => handleDelete(item)}
                  />
                </Flex>
              ))}
          </Flex>

          <Group justify="flex-end" gap={20}>
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
