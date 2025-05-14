import { PrimaryBtn } from "@/ui/components/Buttons";
import { Box, Flex, Modal, NumberInput, rem, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";

import { SelectCountryDialCode } from "@/ui/components/SelectDropdownSearch";
import styles from "./styles.module.scss";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useQuestionnaireFormContext } from "@/lib/store/questionnaire";
import { useDisclosure } from "@mantine/hooks";
import {
  PhoneNumberInput,
  TextInputWithInsideLabel,
} from "@/ui/components/InputWithLabel";

interface ConsentModalProps {
  opened: boolean;
  close: () => void;
}

export default function ConsentModal({ opened, close }: ConsentModalProps) {
  const [firstLoad, setFirstLoad] = useState(true);
  const [loading, setLoading] = useState(false);
  const [openedConfirm, { open, close: closeConfirm }] = useDisclosure(false);

  const schema = z.object({
    name: z.string().min(1, "Name is required"),
    designation: z.string().min(1, "Designation is required"),
    signature: z.string().min(1, "Signature is required"),
    contactNumber: z.string().min(1, "Contact number is required"),
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    contactCountryCode: z.string().min(1, "Country code is required"),
  });

  type FormValues = z.infer<typeof schema>;

  const form = useForm({
    initialValues: {
      name: "",
      signature: "",
      designation: "",
      contactNumber: "+234",
      email: "",
      contactCountryCode: "+234",
    },
    validate: zodResolver(schema),
  });

  const handleSubmit = async (values: z.infer<typeof schema>) => {
    setLoading(true);
    try {
      close();
      setTimeout(() => {
        setLoading(false);
      }, 2000);
      console.log({ values });
      form.reset();

      open();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => {
          form.reset();
          close();
        }}
        title="Onboarding"
        styles={{
          title: {
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--prune-primary-800)",
          },
        }}
        padding={24}
        centered
        size={498}
      >
        <Text fz={24} fw={700} c="var(--prune-text-gray-700)">
          Confirm your consent to our Term of Use
        </Text>

        <Text my={16} c="var(--prune-text-gray-700)" fw={500} fz={16}>
          A signed copied of your consent would be sent to your email.
        </Text>

        <Box
          display="flex"
          style={{
            flexDirection: "column",
            gap: 24,
          }}
          component="form"
          onSubmit={form.onSubmit((values) => handleSubmit(values))}
        >
          <TextInputWithInsideLabel
            label="Signed by"
            placeholder="Enter Name"
            w="100%"
            {...form.getInputProps("name")}
          />

          <TextInputWithInsideLabel
            label="Designation"
            placeholder="Enter Designation"
            w="100%"
            {...form.getInputProps("designation")}
          />

          <TextInputWithInsideLabel
            label="Signature"
            placeholder="Enter Signature"
            w="100%"
            {...form.getInputProps("signature")}
          />

          {/* <NumberInput
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
          /> */}

          <PhoneNumberInput<FormValues>
            form={form}
            phoneNumberKey="contactNumber"
            countryCodeKey="contactCountryCode"
          />

          <TextInputWithInsideLabel
            label="Email"
            placeholder="Enter Email"
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
    </>
  );
}
