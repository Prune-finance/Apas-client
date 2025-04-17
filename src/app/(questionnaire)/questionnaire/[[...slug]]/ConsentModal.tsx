import { PrimaryBtn } from "@/ui/components/Buttons";
import { Box, Flex, Modal, NumberInput, rem, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { TextInputWithInsideLabel } from "./TextInputWithInsideLabel";
import { SelectCountryDialCode } from "@/ui/components/SelectDropdownSearch";
import styles from "./styles.module.scss";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";

interface ConsentModalProps {
  opened: boolean;
  close: () => void;
}

export default function ConsentModal({ opened, close }: ConsentModalProps) {
  const [firstLoad, setFirstLoad] = useState(true);
  const [loading, setLoading] = useState(false);

  const schema = z.object({
    name: z.string().min(1, "Name is required"),
    designation: z.string().min(1, "Designation is required"),
    contactNumber: z.string().min(1, "Contact number is required"),
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    contactCountryCode: z.string().min(1, "Country code is required"),
  });

  const form = useForm({
    initialValues: {
      name: "",
      designation: "",
      contactNumber: "",
      email: "",
      contactCountryCode: "+234",
    },
    validate: zodResolver(schema),
  });

  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false);
      return;
    }

    if (form.values.contactCountryCode) {
      const [code] = form.values.contactCountryCode.split("-");
      form.setFieldValue("contactNumber", `${code}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values.contactCountryCode]);

  const select = (
    <SelectCountryDialCode
      value={form.values.contactCountryCode}
      setValue={(value) => form.setFieldValue("contactCountryCode", value)}
    />
  );

  return (
    <Modal
      opened={opened}
      onClose={() => {
        form.reset();
        close();
      }}
      title="Company Profile"
      styles={{
        title: {
          fontSize: "14px",
          fontWeight: 600,
          color: "var(--prune-primary-800)",
        },
      }}
      padding={24}
      centered
    >
      <Text fz={24} fw={700} c="var(--prune-text-gray-700)">
        Contact Person
      </Text>

      <Text my={16} c="var(--prune-text-gray-700)" fw={500} fz={16}>
        Who is filling this form?
      </Text>

      <Box
        display="flex"
        style={{
          flexDirection: "column",
          gap: 24,
        }}
        component="form"
        onSubmit={form.onSubmit((values) => console.log(values))}
      >
        <TextInputWithInsideLabel
          label="Name"
          w="100%"
          {...form.getInputProps("name")}
        />

        <TextInputWithInsideLabel
          label="Designation"
          w="100%"
          {...form.getInputProps("designation")}
        />

        <NumberInput
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          withAsterisk
          type="tel"
          //   label="Contact Phone Number"
          placeholder="00000000"
          // {...form.getInputProps("contactNumber")}
          value={form.values.contactNumber}
          onChange={(value) =>
            form.setFieldValue("contactNumber", String(`+${value}`))
          }
          error={form.errors.contactNumber}
          prefix={"+"}
          leftSection={select}
          hideControls
          leftSectionWidth={50}
          styles={{
            input: {
              paddingLeft: rem(60),
            },
          }}
        />

        <TextInputWithInsideLabel
          label="Email"
          w="100%"
          {...form.getInputProps("email")}
        />

        <Flex justify="end">
          <PrimaryBtn
            text="I Consent"
            fw={600}
            disabled={!form.isDirty()}
            type="submit"
            loading={loading}
          />
        </Flex>
      </Box>
    </Modal>
  );
}
